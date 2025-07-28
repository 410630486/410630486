// 校務系統伺服器 - 使用 MongoDB 或檔案系統後端
require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const databaseAdapter = require('./database/adapter');

const app = express();
const PORT = process.env.NODE_PORT || 3000;

// 中介軟體
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 靜態檔案服務
app.use(express.static(path.join(__dirname)));

// 初始化資料庫連接
async function initializeDatabase() {
    try {
        await databaseAdapter.initialize();
        console.log(`✅ 資料庫初始化完成 (${databaseAdapter.getBackendType()})`);
    } catch (error) {
        console.error('❌ 資料庫初始化失敗:', error.message);
        process.exit(1);
    }
}

// 登入 API
app.post('/api/login', async (req, res) => {
    const { username, password, userType } = req.body;
    
    try {
        // 從資料庫獲取使用者
        const user = await databaseAdapter.getUserByUsername(username);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '帳號不存在'
            });
        }

        // 驗證密碼（支援明文和加密密碼）
        let passwordMatch = false;
        
        // 先嘗試明文比對（向下相容）
        if (user.password === password) {
            passwordMatch = true;
        } else {
            // 嘗試 bcrypt 比對
            try {
                passwordMatch = await bcrypt.compare(password, user.password);
            } catch (error) {
                console.log('密碼比對錯誤:', error.message);
                passwordMatch = false;
            }
        }
        
        if (passwordMatch && user.userType === userType) {
            // 更新最後登入時間
            await databaseAdapter.updateLastLogin(username);
            
            res.json({
                success: true,
                message: '登入成功',
                user: {
                    id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    userType: user.userType,
                    department: user.department,
                    studentId: user.studentId,
                    grade: user.grade,
                    semester: user.semester
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: '帳號、密碼或身份類型錯誤'
            });
        }
    } catch (error) {
        console.error('登入錯誤:', error);
        res.status(500).json({
            success: false,
            message: '伺服器錯誤'
        });
    }
});

// 獲取課程資料 API
app.get('/api/courses', async (req, res) => {
    try {
        const { semester } = req.query;
        let courses;
        
        if (semester) {
            courses = await databaseAdapter.getCoursesBySemester(semester);
        } else {
            courses = await databaseAdapter.getAllCourses();
        }
        
        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('獲取課程資料錯誤:', error);
        res.status(500).json({
            success: false,
            message: '無法獲取課程資料'
        });
    }
});

// 學生選課記錄 API
app.get('/api/student/:studentId/enrollment/:semester', async (req, res) => {
    try {
        const { studentId, semester } = req.params;
        const enrollment = await databaseAdapter.getStudentEnrollment(studentId, semester);
        
        res.json({
            success: true,
            data: enrollment || { courses: [], totalCredits: 0 }
        });
    } catch (error) {
        console.error('獲取選課記錄錯誤:', error);
        res.status(500).json({
            success: false,
            message: '無法獲取選課記錄'
        });
    }
});

// 學生加選課程 API
app.post('/api/student/:studentId/enroll', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { courseId, semester } = req.body;
        
        // 執行選課
        await databaseAdapter.enrollCourse(studentId, semester, courseId);
        
        // 獲取課程資訊用於歷史記錄
        const course = await databaseAdapter.getCourseById(courseId);
        
        // 添加歷史記錄
        await databaseAdapter.addEnrollmentHistory({
            studentId,
            action: '加選',
            courseId,
            courseName: course.name,
            instructor: course.instructor,
            semester,
            result: '選課成功'
        });
        
        res.json({
            success: true,
            message: '選課成功'
        });
    } catch (error) {
        console.error('選課錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message || '選課失敗'
        });
    }
});

// 學生退選課程 API
app.delete('/api/student/:studentId/enroll', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { courseId, semester } = req.body;
        
        // 獲取課程資訊用於歷史記錄
        const course = await databaseAdapter.getCourseById(courseId);
        
        // 執行退選
        await databaseAdapter.dropCourse(studentId, semester, courseId);
        
        // 添加歷史記錄
        await databaseAdapter.addEnrollmentHistory({
            studentId,
            action: '退選',
            courseId,
            courseName: course.name,
            instructor: course.instructor,
            semester,
            result: '退選成功'
        });
        
        res.json({
            success: true,
            message: '退選成功'
        });
    } catch (error) {
        console.error('退選錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message || '退選失敗'
        });
    }
});

