// 資料庫服務層 - 處理所有資料庫操作
const mongoDatabase = require('./mongodb');
const { User, Course, Enrollment, EnrollmentHistory } = require('./models');

class DatabaseService {
    constructor() {
        this.isInitialized = false;
    }

    // 初始化資料庫連接
    async initialize() {
        try {
            await mongoDatabase.connectWithMongoose();
            this.isInitialized = true;
            console.log('✅ 資料庫服務初始化完成');
        } catch (error) {
            console.error('❌ 資料庫服務初始化失敗:', error.message);
            throw error;
        }
    }

    // 檢查初始化狀態
    ensureInitialized() {
        if (!this.isInitialized) {
            throw new Error('資料庫服務尚未初始化');
        }
    }

    // === 使用者相關操作 ===
    
    // 根據使用者名稱獲取使用者
    async getUserByUsername(username) {
        this.ensureInitialized();
        try {
            return await User.findOne({ username }).lean();
        } catch (error) {
            console.error('獲取使用者失敗:', error.message);
            throw error;
        }
    }

    // 創建新使用者
    async createUser(userData) {
        this.ensureInitialized();
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            console.error('創建使用者失敗:', error.message);
            throw error;
        }
    }

    // 更新使用者最後登入時間
    async updateLastLogin(username) {
        this.ensureInitialized();
        try {
            return await User.updateOne(
                { username },
                { lastLogin: new Date() }
            );
        } catch (error) {
            console.error('更新登入時間失敗:', error.message);
            throw error;
        }
    }

    // === 課程相關操作 ===
    
    // 獲取所有課程
    async getAllCourses() {
        this.ensureInitialized();
        try {
            return await Course.find({}).lean();
        } catch (error) {
            console.error('獲取課程列表失敗:', error.message);
            throw error;
        }
    }

    // 根據學期獲取課程
    async getCoursesBySemester(semester) {
        this.ensureInitialized();
        try {
            return await Course.find({ semester }).lean();
        } catch (error) {
            console.error('獲取學期課程失敗:', error.message);
            throw error;
        }
    }

    // 根據課程 ID 獲取課程
    async getCourseById(courseId) {
        this.ensureInitialized();
        try {
            return await Course.findById(courseId).lean();
        } catch (error) {
            console.error('獲取課程資料失敗:', error.message);
            throw error;
        }
    }

    // 更新課程選課人數
    async updateCourseEnrollment(courseId, increment = 1) {
        this.ensureInitialized();
        try {
            const course = await Course.findById(courseId);
            if (!course) {
                throw new Error('課程不存在');
            }

            course.currentStudents += increment;
            
            // 更新課程狀態
            if (course.currentStudents >= course.maxStudents) {
                course.status = '已額滿';
            } else if (course.status === '已額滿' && course.currentStudents < course.maxStudents) {
                course.status = '開放選課';
            }

            return await course.save();
        } catch (error) {
            console.error('更新課程選課人數失敗:', error.message);
            throw error;
        }
    }

    // === 選課記錄相關操作 ===
    
    // 獲取學生選課記錄
    async getStudentEnrollment(studentId, semester) {
        this.ensureInitialized();
        try {
            return await Enrollment.findOne({ studentId, semester }).lean();
        } catch (error) {
            console.error('獲取學生選課記錄失敗:', error.message);
            throw error;
        }
    }

    // 更新學生選課記錄
    async updateStudentEnrollment(studentId, semester, courses) {
        this.ensureInitialized();
        try {
            // 計算總學分
            const courseDetails = await Course.find({ _id: { $in: courses } }).lean();
            const totalCredits = courseDetails.reduce((sum, course) => sum + course.credits, 0);

            const enrollment = await Enrollment.findOneAndUpdate(
                { studentId, semester },
                { 
                    courses, 
                    totalCredits,
                    enrollmentDate: new Date()
                },
                { 
                    upsert: true, 
                    new: true 
                }
            );

            return enrollment;
        } catch (error) {
            console.error('更新學生選課記錄失敗:', error.message);
            throw error;
        }
    }

    // 學生加選課程
    async enrollCourse(studentId, semester, courseId) {
        this.ensureInitialized();
        try {
            // 獲取目前選課記錄
            let enrollment = await this.getStudentEnrollment(studentId, semester);
            const courses = enrollment ? [...enrollment.courses] : [];

            // 檢查是否已選
            if (courses.includes(courseId)) {
                throw new Error('已經選修此課程');
            }

            // 添加課程
            courses.push(courseId);
            
            // 更新選課記錄
            await this.updateStudentEnrollment(studentId, semester, courses);
            
            // 更新課程人數
            await this.updateCourseEnrollment(courseId, 1);

            return { success: true };
        } catch (error) {
            console.error('加選課程失敗:', error.message);
            throw error;
        }
    }

    // 學生退選課程
    async dropCourse(studentId, semester, courseId) {
        this.ensureInitialized();
        try {
            // 獲取目前選課記錄
            const enrollment = await this.getStudentEnrollment(studentId, semester);
            if (!enrollment) {
                throw new Error('沒有選課記錄');
            }

            const courses = enrollment.courses.filter(id => id !== courseId);
            
            // 更新選課記錄
            await this.updateStudentEnrollment(studentId, semester, courses);
            
            // 更新課程人數
            await this.updateCourseEnrollment(courseId, -1);

            return { success: true };
        } catch (error) {
            console.error('退選課程失敗:', error.message);
            throw error;
        }
    }

    // === 選課歷史記錄相關操作 ===
    
    // 添加選課歷史記錄
    async addEnrollmentHistory(historyData) {
        this.ensureInitialized();
        try {
            const history = new EnrollmentHistory(historyData);
            return await history.save();
        } catch (error) {
            console.error('添加選課歷史記錄失敗:', error.message);
            throw error;
        }
    }

    // 獲取學生選課歷史
    async getStudentEnrollmentHistory(studentId, limit = 20) {
        this.ensureInitialized();
        try {
            return await EnrollmentHistory.find({ studentId })
                .sort({ timestamp: -1 })
                .limit(limit)
                .lean();
        } catch (error) {
            console.error('獲取選課歷史失敗:', error.message);
            throw error;
        }
    }

    // === 資料庫維護操作 ===
    
    // 檢查資料庫連接
    async checkConnection() {
        try {
            return await mongoDatabase.checkConnection();
        } catch (error) {
            console.error('檢查資料庫連接失敗:', error.message);
            return false;
        }
    }

    // 關閉資料庫連接
    async disconnect() {
        try {
            await mongoDatabase.disconnect();
            this.isInitialized = false;
        } catch (error) {
            console.error('關閉資料庫連接失敗:', error.message);
        }
    }
}

// 創建單例實例
const databaseService = new DatabaseService();

module.exports = databaseService;
