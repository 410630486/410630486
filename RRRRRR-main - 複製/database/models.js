// Mongoose 資料模型定義
const mongoose = require('mongoose');

// 使用者模型
const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userType: { 
        type: String, 
        required: true, 
        enum: ['admin', 'student', 'teacher', 'staff'] 
    },
    department: { type: String, required: true },
    status: { 
        type: String, 
        default: 'active', 
        enum: ['active', 'inactive', 'suspended'] 
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: null },
    
    // 學生專用欄位
    studentId: { type: String },
    grade: { type: Number },
    semester: { type: String },
    
    // 教師專用欄位
    teacherId: { type: String },
    title: { type: String },
    
    // 權限
    permissions: [{ type: String }]
}, {
    timestamps: true,
    collection: 'users'
});

// 課程模型
const courseSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    instructor: { type: String, required: true },
    semester: { type: String, required: true },
    credits: { type: Number, required: true, min: 1, max: 6 },
    scheduleCode: { type: String, required: true },
    classroom: { type: String, required: true },
    maxStudents: { type: Number, required: true, min: 1 },
    currentStudents: { type: Number, default: 0, min: 0 },
    status: { 
        type: String, 
        default: '開放選課',
        enum: ['開放選課', '已額滿', '停開', '維護中']
    },
    department: { type: String, required: true },
    college: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: ['必修', '選修', '通識']
    },
    year: { type: Number, required: true, min: 1, max: 4 },
    description: { type: String },
    prerequisites: [{ type: String }], // 先修課程
    enrolled: { type: Number, default: 0 }, // 已選人數（用於相容性）
    capacity: { type: Number } // 容量（用於相容性）
}, {
    timestamps: true,
    collection: 'courses'
});

// 確保 enrolled 和 capacity 與 currentStudents 和 maxStudents 同步
courseSchema.pre('save', function() {
    this.enrolled = this.currentStudents;
    this.capacity = this.maxStudents;
});

// 學生選課記錄模型
const enrollmentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    semester: { type: String, required: true },
    courses: [{ type: String, ref: 'Course' }], // 參考課程 ID
    totalCredits: { type: Number, default: 0 },
    enrollmentDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        default: 'active',
        enum: ['active', 'completed', 'dropped']
    }
}, {
    timestamps: true,
    collection: 'enrollments'
});

// 確保學生每學期只有一筆選課記錄
enrollmentSchema.index({ studentId: 1, semester: 1 }, { unique: true });

// 選課歷史記錄模型
const enrollmentHistorySchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    action: { 
        type: String, 
        required: true,
        enum: ['加選', '退選']
    },
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    instructor: { type: String, required: true },
    semester: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    result: { 
        type: String, 
        required: true,
        enum: ['選課成功', '退選成功', '選課失敗', '退選失敗']
    },
    reason: { type: String } // 失敗原因
}, {
    timestamps: true,
    collection: 'enrollment_history'
});

// 創建模型
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const EnrollmentHistory = mongoose.model('EnrollmentHistory', enrollmentHistorySchema);

module.exports = {
    User,
    Course,
    Enrollment,
    EnrollmentHistory
};
