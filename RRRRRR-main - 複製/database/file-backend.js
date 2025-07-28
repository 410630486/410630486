// 檔案系統資料庫後端
const fs = require('fs').promises;
const path = require('path');

class FileBackendService {
    constructor() {
        this.dataDir = path.join(__dirname, 'data');
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.coursesFile = path.join(this.dataDir, 'courses.json');
        this.enrollmentsFile = path.join(this.dataDir, 'enrollments.json');
        this.historyFile = path.join(this.dataDir, 'enrollment_history.json');
        this.booksFile = path.join(this.dataDir, 'books.json');
        this.borrowedBooksFile = path.join(this.dataDir, 'borrowed_books.json');
        this.reservedBooksFile = path.join(this.dataDir, 'reserved_books.json');
        this.employeesFile = path.join(this.dataDir, 'employees.json');
        this.attendanceFile = path.join(this.dataDir, 'attendance.json');
        this.departmentsFile = path.join(this.dataDir, 'departments.json');
        this.leavesFile = path.join(this.dataDir, 'leaves.json');
        this.isInitialized = false;
    }

    async initialize() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
            
            // 初始化使用者資料
            await this.initializeUsers();
            await this.initializeCourses();
            await this.initializeEnrollments();
            await this.initializeHistory();
            await this.initializeBooks();
            await this.initializeBorrowedBooks();
            await this.initializeReservedBooks();
            await this.initializeEmployees();
            await this.initializeDepartments();
            await this.initializeAttendance();
            await this.initializeLeaves();
            