// 學生選課歷史 API
app.get('/api/student/:studentId/history', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { limit = 20 } = req.query;
        
        const history = await databaseAdapter.getStudentEnrollmentHistory(studentId, parseInt(limit));
        
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('獲取選課歷史錯誤:', error);
        res.status(500).json({
            success: false,
            message: '無法獲取選課歷史'
        });
    }
});

// 學生資料 API
app.get('/api/student/info', (req, res) => {
    // 模擬學生資料
    res.json({
        success: true,
        data: {
            name: '張三',
            studentId: 'S001',
            department: '資訊工程系',
            grade: '二年級'
        }
    });
});

// 學生成績 API
app.get('/api/student/grades', (req, res) => {
    res.json({
        success: true,
        data: {
            grades: [
                { subject: '程式設計基礎', credits: 3, score: 85, grade: 'A' },
                { subject: '資料結構', credits: 3, score: 78, grade: 'B+' },
                { subject: '微積分', credits: 4, score: 92, grade: 'A+' }
            ]
        }
    });
});

// 管理員 API - 獲取所有使用者
app.get('/api/admin/users', async (req, res) => {
    try {
        // 這裡可以添加管理員權限檢查
        res.json({
            success: true,
            data: [] // 暫時返回空陣列，可根據需要實作
        });
    } catch (error) {
        console.error('獲取使用者資料錯誤:', error);
        res.status(500).json({
            success: false,
            message: '伺服器錯誤'
        });
    }
});

// 管理員 API - 獲取系統統計
app.get('/api/admin/stats', async (req, res) => {
    try {
        // 這裡可以添加實際的統計資料查詢
        const stats = {
            totalUsers: 0,
            totalStudents: 0,
            totalStaff: 0,
            totalCourses: 0,
            usersByType: {
                student: 0,
                staff: 0,
                hr: 0,
                admin: 0
            }
        };
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('獲取統計資料錯誤:', error);
        res.status(500).json({
            success: false,
            message: '伺服器錯誤'
        });
    }
});

// 管理員 API - 獲取系統日誌
app.get('/api/admin/logs', (req, res) => {
    const mockLogs = [
        {
            id: 1,
            timestamp: new Date().toISOString(),
            level: 'info',
            user: 'admin',
            action: '登入系統',
            ip: '192.168.1.100',
            details: '管理員登入成功'
        },
        {
            id: 2,
            timestamp: new Date(Date.now() - 300000).toISOString(),
            level: 'warning',
            user: 'student',
            action: '登入失敗',
            ip: '192.168.1.101',
            details: '密碼錯誤'
        },
        {
            id: 3,
            timestamp: new Date(Date.now() - 600000).toISOString(),
            level: 'info',
            user: 'staff',
            action: '查看成績',
            ip: '192.168.1.102',
            details: '查看課程 CS101 成績'
        }
    ];
    
    res.json({
        success: true,
        data: mockLogs
    });
});

// === 圖書館 API ===

// 獲取所有書籍
app.get('/api/library/books', async (req, res) => {
    try {
        const books = await databaseAdapter.getAllBooks();
        res.json({
            success: true,
            data: books
        });
    } catch (error) {
        console.error('獲取書籍資料錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取書籍資料失敗'
        });
    }
});

// 搜尋書籍
app.get('/api/library/books/search', async (req, res) => {
    try {
        const { q: query } = req.query;
        const books = await databaseAdapter.searchBooks(query);
        res.json({
            success: true,
            data: books
        });
    } catch (error) {
        console.error('搜尋書籍錯誤:', error);
        res.status(500).json({
            success: false,
            message: '搜尋書籍失敗'
        });
    }
});

