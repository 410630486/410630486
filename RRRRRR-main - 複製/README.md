# 校務系統完整使用說明

## 📁 項目結構

```
RRRRRR-main/
├── 📄 README.md                 # 主要說明文件
├── 📄 package.json              # Node.js 依賴配置
├── 📄 server.js                 # 主服務器文件
├── 📄 index.html                # 前端主頁面
├── 📄 style.css                 # 樣式文件
├── 📄 hr-functions.js           # 人事功能腳本
├── 📄 favicon.ico               # 網站圖標
│
├── 📂 backend/                  # 後端代碼
├── 📂 database/                 # 資料庫相關
├── 📂 mongodb/                  # MongoDB 初始化
│
├── 📂 scripts/                  # 腳本文件 (整理後)
│   ├── start.bat                # 主要啟動腳本
│   ├── start.sh                 # Linux/Mac 啟動腳本
│   ├── start-docker.bat         # Docker 完整啟動
│   ├── start-local.bat          # 本地 Python 啟動
│   ├── start-mongodb-docker.bat # 只啟動 MongoDB
│   ├── start-system-with-docker.bat # 混合啟動
│   ├── check-mongodb-status.bat # MongoDB 狀態檢查
│   ├── connect-mongodb.bat      # 連接 MongoDB Shell
│   ├── stop-docker.bat          # 停止 Docker
│   ├── stop-mongodb-docker.bat  # 停止 MongoDB
│   └── fix_script.ps1           # 修復腳本
│
├── 📂 config/                   # 配置文件 (整理後)
│   ├── docker-compose.yml       # Docker Compose 配置
│   ├── nginx.conf               # Nginx 配置
│   └── Dockerfile.python        # Python Docker 配置
│
└── 📂 docs/                     # 文檔目錄
    └── PROJECT_STRUCTURE.md     # 詳細項目結構說明
```

## 🎯 系統概述

這是一個基於 Node.js + MongoDB 的現代化校務管理系統，支援多角色權限管理，提供完整的學校行政與教學功能。

### 🏗️ 系統架構
- **前端**: HTML5 + CSS3 + JavaScript + Bootstrap 5
- **後端**: Node.js + Express.js
- **資料庫**: MongoDB (Docker 容器化)
- **部署**: Docker Compose
- **代理**: Nginx (可選)

---

## 🚀 快速開始

### 1. 系統需求
- Docker Desktop (必須)
- Node.js 16+ (建議)
- 瀏覽器: Chrome 70+ / Firefox 80+ / Safari 13+

### 2. 啟動系統

#### 方法一：一鍵啟動（推薦）
```bash
# Windows (使用整理後的腳本)
.\scripts\start.bat

# 或手動執行
docker-compose -f config\docker-compose.yml up -d mongodb
node server.js
```

#### 方法二：分步啟動
```bash
# 1. 啟動 MongoDB 容器
docker-compose -f config\docker-compose.yml up -d mongodb

# 2. 等待 MongoDB 初始化 (約10秒)
timeout /t 10

# 3. 啟動 Node.js 服務器
npm install  # 首次執行需要
node server.js
```

### 3. 訪問系統
- **主網站**: http://localhost:3000
- **健康檢查**: http://localhost:3000/api/health
- **MongoDB**: localhost:27017

---

## 🔑 系統帳號

> **重要**: 以下是目前系統中實際可用的帳號，所有密碼均為 `123`

| 身份 | 帳號 | 密碼 | 功能權限 | 登入身份選擇 |
|------|------|------|---------|-------------|
| **系統管理員** | `admin` | `123` | 完整系統管理權限 | 管理員 |
| **學生** | `student` | `123` | 學生功能專區 | 學生 |
| **教師** | `teacher` | `123` | 教師功能專區 | 教師 |
| **人事** | `hr` | `123` | 人事管理功能 | 人事 |

### 🔐 登入步驟
1. 開啟瀏覽器，前往 http://localhost:3000
2. 點擊右上角「登入」按鈕
3. 輸入對應的帳號、密碼
4. 選擇正確的身份類型
5. 點擊「登入」按鈕

---

## 👥 功能權限說明

### 🎓 學生專區 (student)
**可用功能**:
- ✅ 學生基本資料查詢
- ✅ 課程表查詢與管理
- ✅ 成績查詢與統計
- ✅ 選課系統（加選、退選）
- ✅ 學雜費查詢與繳費
- ✅ 校園活動報名
- ✅ 公告通知查看
- ✅ 證明文件申請
- ✅ 圖書館服務

### 👨‍🏫 教師專區 (teacher)
**可用功能**:
- ✅ 教師基本資料管理
- ✅ 課程管理與規劃
- ✅ 學生成績登錄與管理
- ✅ 教師課程表管理
- ✅ 學生資料查詢
- ✅ 出席管理
- ✅ 教學公告發布
- ✅ 教學報表查詢
- ✅ 班級管理
- ✅ 課程規劃

### 🏢 人事專區 (hr)
**可用功能**:
- ✅ 員工資料管理
- ✅ 考勤管理系統
- ✅ 薪資管理
- ✅ 招聘管理
- ✅ 績效考核
- ✅ 培訓管理
- ✅ 請假管理
- ✅ 員工福利管理
- ✅ 人事報表

