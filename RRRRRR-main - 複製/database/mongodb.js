// MongoDB 資料庫連接配置
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

class MongoDatabase {
    constructor() {
        this.client = null;
        this.db = null;
        this.isConnected = false;
        
        // 從環境變數或使用預設值
        this.connectionString = process.env.MONGODB_URL || 'mongodb://admin:admin123@localhost:27017/school_system?authSource=admin';
        this.databaseName = 'school_system';
    }

    // 使用 MongoClient 連接
    async connect() {
        try {
            console.log('🔗 正在連接 MongoDB...');
            this.client = new MongoClient(this.connectionString, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            
            await this.client.connect();
            this.db = this.client.db(this.databaseName);
            this.isConnected = true;
            
            console.log('✅ MongoDB 連接成功！');
            return this.db;
        } catch (error) {
            console.error('❌ MongoDB 連接失敗:', error.message);
            throw error;
        }
    }

    // 使用 Mongoose 連接（用於 ORM 操作）
    async connectWithMongoose() {
        try {
            console.log('🔗 正在使用 Mongoose 連接 MongoDB...');
            await mongoose.connect(this.connectionString, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            
            console.log('✅ Mongoose 連接成功！');
            return mongoose.connection;
        } catch (error) {
            console.error('❌ Mongoose 連接失敗:', error.message);
            throw error;
        }
    }

    // 關閉連接
    async disconnect() {
        try {
            if (this.client) {
                await this.client.close();
                console.log('🔚 MongoDB 連接已關閉');
            }
            if (mongoose.connection.readyState !== 0) {
                await mongoose.disconnect();
                console.log('🔚 Mongoose 連接已關閉');
            }
            this.isConnected = false;
        } catch (error) {
            console.error('❌ 關閉連接時發生錯誤:', error.message);
        }
    }

    // 獲取集合
    getCollection(collectionName) {
        if (!this.isConnected || !this.db) {
            throw new Error('資料庫未連接');
        }
        return this.db.collection(collectionName);
    }

    // 檢查連接狀態
    async checkConnection() {
        try {
            if (!this.client) {
                return false;
            }
            await this.client.db(this.databaseName).admin().ping();
            return true;
        } catch (error) {
            console.error('❌ 連接檢查失敗:', error.message);
            return false;
        }
    }

    // 創建索引
    async createIndexes() {
        try {
            const usersCollection = this.getCollection('users');
            const coursesCollection = this.getCollection('courses');
            const enrollmentsCollection = this.getCollection('enrollments');
            const historyCollection = this.getCollection('enrollment_history');

            // 使用者索引
            await usersCollection.createIndex({ username: 1 }, { unique: true });
            await usersCollection.createIndex({ email: 1 }, { unique: true });

            // 課程索引
            await coursesCollection.createIndex({ code: 1 }, { unique: true });
            await coursesCollection.createIndex({ semester: 1 });
            await coursesCollection.createIndex({ department: 1 });

            // 選課記錄索引
            await enrollmentsCollection.createIndex({ studentId: 1, semester: 1 }, { unique: true });

            // 歷史記錄索引
            await historyCollection.createIndex({ studentId: 1, timestamp: -1 });

            console.log('✅ 資料庫索引創建完成');
        } catch (error) {
            console.error('❌ 創建索引失敗:', error.message);
        }
    }
}

// 創建單例實例
const mongoDatabase = new MongoDatabase();

module.exports = mongoDatabase;