// 借書
app.post('/api/library/borrow', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        
        if (!userId || !bookId) {
            return res.status(400).json({
                success: false,
                message: '缺少必要參數'
            });
        }
        
        const borrowRecord = await databaseAdapter.borrowBook(userId, bookId);
        res.json({
            success: true,
            message: '借書成功',
            data: borrowRecord
        });
    } catch (error) {
        console.error('借書錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 還書
app.post('/api/library/return', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        
        if (!userId || !bookId) {
            return res.status(400).json({
                success: false,
                message: '缺少必要參數'
            });
        }
        
        const result = await databaseAdapter.returnBook(userId, bookId);
        res.json({
            success: true,
            message: '還書成功',
            data: result
        });
    } catch (error) {
        console.error('還書錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 續借
app.post('/api/library/renew', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        
        if (!userId || !bookId) {
            return res.status(400).json({
                success: false,
                message: '缺少必要參數'
            });
        }
        
        const borrowRecord = await databaseAdapter.renewBook(userId, bookId);
        res.json({
            success: true,
            message: '續借成功',
            data: borrowRecord
        });
    } catch (error) {
        console.error('續借錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 預約書籍
app.post('/api/library/reserve', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        
        if (!userId || !bookId) {
            return res.status(400).json({
                success: false,
                message: '缺少必要參數'
            });
        }
        
        const reserveRecord = await databaseAdapter.reserveBook(userId, bookId);
        res.json({
            success: true,
            message: '預約成功',
            data: reserveRecord
        });
    } catch (error) {
        console.error('預約錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 取消預約
app.post('/api/library/cancel-reserve', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        
        if (!userId || !bookId) {
            return res.status(400).json({
                success: false,
                message: '缺少必要參數'
            });
        }
        
        const result = await databaseAdapter.cancelReservation(userId, bookId);
        res.json({
            success: true,
            message: '取消預約成功',
            data: result
        });
    } catch (error) {
        console.error('取消預約錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 獲取使用者借閱記錄
app.get('/api/library/user/:userId/borrowed', async (req, res) => {
    try {
        const { userId } = req.params;
        const borrowedBooks = await databaseAdapter.getUserBorrowedBooks(userId);
        res.json({
            success: true,
            data: borrowedBooks
        });
    } catch (error) {
        console.error('獲取借閱記錄錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取借閱記錄失敗'
        });
    }
});

// 獲取使用者預約記錄
app.get('/api/library/user/:userId/reserved', async (req, res) => {
    try {
        const { userId } = req.params;
        const reservedBooks = await databaseAdapter.getUserReservedBooks(userId);
        res.json({
            success: true,
            data: reservedBooks
        });
    } catch (error) {
        console.error('獲取預約記錄錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取預約記錄失敗'
        });
    }
});

// 獲取使用者借閱歷史
app.get('/api/library/user/:userId/history', async (req, res) => {
    try {
        const { userId } = req.params;
        const borrowHistory = await databaseAdapter.getUserBorrowHistory(userId);
        res.json({
            success: true,
            data: borrowHistory
        });
    } catch (error) {
        console.error('獲取借閱歷史錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取借閱歷史失敗'
        });
    }
});

// === 人事管理 API ===

// 獲取所有部門
app.get('/api/hr/departments', async (req, res) => {
    try {
        const departments = await databaseAdapter.getAllDepartments();
        res.json({
            success: true,
            data: departments
        });
    } catch (error) {
        console.error('獲取部門資料錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取部門資料失敗'
        });
    }
});

// 獲取所有員工
app.get('/api/hr/employees', async (req, res) => {
    try {
        const { department, search } = req.query;
        const employees = await databaseAdapter.searchEmployees(search, department);
        res.json({
            success: true,
            data: employees
        });
    } catch (error) {
        console.error('獲取員工資料錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取員工資料失敗'
        });
    }
});

// 獲取員工詳情
app.get('/api/hr/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await databaseAdapter.getEmployeeById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: '員工不存在'
            });
        }
        res.json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error('獲取員工詳情錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取員工詳情失敗'
        });
    }
});