### 🛠️ 系統管理員 (admin)
**可用功能**:
- ✅ 用戶帳號管理
- ✅ 課程資料管理
- ✅ 系統參數設定
- ✅ 資料備份與還原
- ✅ 系統日誌查看
- ✅ 安全性管理
- ✅ 權限控制
- ✅ 系統監控

---

## 🗄️ 資料庫管理

### MongoDB 連接資訊
- **主機**: localhost:27017
- **資料庫**: school_system
- **管理員帳號**: admin
- **管理員密碼**: admin123
- **連接字串**: `mongodb://admin:admin123@localhost:27017/school_system?authSource=admin`

### 常用操作
```bash
# 連接到 MongoDB Shell
docker exec -it school_system_mongodb mongosh --username admin --password admin123 --authenticationDatabase admin school_system

# 查看所有使用者
db.users.find().pretty()

# 查看課程資料
db.courses.find().pretty()

# 檢查容器狀態
docker ps

# 查看系統日誌
docker logs school_system_mongodb
```

---

## 🔧 系統管理

### 啟動與停止
```bash
# 啟動系統
.\scripts\start.bat

# 停止 MongoDB 容器
docker-compose -f config\docker-compose.yml stop mongodb

# 完全停止並清理
docker-compose -f config\docker-compose.yml down

# 重新建置
docker-compose -f config\docker-compose.yml down
docker-compose -f config\docker-compose.yml up --build -d mongodb
```

### 狀態檢查
```bash
# 檢查 MongoDB 狀態
.\scripts\check-mongodb-status.bat

# 檢查容器狀態
docker-compose -f config\docker-compose.yml ps

# 健康檢查
curl http://localhost:3000/api/health
```

### 資料備份
```bash
# 備份資料庫
docker exec school_system_mongodb mongodump --username admin --password admin123 --authenticationDatabase admin --db school_system --out /backup

# 還原資料庫
docker exec school_system_mongodb mongorestore --username admin --password admin123 --authenticationDatabase admin --db school_system /backup/school_system
```

---

## 🌐 瀏覽器相容性

### ✅ 完全支援
- **Chrome 70+**: 最佳體驗
- **Firefox 80+**: 完整功能
- **Safari 13+**: Mac 推薦
- **Edge 80+**: Windows 推薦

### 🎨 技術特色
- **響應式設計**: 支援桌面、平板、手機
- **現代化介面**: Bootstrap 5 + 自定義樣式
- **動畫效果**: 頁面載入、恐龍動畫、轉場效果
- **即時通知**: Toast 通知系統
- **安全認證**: JWT + 角色權限控制

---

## 🛠️ 故障排除

### 常見問題

#### 1. MongoDB 無法啟動
```bash
# 檢查 Docker 是否運行
docker --version

# 檢查端口占用
netstat -an | findstr 27017

# 重啟 Docker Desktop
# 清理容器後重新啟動
docker-compose down
docker-compose up -d mongodb
```

#### 2. Node.js 服務器無法啟動
```bash
# 檢查 Node.js 版本
node --version

# 重新安裝依賴
npm install

# 檢查端口占用
netstat -an | findstr 3000
```

#### 3. 無法登入系統
- 確認帳號密碼正確（密碼都是 `123`）
- 確認選擇了正確的身份類型
- 檢查瀏覽器控制台是否有錯誤
- 嘗試清除瀏覽器快取

#### 4. 功能無法正常使用
- 確認已正確登入
- 檢查網路連接
- 確認 MongoDB 容器運行正常
- 查看瀏覽器開發者工具的錯誤訊息

### 重置系統
```bash
# 完全重置系統
docker-compose down -v
docker-compose up --build -d mongodb
npm install
node server.js
```

---

## 📊 系統監控

### 健康檢查端點
- **系統狀態**: http://localhost:3000/api/health
- **資料庫連接**: 系統會自動檢查 MongoDB 連接狀態
- **服務狀態**: 登入後可在管理員區域查看詳細狀態

### 日誌查看
```bash
# 查看 MongoDB 日誌
docker logs school_system_mongodb

# 查看 Node.js 服務器日誌
# (在運行 node server.js 的終端中查看)
```

---

## 🔮 未來擴展

系統採用模組化設計，易於擴展：

### 可添加功能
- 📧 郵件通知系統
- 📱 手機 APP 支援
- 🔔 即時訊息推送
- 📈 進階報表分析
- 🎯 API 介接擴充
- 🔐 SSO 單一登入
- 🌍 多語言支援

### 技術升級
- TypeScript 支援
- GraphQL API
- Redis 快取
- 微服務架構
- Kubernetes 部署

---

## 📞 技術支援

如遇到問題，請檢查以下資源：
1. 查看本說明文件的故障排除章節
2. 檢查瀏覽器開發者工具的錯誤訊息
3. 查看系統日誌文件
4. 確認所有服務都正常運行

---

**系統版本**: 1.0.0  
**最後更新**: 2025年7月23日  
**開發環境**: Node.js + MongoDB + Docker  

🎉 **恭喜！您的校務系統已準備就緒，開始體驗完整的校園管理功能吧！**
