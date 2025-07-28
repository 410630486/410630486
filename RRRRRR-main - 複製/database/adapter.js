// 適配器模式 - 支援多種資料庫後端
const fs = require('fs').promises;
const path = require('path');

class DatabaseAdapter {
    constructor() {
        this.backend = null;
        this.isConnected = false;
    }

    async initialize() {
        try {
            // 嘗試連接 MongoDB
            const mongoService = require('./service');
            await mongoService.initialize();
            this.backend = mongoService;
            this.backendType = 'mongodb';
            console.log('✅ 使用 MongoDB 後端');
        } catch (mongoError) {
            console.log('⚠️  MongoDB 連接失敗，切換到檔案系統後端');
            console.log('   MongoDB 錯誤:', mongoError.message);
            
            // 切換到檔案系統後端
            const fileService = require('./file-backend');
            await fileService.initialize();
            this.backend = fileService;
            this.backendType = 'filesystem';
            console.log('✅ 使用檔案系統後端');
        }
        
        this.isConnected = true;
    }

    // 代理所有方法到實際的後端
    async getUserByUsername(username) {
        return await this.backend.getUserByUsername(username);
    }

    async updateLastLogin(username) {
        return await this.backend.updateLastLogin(username);
    }

    async getAllCourses() {
        return await this.backend.getAllCourses();
    }

    async getCoursesBySemester(semester) {
        return await this.backend.getCoursesBySemester(semester);
    }

    async getCourseById(courseId) {
        return await this.backend.getCourseById(courseId);
    }

    async getStudentEnrollment(studentId, semester) {
        return await this.backend.getStudentEnrollment(studentId, semester);
    }

    async updateStudentEnrollment(studentId, semester, courses) {
        return await this.backend.updateStudentEnrollment(studentId, semester, courses);
    }

    async enrollCourse(studentId, semester, courseId) {
        return await this.backend.enrollCourse(studentId, semester, courseId);
    }

    async dropCourse(studentId, semester, courseId) {
        return await this.backend.dropCourse(studentId, semester, courseId);
    }

    async addEnrollmentHistory(historyData) {
        return await this.backend.addEnrollmentHistory(historyData);
    }

    async getStudentEnrollmentHistory(studentId, limit = 20) {
        return await this.backend.getStudentEnrollmentHistory(studentId, limit);
    }

    async updateCourseEnrollment(courseId, increment = 1) {
        return await this.backend.updateCourseEnrollment(courseId, increment);
    }

    async checkConnection() {
        return await this.backend.checkConnection();
    }

    async disconnect() {
        if (this.backend && this.backend.disconnect) {
            await this.backend.disconnect();
        }
        this.isConnected = false;
    }

    getBackendType() {
        return this.backendType;
    }
}

const databaseAdapter = new DatabaseAdapter();
module.exports = databaseAdapter;