            this.isInitialized = true;
            console.log('✅ 檔案系統資料庫初始化完成');
        } catch (error) {
            console.error('❌ 檔案系統資料庫初始化失敗:', error.message);
            throw error;
        }
    }

    async initializeUsers() {
        const defaultUsers = [
            {
                _id: "admin",
                username: "admin",
                password: "123",
                name: "系統管理員",
                email: "admin@school.edu.tw",
                userType: "admin",
                department: "資訊中心",
                status: "active",
                createdAt: new Date().toISOString(),
                lastLogin: null,
                permissions: ["all"]
            },
            {
                _id: "student",
                username: "student",
                password: "123",
                name: "測試學生",
                email: "student@school.edu.tw",
                userType: "student",
                studentId: "B11234567",
                department: "資訊工程學系",
                status: "active",
                createdAt: new Date().toISOString(),
                lastLogin: null,
                grade: 3,
                semester: "113-1"
            },
            {
                _id: "teacher",
                username: "teacher",
                password: "123",
                name: "教職員測試",
                email: "teacher@school.edu.tw",
                userType: "teacher",
                teacherId: "T001",
                department: "資訊工程學系",
                status: "active",
                createdAt: new Date().toISOString(),
                lastLogin: null,
                title: "助理教授"
            },
            {
                _id: "hr",
                username: "hr",
                password: "123",
                name: "人事主管",
                email: "hr@school.edu.tw",
                userType: "hr",
                department: "人事部",
                status: "active",
                createdAt: new Date().toISOString(),
                lastLogin: null
            }
        ];

        await this.writeJsonFile(this.usersFile, defaultUsers);
    }

    async initializeCourses() {
        const defaultCourses = [
            {
                _id: "CS101",
                code: "CS101",
                name: "計算機概論",
                instructor: "張教授",
                semester: "113-1",
                credits: 3,
                scheduleCode: "2-3,4,5",
                classroom: "E101",
                maxStudents: 50,
                currentStudents: 15,
                status: "開放選課",
                department: "資訊工程學系",
                college: "工學院",
                type: "必修",
                year: 1,
                description: "介紹計算機基本概念與程式設計入門",
                enrolled: 15,
                capacity: 50
            },
            {
                _id: "CS102",
                code: "CS102",
                name: "程式設計",
                instructor: "李教授",
                semester: "113-1",
                credits: 3,
                scheduleCode: "1-2,3",
                classroom: "E102",
                maxStudents: 45,
                currentStudents: 20,
                status: "開放選課",
                department: "資訊工程學系",
                college: "工學院",
                type: "必修",
                year: 1,
                description: "程式設計基礎與演算法思維",
                enrolled: 20,
                capacity: 45
            },
            {
                _id: "MATH101",
                code: "MATH101",
                name: "微積分",
                instructor: "王教授",
                semester: "113-1",
                credits: 4,
                scheduleCode: "3-1,2;5-3,4",
                classroom: "S201",
                maxStudents: 60,
                currentStudents: 35,
                status: "開放選課",
                department: "數學系",
                college: "理學院",
                type: "必修",
                year: 1,
                description: "一元函數微積分理論與應用",
                enrolled: 35,
                capacity: 60
            }
        ];

        await this.writeJsonFile(this.coursesFile, defaultCourses);
    }

    async initializeEnrollments() {
        const defaultEnrollments = [
            {
                studentId: "student",
                semester: "113-1",
                courses: ["CS101", "CS102", "MATH101"],
                totalCredits: 10,
                enrollmentDate: new Date().toISOString(),
                status: "active"
            }
        ];

        await this.writeJsonFile(this.enrollmentsFile, defaultEnrollments);
    }

    async initializeHistory() {
        const defaultHistory = [
            {
                studentId: "student",
                action: "加選",
                courseId: "CS101",
                courseName: "計算機概論",
                instructor: "張教授",
                semester: "113-1",
                timestamp: new Date("2024-07-15T10:30:00Z").toISOString(),
                result: "選課成功"
            },
            {
                studentId: "student",
                action: "加選",
                courseId: "CS102",
                courseName: "程式設計",
                instructor: "李教授",
                semester: "113-1",
                timestamp: new Date("2024-07-15T10:32:00Z").toISOString(),
                result: "選課成功"
            },
            {
                studentId: "student",
                action: "加選",
                courseId: "MATH101",
                courseName: "微積分",
                instructor: "王教授",
                semester: "113-1",
                timestamp: new Date("2024-07-15T10:35:00Z").toISOString(),
                result: "選課成功"
            }
        ];

        await this.writeJsonFile(this.historyFile, defaultHistory);
    }

    async initializeBooks() {
        const defaultBooks = [
            {
                _id: "book001",
                title: "計算機科學概論",
                author: "張志勇",
                publisher: "學術出版社",
                isbn: "9789861234567",
                category: "計算機科學",
                location: "A101",
                totalCopies: 3,
                availableCopies: 2,
                status: "可借閱",
                description: "計算機科學基礎教材，適合初學者閱讀",
                publishYear: 2023
            },
            {
                _id: "book002",
                title: "資料結構與演算法",
                author: "李明華",
                publisher: "技術書局",
                isbn: "9789861234568",
                category: "計算機科學",
                location: "A102",
                totalCopies: 5,
                availableCopies: 3,
                status: "可借閱",
                description: "深入探討資料結構與演算法的經典教材",
                publishYear: 2022
            },
            {
                _id: "book003",
                title: "網頁設計實務",
                author: "陳美玲",
                publisher: "設計出版社",
                isbn: "9789861234569",
                category: "網頁設計",
                location: "B201",
                totalCopies: 2,
                availableCopies: 0,
                status: "全部外借",
                description: "現代網頁設計技術與實作案例",
                publishYear: 2024
            },
            {
                _id: "book004",
                title: "人工智慧導論",
                author: "王大明",
                publisher: "科技出版社",
                isbn: "9789861234570",
                category: "人工智慧",
                location: "A201",
                totalCopies: 4,
                availableCopies: 4,
                status: "可借閱",
                description: "AI 技術入門與應用實例",
                publishYear: 2023
            },
            {
                _id: "book005",
                title: "資料庫系統概論",
                author: "林志明",
                publisher: "學術出版社",
                isbn: "9789861234571",
                category: "資料庫",
                location: "A103",
                totalCopies: 3,
                availableCopies: 1,
                status: "可借閱",
                description: "資料庫設計與管理完整指南",
                publishYear: 2022
            }
        ];

        await this.writeJsonFile(this.booksFile, defaultBooks);
    }

    async initializeBorrowedBooks() {
        const defaultBorrowedBooks = [
            {
                _id: "borrow001",
                userId: "student",
                bookId: "book001",
                borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
                status: "borrowed",
                renewCount: 0,
                returnDate: null
            },
            {
                _id: "borrow002",
                userId: "student",
                bookId: "book002",
                borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                status: "borrowed",
                renewCount: 1,
                returnDate: null
            }
        ];

        await this.writeJsonFile(this.borrowedBooksFile, defaultBorrowedBooks);
    }

    async initializeReservedBooks() {
        const defaultReservedBooks = [
            {
                _id: "reserve001",
                userId: "student",
                bookId: "book003",
                reserveDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                estimatedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: "waiting",
                notified: false
            }
        ];

        await this.writeJsonFile(this.reservedBooksFile, defaultReservedBooks);
    }

    async initializeDepartments() {
        const defaultDepartments = [
            {
                _id: "dept001",
                name: "資訊工程學系",
                code: "CS",
                type: "學術單位",
                head: "張教授",
                location: "工學院E棟",
                phone: "02-1234-5678",
                email: "cs@school.edu.tw",
                employeeCount: 25,
                status: "active"
            },
            {
                _id: "dept002",
                name: "教務處",
                code: "AA",
                type: "行政單位",
                head: "陳主任",
                location: "行政大樓2樓",
                phone: "02-1234-5679",
                email: "aa@school.edu.tw",
                employeeCount: 15,
                status: "active"
            },
            {
                _id: "dept003",
                name: "學務處",
                code: "SA",
                type: "行政單位",
                head: "林主任",
                location: "行政大樓3樓",
                phone: "02-1234-5680",
                email: "sa@school.edu.tw",
                employeeCount: 12,
                status: "active"
            },
            {
                _id: "dept004",
                name: "總務處",
                code: "GA",
                type: "行政單位",
                head: "黃主任",
                location: "行政大樓1樓",
                phone: "02-1234-5681",
                email: "ga@school.edu.tw",
                employeeCount: 18,
                status: "active"
            },
            {
                _id: "dept005",
                name: "人事室",
                code: "HR",
                type: "行政單位",
                head: "劉主任",
                location: "行政大樓4樓",
                phone: "02-1234-5682",
                email: "hr@school.edu.tw",
                employeeCount: 8,
                status: "active"
            }
        ];

        await this.writeJsonFile(this.departmentsFile, defaultDepartments);
    }

    async initializeEmployees() {
        const defaultEmployees = [
            {
                _id: "emp001",
                employeeId: "E001",
                username: "teacher",
                name: "張志明",
                email: "zhang@school.edu.tw",
                phone: "0912-345-678",
                position: "教授",
                department: "資訊工程學系",
                departmentId: "dept001",
                hireDate: "2020-08-01",
                salary: 85000,
                status: "active",
                contractType: "正職",
                workType: "全職",
                supervisor: null,
                emergencyContact: {
                    name: "張夫人",
                    relationship: "配偶",
                    phone: "0912-345-679"
                },
                address: "台北市大安區復興南路一段123號",
                idNumber: "A123456789",
                bankAccount: "0123456789",
                healthInsurance: true,
                laborInsurance: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: "emp002",
                employeeId: "E002",
                username: "assistant",
                name: "李美玲",
                email: "li@school.edu.tw",
                phone: "0912-345-679",
                position: "助教",
                department: "資訊工程學系",
                departmentId: "dept001",
                hireDate: "2021-02-15",
                salary: 45000,
                status: "active",
                contractType: "正職",
                workType: "全職",
                supervisor: "emp001",
                emergencyContact: {
                    name: "李爸爸",
                    relationship: "父親",
                    phone: "0912-345-680"
                },
                address: "台北市中正區中山南路456號",
                idNumber: "B123456789",
                bankAccount: "0123456790",
                healthInsurance: true,
                laborInsurance: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: "emp003",
                employeeId: "E003",
                username: "secretary",
                name: "王小華",
                email: "wang@school.edu.tw",
                phone: "0912-345-681",
                position: "秘書",
                department: "教務處",
                departmentId: "dept002",
                hireDate: "2019-09-01",
                salary: 38000,
                status: "leave", // 留職停薪
                contractType: "正職",
                workType: "全職",
                supervisor: null,
                emergencyContact: {
                    name: "王媽媽",
                    relationship: "母親",
                    phone: "0912-345-682"
                },
                address: "新北市板橋區中山路789號",
                idNumber: "C123456789",
                bankAccount: "0123456791",
                healthInsurance: true,
                laborInsurance: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: "emp004",
                employeeId: "E004",
                username: "clerk",
                name: "陳大偉",
                email: "chen@school.edu.tw",
                phone: "0912-345-683",
                position: "行政專員",
                department: "學務處",
                departmentId: "dept003",
                hireDate: "2022-03-10",
                salary: 42000,
                status: "active",
                contractType: "約聘",
                workType: "全職",
                supervisor: null,
                emergencyContact: {
                    name: "陳太太",
                    relationship: "配偶",
                    phone: "0912-345-684"
                },
                address: "台北市信義區信義路101號",
                idNumber: "D123456789",
                bankAccount: "0123456792",
                healthInsurance: true,
                laborInsurance: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: "emp005",
                employeeId: "E005",
                username: "manager",
                name: "林主管",
                email: "lin@school.edu.tw",
                phone: "0912-345-685",
                position: "主任",
                department: "人事室",
                departmentId: "dept005",
                hireDate: "2018-06-15",
                salary: 65000,
                status: "active",
                contractType: "正職",
                workType: "全職",
                supervisor: null,
                emergencyContact: {
                    name: "林先生",
                    relationship: "配偶",
                    phone: "0912-345-686"
                },
                address: "台北市松山區南京東路202號",
                idNumber: "E123456789",
                bankAccount: "0123456793",
                healthInsurance: true,
                laborInsurance: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        await this.writeJsonFile(this.employeesFile, defaultEmployees);
    }

    async initializeAttendance() {
        const today = new Date();
        const defaultAttendance = [];

        // 為過去7天生成考勤記錄
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // 為每個員工生成記錄
            const employeeIds = ['emp001', 'emp002', 'emp003', 'emp004', 'emp005'];
            
            employeeIds.forEach((empId, index) => {
                // emp003 (王小華) 留職停薪，不產生考勤記錄
                if (empId === 'emp003' && i < 5) return;
                
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                if (isWeekend) return; // 週末不上班
                
                // 隨機生成遲到、請假等情況
                const random = Math.random();
                let status, checkIn, checkOut, workHours;
                
                if (random < 0.05 && empId !== 'emp001') { // 5% 機率缺勤 (教授不會缺勤)
                    status = 'absent';
                    checkIn = null;
                    checkOut = null;
                    workHours = 0;
                } else if (random < 0.15) { // 10% 機率請假
                    status = 'leave';
                    checkIn = null;
                    checkOut = null;
                    workHours = 0;
                } else if (random < 0.25) { // 10% 機率遲到
                    status = 'late';
                    const lateMinutes = Math.floor(Math.random() * 30) + 5; // 5-35分鐘遲到
                    checkIn = `08:${String(lateMinutes).padStart(2, '0')}:00`;
                    checkOut = '17:30:00';
                    workHours = 9.5 - (lateMinutes / 60);
                } else { // 正常出勤
                    status = 'normal';
                    const checkInTime = Math.floor(Math.random() * 10); // 7:50-8:00 之間
                    checkIn = `07:${50 + checkInTime}:00`;
                    checkOut = '17:30:00';
                    workHours = 9.5;
                }

                defaultAttendance.push({
                    _id: `att_${dateStr}_${empId}`,
                    employeeId: empId,
                    date: dateStr,
                    checkIn,
                    checkOut,
                    workHours,
                    status,
                    note: status === 'late' ? '遲到' : status === 'leave' ? '請假' : status === 'absent' ? '缺勤' : '',
                    overtimeHours: workHours > 9 ? workHours - 9 : 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            });
        }

        await this.writeJsonFile(this.attendanceFile, defaultAttendance);
    }

    async initializeLeaves() {
        const defaultLeaves = [
            {
                _id: "leave001",
                employeeId: "emp002",
                employeeName: "李美玲",
                leaveType: "事假",
                startDate: "2024-07-25",
                endDate: "2024-07-25",
                totalDays: 1,
                reason: "處理私人事務",
                status: "approved",
                appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                approvedBy: "emp005",
                approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                note: "已核准"
            },
            {
                _id: "leave002",
                employeeId: "emp004",
                employeeName: "陳大偉",
                leaveType: "病假",
                startDate: "2024-07-22",
                endDate: "2024-07-23",
                totalDays: 2,
                reason: "感冒就醫",
                status: "approved",
                appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                approvedBy: "emp005",
                approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                note: "請附醫生證明"
            },
            {
                _id: "leave003",
                employeeId: "emp001",
                employeeName: "張志明",
                leaveType: "年假",
                startDate: "2024-08-01",
                endDate: "2024-08-03",
                totalDays: 3,
                reason: "家庭旅遊",
                status: "pending",
                appliedAt: new Date().toISOString(),
                approvedBy: null,
                approvedAt: null,
                note: "待核准"
            }
        ];

        await this.writeJsonFile(this.leavesFile, defaultLeaves);
    }

    async readJsonFile(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    async writeJsonFile(filePath, data) {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    // === 使用者相關操作 ===
    async getUserByUsername(username) {
        const users = await this.readJsonFile(this.usersFile);
        return users.find(user => user.username === username);
    }

    async updateLastLogin(username) {
        const users = await this.readJsonFile(this.usersFile);
        const userIndex = users.findIndex(user => user.username === username);
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            await this.writeJsonFile(this.usersFile, users);
        }
    }

    // === 課程相關操作 ===
    async getAllCourses() {
        return await this.readJsonFile(this.coursesFile);
    }

    async getCoursesBySemester(semester) {
        const courses = await this.readJsonFile(this.coursesFile);
        return courses.filter(course => course.semester === semester);
    }

    async getCourseById(courseId) {
        const courses = await this.readJsonFile(this.coursesFile);
        return courses.find(course => course._id === courseId);
    }

    async updateCourseEnrollment(courseId, increment = 1) {
        const courses = await this.readJsonFile(this.coursesFile);
        const courseIndex = courses.findIndex(course => course._id === courseId);
        if (courseIndex !== -1) {
            courses[courseIndex].currentStudents += increment;
            courses[courseIndex].enrolled = courses[courseIndex].currentStudents;
            
            // 更新狀態
            if (courses[courseIndex].currentStudents >= courses[courseIndex].maxStudents) {
                courses[courseIndex].status = '已額滿';
            } else if (courses[courseIndex].status === '已額滿' && courses[courseIndex].currentStudents < courses[courseIndex].maxStudents) {
                courses[courseIndex].status = '開放選課';
            }
            
            await this.writeJsonFile(this.coursesFile, courses);
            return courses[courseIndex];
        }
        throw new Error('課程不存在');
    }

    // === 選課記錄相關操作 ===
    async getStudentEnrollment(studentId, semester) {
        const enrollments = await this.readJsonFile(this.enrollmentsFile);
        return enrollments.find(enrollment => 
            enrollment.studentId === studentId && enrollment.semester === semester
        );
    }

    async updateStudentEnrollment(studentId, semester, courses) {
        const enrollments = await this.readJsonFile(this.enrollmentsFile);
        const enrollmentIndex = enrollments.findIndex(enrollment => 
            enrollment.studentId === studentId && enrollment.semester === semester
        );

        // 計算總學分
        const allCourses = await this.getAllCourses();
        const totalCredits = courses.reduce((sum, courseId) => {
            const course = allCourses.find(c => c._id === courseId);
            return sum + (course ? course.credits : 0);
        }, 0);

        const enrollmentData = {
            studentId,
            semester,
            courses,
            totalCredits,
            enrollmentDate: new Date().toISOString(),
            status: "active"
        };

        if (enrollmentIndex !== -1) {
            enrollments[enrollmentIndex] = enrollmentData;
        } else {
            enrollments.push(enrollmentData);
        }

        await this.writeJsonFile(this.enrollmentsFile, enrollments);
        return enrollmentData;
    }

    async enrollCourse(studentId, semester, courseId) {
        const enrollment = await this.getStudentEnrollment(studentId, semester);
        const courses = enrollment ? [...enrollment.courses] : [];

        if (courses.includes(courseId)) {
            throw new Error('已經選修此課程');
        }

        courses.push(courseId);
        await this.updateStudentEnrollment(studentId, semester, courses);
        await this.updateCourseEnrollment(courseId, 1);

        return { success: true };
    }

    async dropCourse(studentId, semester, courseId) {
        const enrollment = await this.getStudentEnrollment(studentId, semester);
        if (!enrollment) {
            throw new Error('沒有選課記錄');
        }

        const courses = enrollment.courses.filter(id => id !== courseId);
        await this.updateStudentEnrollment(studentId, semester, courses);
        await this.updateCourseEnrollment(courseId, -1);

        return { success: true };
    }

    // === 選課歷史記錄相關操作 ===
    async addEnrollmentHistory(historyData) {
        const history = await this.readJsonFile(this.historyFile);
        const record = {
            ...historyData,
            timestamp: new Date().toISOString()
        };
        history.unshift(record);
        
        // 保持最多 100 筆記錄
        if (history.length > 100) {
            history.splice(100);
        }
        
        await this.writeJsonFile(this.historyFile, history);
        return record;
    }

    async getStudentEnrollmentHistory(studentId, limit = 20) {
        const history = await this.readJsonFile(this.historyFile);
        return history
            .filter(record => record.studentId === studentId)
            .slice(0, limit);
    }

    // === 資料庫維護操作 ===
    async checkConnection() {
        try {
            await fs.access(this.dataDir);
            return true;
        } catch (error) {
            return false;
        }
    }

    async disconnect() {
        // 檔案系統後端不需要特殊的斷開連接操作
        console.log('📁 檔案系統後端已斷開連接');
    }

    // === 圖書館相關操作 ===
    
    // 獲取所有書籍
    async getAllBooks() {
        return await this.readJsonFile(this.booksFile);
    }

    // 根據 ID 獲取書籍
    async getBookById(bookId) {
        const books = await this.readJsonFile(this.booksFile);
        return books.find(book => book._id === bookId);
    }

    // 搜尋書籍
    async searchBooks(query) {
        const books = await this.readJsonFile(this.booksFile);
        if (!query) return books;
        
        const searchTerm = query.toLowerCase();
        return books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm) ||
            book.isbn.includes(searchTerm)
        );
    }

    // 借書
    async borrowBook(userId, bookId) {
        const books = await this.readJsonFile(this.booksFile);
        const borrowedBooks = await this.readJsonFile(this.borrowedBooksFile);
        
        // 檢查書籍是否存在且可借閱
        const bookIndex = books.findIndex(book => book._id === bookId);
        if (bookIndex === -1) {
            throw new Error('書籍不存在');
        }
        
        if (books[bookIndex].availableCopies <= 0) {
            throw new Error('此書已全部外借');
        }

        // 檢查使用者是否已借閱此書
        const existingBorrow = borrowedBooks.find(borrow => 
            borrow.userId === userId && borrow.bookId === bookId && borrow.status === 'borrowed'
        );
        if (existingBorrow) {
            throw new Error('您已經借閱此書籍');
        }

        // 檢查借書數量限制（最多10本）
        const userBorrowCount = borrowedBooks.filter(borrow => 
            borrow.userId === userId && borrow.status === 'borrowed'
        ).length;
        if (userBorrowCount >= 10) {
            throw new Error('已達借書數量上限（10本）');
        }

        // 更新書籍可借數量
        books[bookIndex].availableCopies--;
        if (books[bookIndex].availableCopies === 0) {
            books[bookIndex].status = '全部外借';
        }
        
        // 添加借書記錄
        const newBorrow = {
            _id: "borrow" + Date.now(),
            userId,
            bookId,
            borrowDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14天後到期
            status: 'borrowed',
            renewCount: 0,
            returnDate: null
        };
        
        borrowedBooks.push(newBorrow);
        
        // 保存更新
        await this.writeJsonFile(this.booksFile, books);
        await this.writeJsonFile(this.borrowedBooksFile, borrowedBooks);
        
        return newBorrow;
    }

    // 還書
    async returnBook(userId, bookId) {
        const books = await this.readJsonFile(this.booksFile);
        const borrowedBooks = await this.readJsonFile(this.borrowedBooksFile);
        
        // 找到借閱記錄
        const borrowIndex = borrowedBooks.findIndex(borrow => 
            borrow.userId === userId && borrow.bookId === bookId && borrow.status === 'borrowed'
        );
        
        if (borrowIndex === -1) {
            throw new Error('未找到借閱記錄');
        }
        
        // 更新借閱記錄
        borrowedBooks[borrowIndex].status = 'returned';
        borrowedBooks[borrowIndex].returnDate = new Date().toISOString();
        
        // 更新書籍可借數量
        const bookIndex = books.findIndex(book => book._id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].availableCopies++;
            if (books[bookIndex].availableCopies > 0) {
                books[bookIndex].status = '可借閱';
            }
        }
        
        // 保存更新
        await this.writeJsonFile(this.booksFile, books);
        await this.writeJsonFile(this.borrowedBooksFile, borrowedBooks);
        
        return { success: true };
    }

    // 續借
    async renewBook(userId, bookId) {
        const borrowedBooks = await this.readJsonFile(this.borrowedBooksFile);
        
        const borrowIndex = borrowedBooks.findIndex(borrow => 
            borrow.userId === userId && borrow.bookId === bookId && borrow.status === 'borrowed'
        );
        
        if (borrowIndex === -1) {
            throw new Error('未找到借閱記錄');
        }
        
        // 檢查續借次數限制（最多2次）
        if (borrowedBooks[borrowIndex].renewCount >= 2) {
            throw new Error('已達續借次數上限');
        }
        
        // 更新到期日和續借次數
        borrowedBooks[borrowIndex].dueDate = new Date(
            new Date(borrowedBooks[borrowIndex].dueDate).getTime() + 14 * 24 * 60 * 60 * 1000
        ).toISOString();
        borrowedBooks[borrowIndex].renewCount++;
        
        await this.writeJsonFile(this.borrowedBooksFile, borrowedBooks);
        
        return borrowedBooks[borrowIndex];
    }

    // 預約書籍
    async reserveBook(userId, bookId) {
        const books = await this.readJsonFile(this.booksFile);
        const reservedBooks = await this.readJsonFile(this.reservedBooksFile);
        
        // 檢查書籍是否存在
        const book = books.find(b => b._id === bookId);
        if (!book) {
            throw new Error('書籍不存在');
        }
        
        // 如果有庫存，不需要預約
        if (book.availableCopies > 0) {
            throw new Error('此書籍目前可直接借閱，無需預約');
        }
        
        // 檢查是否已預約
        const existingReserve = reservedBooks.find(reserve => 
            reserve.userId === userId && reserve.bookId === bookId && reserve.status === 'waiting'
        );
        if (existingReserve) {
            throw new Error('您已經預約此書籍');
        }
        
        // 添加預約記錄
        const newReserve = {
            _id: "reserve" + Date.now(),
            userId,
            bookId,
            reserveDate: new Date().toISOString(),
            estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 預估7天後可取書
            status: 'waiting',
            notified: false
        };
        
        reservedBooks.push(newReserve);
        await this.writeJsonFile(this.reservedBooksFile, reservedBooks);
        
        return newReserve;
    }

    // 取消預約
    async cancelReservation(userId, bookId) {
        const reservedBooks = await this.readJsonFile(this.reservedBooksFile);
        
        const reserveIndex = reservedBooks.findIndex(reserve => 
            reserve.userId === userId && reserve.bookId === bookId && reserve.status === 'waiting'
        );
        
        if (reserveIndex === -1) {
            throw new Error('未找到預約記錄');
        }
        
        reservedBooks[reserveIndex].status = 'cancelled';
        await this.writeJsonFile(this.reservedBooksFile, reservedBooks);
        
        return { success: true };
    }

    // 獲取使用者借書記錄
    async getUserBorrowedBooks(userId) {
        const borrowedBooks = await this.readJsonFile(this.borrowedBooksFile);
        const books = await this.readJsonFile(this.booksFile);
        
        const userBorrows = borrowedBooks.filter(borrow => 
            borrow.userId === userId && borrow.status === 'borrowed'
        );
        
        // 加入書籍詳細資訊
        return userBorrows.map(borrow => ({
            ...borrow,
            book: books.find(book => book._id === borrow.bookId)
        }));
    }

    // 獲取使用者預約記錄
    async getUserReservedBooks(userId) {
        const reservedBooks = await this.readJsonFile(this.reservedBooksFile);
        const books = await this.readJsonFile(this.booksFile);
        
        const userReserves = reservedBooks.filter(reserve => 
            reserve.userId === userId && reserve.status === 'waiting'
        );
        
        // 加入書籍詳細資訊
        return userReserves.map(reserve => ({
            ...reserve,
            book: books.find(book => book._id === reserve.bookId)
        }));
    }

    // 獲取使用者借閱歷史
    async getUserBorrowHistory(userId) {
        const borrowedBooks = await this.readJsonFile(this.borrowedBooksFile);
        const books = await this.readJsonFile(this.booksFile);
        
        const userHistory = borrowedBooks.filter(borrow => borrow.userId === userId);
        
        // 加入書籍詳細資訊
        return userHistory.map(borrow => ({
            ...borrow,
            book: books.find(book => book._id === borrow.bookId)
        }));
    }

    // === 人事管理相關操作 ===
    
    // 獲取所有部門
    async getAllDepartments() {
        return await this.readJsonFile(this.departmentsFile);
    }

    // 獲取部門詳情
    async getDepartmentById(deptId) {
        const departments = await this.readJsonFile(this.departmentsFile);
        return departments.find(dept => dept._id === deptId);
    }

    // 獲取所有員工
    async getAllEmployees() {
        return await this.readJsonFile(this.employeesFile);
    }

    // 根據部門獲取員工
    async getEmployeesByDepartment(departmentId) {
        const employees = await this.readJsonFile(this.employeesFile);
        return employees.filter(emp => emp.departmentId === departmentId);
    }

    // 根據員工ID獲取員工
    async getEmployeeById(empId) {
        const employees = await this.readJsonFile(this.employeesFile);
        return employees.find(emp => emp._id === empId);
    }

    // 搜尋員工
    async searchEmployees(query, department = null) {
        const employees = await this.readJsonFile(this.employeesFile);
        let filtered = employees;

        if (department && department !== 'all') {
            filtered = filtered.filter(emp => emp.departmentId === department || emp.department === department);
        }

        if (query) {
            const searchTerm = query.toLowerCase();
            filtered = filtered.filter(emp => 
                emp.name.toLowerCase().includes(searchTerm) ||
                emp.employeeId.toLowerCase().includes(searchTerm) ||
                emp.email.toLowerCase().includes(searchTerm) ||
                emp.position.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }

    // 新增員工
    async addEmployee(employeeData) {
        const employees = await this.readJsonFile(this.employeesFile);
        
        // 檢查員工編號是否重複
        const existingEmp = employees.find(emp => emp.employeeId === employeeData.employeeId);
        if (existingEmp) {
            throw new Error('員工編號已存在');
        }

        const newEmployee = {
            _id: `emp${Date.now()}`,
            ...employeeData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        employees.push(newEmployee);
        await this.writeJsonFile(this.employeesFile, employees);
        
        return newEmployee;
    }

    // 更新員工資料
    async updateEmployee(empId, updateData) {
        const employees = await this.readJsonFile(this.employeesFile);
        const empIndex = employees.findIndex(emp => emp._id === empId);
        
        if (empIndex === -1) {
            throw new Error('員工不存在');
        }

        employees[empIndex] = {
            ...employees[empIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        await this.writeJsonFile(this.employeesFile, employees);
        return employees[empIndex];
    }

    // 刪除員工
    async deleteEmployee(empId) {
        const employees = await this.readJsonFile(this.employeesFile);
        const empIndex = employees.findIndex(emp => emp._id === empId);
        
        if (empIndex === -1) {
            throw new Error('員工不存在');
        }

        // 軟刪除：將狀態設為 inactive
        employees[empIndex].status = 'inactive';
        employees[empIndex].updatedAt = new Date().toISOString();

        await this.writeJsonFile(this.employeesFile, employees);
        return { success: true };
    }

    // === 考勤管理相關操作 ===

    // 獲取考勤記錄
    async getAttendanceRecords(date = null, departmentId = null, employeeId = null) {
        let attendance = await this.readJsonFile(this.attendanceFile);
        const employees = await this.readJsonFile(this.employeesFile);

        // 日期篩選
        if (date) {
            attendance = attendance.filter(record => record.date === date);
        }

        // 部門篩選
        if (departmentId && departmentId !== 'all') {
            const deptEmployees = employees.filter(emp => emp.departmentId === departmentId);
            const deptEmpIds = deptEmployees.map(emp => emp._id);
            attendance = attendance.filter(record => deptEmpIds.includes(record.employeeId));
        }

        // 員工篩選
        if (employeeId) {
            attendance = attendance.filter(record => record.employeeId === employeeId);
        }

        // 加入員工詳細資訊
        return attendance.map(record => ({
            ...record,
            employee: employees.find(emp => emp._id === record.employeeId)
        }));
    }

    // 獲取考勤統計
    async getAttendanceStats(date = null, departmentId = null) {
        const records = await this.getAttendanceRecords(date, departmentId);
        
        const stats = {
            total: records.length,
            normal: records.filter(r => r.status === 'normal').length,
            late: records.filter(r => r.status === 'late').length,
            absent: records.filter(r => r.status === 'absent').length,
            leave: records.filter(r => r.status === 'leave').length,
            attendanceRate: 0,
            avgWorkHours: 0
        };

        if (stats.total > 0) {
            stats.attendanceRate = ((stats.normal + stats.late) / stats.total * 100).toFixed(1);
            const totalWorkHours = records.reduce((sum, r) => sum + (r.workHours || 0), 0);
            stats.avgWorkHours = (totalWorkHours / records.filter(r => r.workHours > 0).length || 0).toFixed(1);
        }

        return stats;
    }

    // 新增考勤記錄
    async addAttendanceRecord(recordData) {
        const attendance = await this.readJsonFile(this.attendanceFile);
        
        // 檢查是否已存在該日期的記錄
        const existingRecord = attendance.find(record => 
            record.employeeId === recordData.employeeId && record.date === recordData.date
        );
        
        if (existingRecord) {
            throw new Error('該日期已有考勤記錄');
        }

        const newRecord = {
            _id: `att_${recordData.date}_${recordData.employeeId}_${Date.now()}`,
            ...recordData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        attendance.push(newRecord);
        await this.writeJsonFile(this.attendanceFile, attendance);
        
        return newRecord;
    }

    // 更新考勤記錄
    async updateAttendanceRecord(recordId, updateData) {
        const attendance = await this.readJsonFile(this.attendanceFile);
        const recordIndex = attendance.findIndex(record => record._id === recordId);
        
        if (recordIndex === -1) {
            throw new Error('考勤記錄不存在');
        }

        attendance[recordIndex] = {
            ...attendance[recordIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        await this.writeJsonFile(this.attendanceFile, attendance);
        return attendance[recordIndex];
    }

    // 打卡
    async clockIn(employeeId, time = null) {
        const today = new Date().toISOString().split('T')[0];
        const currentTime = time || new Date().toTimeString().split(' ')[0];
        
        const attendance = await this.readJsonFile(this.attendanceFile);
        const existingRecord = attendance.find(record => 
            record.employeeId === employeeId && record.date === today
        );

        if (existingRecord) {
            if (existingRecord.checkIn) {
                throw new Error('今日已打過上班卡');
            }
            // 更新現有記錄
            existingRecord.checkIn = currentTime;
            existingRecord.status = currentTime > '08:00:00' ? 'late' : 'normal';
            existingRecord.updatedAt = new Date().toISOString();
        } else {
            // 創建新記錄
            attendance.push({
                _id: `att_${today}_${employeeId}`,
                employeeId,
                date: today,
                checkIn: currentTime,
                checkOut: null,
                workHours: 0,
                status: currentTime > '08:00:00' ? 'late' : 'normal',
                note: currentTime > '08:00:00' ? '遲到' : '',
                overtimeHours: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        await this.writeJsonFile(this.attendanceFile, attendance);
        return { success: true, time: currentTime };
    }

    // 下班打卡
    async clockOut(employeeId, time = null) {
        const today = new Date().toISOString().split('T')[0];
        const currentTime = time || new Date().toTimeString().split(' ')[0];
        
        const attendance = await this.readJsonFile(this.attendanceFile);
        const recordIndex = attendance.findIndex(record => 
            record.employeeId === employeeId && record.date === today
        );

        if (recordIndex === -1 || !attendance[recordIndex].checkIn) {
            throw new Error('請先打上班卡');
        }

        const record = attendance[recordIndex];
        const checkInTime = new Date(`1970-01-01T${record.checkIn}`);
        const checkOutTime = new Date(`1970-01-01T${currentTime}`);
        const workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

        record.checkOut = currentTime;
        record.workHours = Math.max(0, workHours - 1); // 扣除1小時午休
        record.overtimeHours = Math.max(0, record.workHours - 8);
        record.updatedAt = new Date().toISOString();

        await this.writeJsonFile(this.attendanceFile, attendance);
        return { success: true, time: currentTime, workHours: record.workHours };
    }

    // === 請假管理相關操作 ===

    // 獲取請假記錄
    async getLeaveRecords(employeeId = null, status = null) {
        let leaves = await this.readJsonFile(this.leavesFile);

        if (employeeId) {
            leaves = leaves.filter(leave => leave.employeeId === employeeId);
        }

        if (status) {
            leaves = leaves.filter(leave => leave.status === status);
        }

        return leaves.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    }

    // 申請請假
    async applyLeave(leaveData) {
        const leaves = await this.readJsonFile(this.leavesFile);
        const employees = await this.readJsonFile(this.employeesFile);
        
        const employee = employees.find(emp => emp._id === leaveData.employeeId);
        if (!employee) {
            throw new Error('員工不存在');
        }

        const newLeave = {
            _id: `leave${Date.now()}`,
            ...leaveData,
            employeeName: employee.name,
            status: 'pending',
            appliedAt: new Date().toISOString(),
            approvedBy: null,
            approvedAt: null
        };

        leaves.push(newLeave);
        await this.writeJsonFile(this.leavesFile, leaves);
        
        return newLeave;
    }

    // 審批請假
    async approveLeave(leaveId, approverId, approved = true, note = '') {
        const leaves = await this.readJsonFile(this.leavesFile);
        const leaveIndex = leaves.findIndex(leave => leave._id === leaveId);
        
        if (leaveIndex === -1) {
            throw new Error('請假記錄不存在');
        }

        leaves[leaveIndex].status = approved ? 'approved' : 'rejected';
        leaves[leaveIndex].approvedBy = approverId;
        leaves[leaveIndex].approvedAt = new Date().toISOString();
        leaves[leaveIndex].note = note;

        await this.writeJsonFile(this.leavesFile, leaves);
        return leaves[leaveIndex];
    }

    // 獲取員工請假統計
    async getLeaveStats(employeeId, year = new Date().getFullYear()) {
        const leaves = await this.readJsonFile(this.leavesFile);
        const employeeLeaves = leaves.filter(leave => 
            leave.employeeId === employeeId && 
            leave.status === 'approved' &&
            new Date(leave.startDate).getFullYear() === year
        );

        const stats = {
            totalDays: 0,
            sickLeave: 0,
            personalLeave: 0,
            annualLeave: 0,
            other: 0
        };

        employeeLeaves.forEach(leave => {
            stats.totalDays += leave.totalDays;
            switch (leave.leaveType) {
                case '病假':
                    stats.sickLeave += leave.totalDays;
                    break;
                case '事假':
                    stats.personalLeave += leave.totalDays;
                    break;
                case '年假':
                    stats.annualLeave += leave.totalDays;
                    break;
                default:
                    stats.other += leave.totalDays;
            }
        });

        return stats;
    }
}

const fileBackendService = new FileBackendService();
module.exports = fileBackendService;
