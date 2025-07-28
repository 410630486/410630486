// MongoDB 初始化腳本
// 創建學校系統資料庫和集合

// 切換到 school_system 資料庫
db = db.getSiblingDB('school_system');

// 創建用戶集合並建立索引
db.createCollection('users');
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "userType": 1 });
db.users.createIndex({ "status": 1 });

// 創建學生資料集合
db.createCollection('students');
db.students.createIndex({ "studentId": 1 }, { unique: true });
db.students.createIndex({ "userId": 1 });

// 創建教職員資料集合
db.createCollection('staff');
db.staff.createIndex({ "staffId": 1 }, { unique: true });
db.staff.createIndex({ "userId": 1 });

// 創建課程集合
db.createCollection('courses');
db.courses.createIndex({ "courseCode": 1 }, { unique: true });
db.courses.createIndex({ "teacherId": 1 });
db.courses.createIndex({ "department": 1 });

// 創建成績集合
db.createCollection('grades');
db.grades.createIndex({ "studentId": 1, "courseId": 1 }, { unique: true });
db.grades.createIndex({ "courseId": 1 });

// 創建選課記錄集合
db.createCollection('enrollments');
db.enrollments.createIndex({ "studentId": 1, "courseId": 1 }, { unique: true });
db.enrollments.createIndex({ "courseId": 1 });

// 創建公告集合
db.createCollection('announcements');
db.announcements.createIndex({ "createdAt": -1 });
db.announcements.createIndex({ "department": 1 });

print("✅ MongoDB 資料庫初始化完成");
