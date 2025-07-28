// MongoDB 初始化腳本
// 這個腳本會在 MongoDB 容器首次啟動時執行

// 切換到 school_system 資料庫
db = db.getSiblingDB('school_system');

// 創建使用者集合並插入初始資料
db.users.insertMany([
    {
        _id: "admin",
        username: "admin",
        password: "123", // password: 123
        name: "系統管理員",
        email: "admin@school.edu.tw",
        userType: "admin",
        department: "資訊中心",
        status: "active",
        createdAt: new Date(),
        lastLogin: null,
        permissions: ["all"]
    },
    {
        _id: "student",
        username: "student",
        password: "123", // password: 123
        name: "測試學生",
        email: "student@school.edu.tw",
        userType: "student",
        studentId: "B11234567",
        department: "資訊工程學系",
        status: "active",
        createdAt: new Date(),
        lastLogin: null,
        grade: 3,
        semester: "113-1"
    },
    {
        _id: "teacher",
        username: "teacher",
        password: "123", // password: 123
        name: "教職員測試",
        email: "teacher@school.edu.tw",
        userType: "teacher",
        teacherId: "T001",
        department: "資訊工程學系",
        status: "active",
        createdAt: new Date(),
        lastLogin: null,
        title: "助理教授"
    },
    {
        _id: "hr",
        username: "hr",
        password: "123", // password: 123
        name: "人事主管",
        email: "hr@school.edu.tw",
        userType: "hr",
        department: "人事部",
        status: "active",
        createdAt: new Date(),
        lastLogin: null
    }
]);

// 創建課程集合
db.courses.insertMany([
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
        description: "介紹計算機基本概念與程式設計入門"
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
        description: "程式設計基礎與演算法思維"
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
        description: "一元函數微積分理論與應用"
    }
]);

// 創建學生選課記錄集合
db.enrollments.insertMany([
    {
        studentId: "student",
        semester: "113-1",
        courses: ["CS101", "CS102", "MATH101"],
        totalCredits: 10,
        enrollmentDate: new Date(),
        status: "active"
    }
]);

// 創建選課歷史記錄集合
db.enrollment_history.insertMany([
    {
        studentId: "student",
        action: "加選",
        courseId: "CS101",
        courseName: "計算機概論",
        instructor: "張教授",
        semester: "113-1",
        timestamp: new Date("2024-07-15T10:30:00Z"),
        result: "選課成功"
    },
    {
        studentId: "student",
        action: "加選",
        courseId: "CS102",
        courseName: "程式設計",
        instructor: "李教授",
        semester: "113-1",
        timestamp: new Date("2024-07-15T10:32:00Z"),
        result: "選課成功"
    },
    {
        studentId: "student",
        action: "加選",
        courseId: "MATH101",
        courseName: "微積分",
        instructor: "王教授",
        semester: "113-1",
        timestamp: new Date("2024-07-15T10:35:00Z"),
        result: "選課成功"
    }
]);

// 創建索引以優化查詢性能
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.courses.createIndex({ "code": 1 }, { unique: true });
db.courses.createIndex({ "semester": 1 });
db.courses.createIndex({ "department": 1 });
db.enrollments.createIndex({ "studentId": 1, "semester": 1 }, { unique: true });
db.enrollment_history.createIndex({ "studentId": 1, "timestamp": -1 });

print("✅ MongoDB 初始化完成！");
print("📊 已創建的集合：");
print("   - users (使用者資料)");
print("   - courses (課程資料)");
print("   - enrollments (學生選課記錄)");
print("   - enrollment_history (選課歷史記錄)");
print("🔑 預設帳號：");
print("   - 管理員：admin / 123");
print("   - 學生：student / 123");
print("   - 教師：teacher / 123");
print("   - 人事：hr / 123");