// 新增員工
app.post('/api/hr/employees', async (req, res) => {
    try {
        const employee = await databaseAdapter.addEmployee(req.body);
        res.json({
            success: true,
            message: '員工新增成功',
            data: employee
        });
    } catch (error) {
        console.error('新增員工錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 更新員工
app.put('/api/hr/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await databaseAdapter.updateEmployee(id, req.body);
        res.json({
            success: true,
            message: '員工資料更新成功',
            data: employee
        });
    } catch (error) {
        console.error('更新員工錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 刪除員工
app.delete('/api/hr/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await databaseAdapter.deleteEmployee(id);
        res.json({
            success: true,
            message: '員工刪除成功'
        });
    } catch (error) {
        console.error('刪除員工錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// === 考勤管理 API ===

// 獲取考勤記錄
app.get('/api/hr/attendance', async (req, res) => {
    try {
        const { date, department, employee } = req.query;
        const records = await databaseAdapter.getAttendanceRecords(date, department, employee);
        res.json({
            success: true,
            data: records
        });
    } catch (error) {
        console.error('獲取考勤記錄錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取考勤記錄失敗'
        });
    }
});

// 獲取考勤統計
app.get('/api/hr/attendance/stats', async (req, res) => {
    try {
        const { date, department } = req.query;
        const stats = await databaseAdapter.getAttendanceStats(date, department);
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('獲取考勤統計錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取考勤統計失敗'
        });
    }
});

// 上班打卡
app.post('/api/hr/attendance/clock-in', async (req, res) => {
    try {
        const { employeeId, time } = req.body;
        const result = await databaseAdapter.clockIn(employeeId, time);
        res.json({
            success: true,
            message: '上班打卡成功',
            data: result
        });
    } catch (error) {
        console.error('上班打卡錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 下班打卡
app.post('/api/hr/attendance/clock-out', async (req, res) => {
    try {
        const { employeeId, time } = req.body;
        const result = await databaseAdapter.clockOut(employeeId, time);
        res.json({
            success: true,
            message: '下班打卡成功',
            data: result
        });
    } catch (error) {
        console.error('下班打卡錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 新增考勤記錄
app.post('/api/hr/attendance', async (req, res) => {
    try {
        const record = await databaseAdapter.addAttendanceRecord(req.body);
        res.json({
            success: true,
            message: '考勤記錄新增成功',
            data: record
        });
    } catch (error) {
        console.error('新增考勤記錄錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 更新考勤記錄
app.put('/api/hr/attendance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const record = await databaseAdapter.updateAttendanceRecord(id, req.body);
        res.json({
            success: true,
            message: '考勤記錄更新成功',
            data: record
        });
    } catch (error) {
        console.error('更新考勤記錄錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// === 請假管理 API ===

// 獲取請假記錄
app.get('/api/hr/leaves', async (req, res) => {
    try {
        const { employeeId, status } = req.query;
        const leaves = await databaseAdapter.getLeaveRecords(employeeId, status);
        res.json({
            success: true,
            data: leaves
        });
    } catch (error) {
        console.error('獲取請假記錄錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取請假記錄失敗'
        });
    }
});

// 申請請假
app.post('/api/hr/leaves', async (req, res) => {
    try {
        const leave = await databaseAdapter.applyLeave(req.body);
        res.json({
            success: true,
            message: '請假申請成功',
            data: leave
        });
    } catch (error) {
        console.error('申請請假錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 審批請假
app.put('/api/hr/leaves/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const { approved, approverId, note } = req.body;
        const leave = await databaseAdapter.approveLeave(id, approverId, approved, note);
        res.json({
            success: true,
            message: approved ? '請假審批通過' : '請假審批拒絕',
            data: leave
        });
    } catch (error) {
        console.error('審批請假錯誤:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 獲取員工請假統計
app.get('/api/hr/leaves/stats/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { year } = req.query;
        const stats = await databaseAdapter.getLeaveStats(employeeId, year ? parseInt(year) : undefined);
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('獲取請假統計錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取請假統計失敗'
        });
    }
});

// 主頁路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 資料庫連接狀態檢查 API
app.get('/api/health', async (req, res) => {
    try {
        const isConnected = await databaseAdapter.checkConnection();
        res.json({
            success: true,
            database: isConnected ? 'connected' : 'disconnected',
            backend: databaseAdapter.getBackendType(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            database: 'error',
            backend: databaseAdapter.getBackendType() || 'unknown',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 優雅關閉處理
process.on('SIGTERM', async () => {
    console.log('收到 SIGTERM 信號，正在關閉服務器...');
    await databaseAdapter.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\n收到 SIGINT 信號，正在關閉服務器...');
    await databaseAdapter.disconnect();
    process.exit(0);
});

// 啟動伺服器
async function startServer() {
    try {
        // 初始化資料庫
        await initializeDatabase();
        
        // 啟動 Express 服務器
        app.listen(PORT, () => {
            console.log(`🚀 校務系統伺服器運行在 http://localhost:${PORT}`);
            console.log(`📊 資料庫後端: ${databaseAdapter.getBackendType()}`);
            if (databaseAdapter.getBackendType() === 'mongodb') {
                console.log(`🔧 MongoDB 管理介面: http://localhost:8081 (如果有啟動)`);
            }
            console.log(`🔗 健康檢查: http://localhost:${PORT}/api/health`);
            console.log('\n===== 系統已就緒 =====\n');
        });
    } catch (error) {
        console.error('❌ 服務器啟動失敗:', error.message);
        process.exit(1);
    }
}

// 啟動伺服器
startServer();
