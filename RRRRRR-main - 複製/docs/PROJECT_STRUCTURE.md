# 項目結構說明

## 📁 目錄結構

```
RRRRRR-main/
├── 📄 README.md                 # 主要說明文件
├── 📄 package.json              # Node.js 依賴配置
├── 📄 server.js                 # 主服務器文件
├── 📄 index.html                # 前端主頁面
├── 📄 style.css                 # 樣式文件
├── 📄 hr-functions.js           # 人事功能腳本
├── 📄 favicon.ico               # 網站圖標
├── 📄 todo.ini                  # 待辦事項配置
│
├── 📂 backend/                  # 後端代碼
│   ├── main.py                  # Python 後端主文件
│   └── requirements.txt         # Python 依賴
│
├── 📂 database/                 # 資料庫相關
│   ├── adapter.js               # 資料庫適配器
│   ├── file-backend.js          # 文件後端
│   ├── models.js                # 資料模型
│   ├── mongodb.js               # MongoDB 連接
│   └── service.js               # 資料庫服務
│
├── 📂 mongodb/                  # MongoDB 初始化
│   └── init/
│       ├── 01-init-data.js      # 初始資料
│       └── init-db.js           # 資料庫初始化
│
├── 📂 scripts/                  # 腳本文件 (整理後)
│   ├── start.bat                # Windows 啟動腳本
│   ├── start.sh                 # Linux/Mac 啟動腳本
│   ├── start-local.bat          # 本地啟動
│   ├── start-docker.bat         # Docker 啟動
│   ├── start-mongodb-docker.bat # MongoDB Docker 啟動
│   ├── start-system-with-docker.bat # 系統 Docker 啟動
│   ├── stop-docker.bat          # 停止 Docker
│   ├── stop-mongodb-docker.bat  # 停止 MongoDB Docker
│   ├── check-mongodb-status.bat # 檢查 MongoDB 狀態
│   ├── connect-mongodb.bat      # 連接 MongoDB
│   └── fix_script.ps1           # 修復腳本
│
├── 📂 config/                   # 配置文件 (整理後)
│   ├── docker-compose.yml       # Docker Compose 配置
│   ├── nginx.conf               # Nginx 配置
│   └── Dockerfile.python        # Python Docker 配置
│
└── 📂 docs/                     # 文檔目錄 (新建)
    └── PROJECT_STRUCTURE.md     # 本文件
```

## 🎯 整理後的優點

### ✅ 已完成的整理
1. **腳本集中管理**: 所有 `.bat` 和腳本文件移至 `scripts/` 目錄
2. **配置文件統一**: Docker 和服務配置移至 `config/` 目錄
3. **文檔結構化**: 創建 `docs/` 目錄存放文檔
4. **根目錄清潔**: 主要的業務文件保留在根目錄

### 📋 文件功能說明

#### 核心業務文件 (根目錄)
- `README.md`: 完整的系統使用指南
- `server.js`: Node.js 主服務器
- `index.html`: 前端入口頁面
- `style.css`: 前端樣式
- `package.json`: Node.js 項目配置

#### 腳本目錄 (`scripts/`)
- `start.bat`: 主要的系統啟動腳本
- `start-docker.bat`: Docker 環境啟動
- `start-mongodb-docker.bat`: MongoDB 容器啟動
- `check-mongodb-status.bat`: MongoDB 狀態檢查
- `connect-mongodb.bat`: MongoDB 連接工具

#### 配置目錄 (`config/`)
- `docker-compose.yml`: Docker 服務編排
- `nginx.conf`: Web 服務器配置
- `Dockerfile.python`: Python 容器配置

#### 資料庫目錄 (`database/`)
- 包含所有資料庫相關的 JavaScript 文件
- MongoDB 連接和資料操作邏輯

#### 後端目錄 (`backend/`)
- Python 後端服務文件
- 依賴配置文件

## 🚀 使用指南

### 啟動系統
```bash
# 方法一: 使用主啟動腳本
.\scripts\start.bat

# 方法二: 使用 Docker 啟動
.\scripts\start-docker.bat

# 方法三: 手動啟動
cd config
docker-compose up -d mongodb
cd ..
node server.js
```

### 檢查系統狀態
```bash
# 檢查 MongoDB
.\scripts\check-mongodb-status.bat

# 連接 MongoDB
.\scripts\connect-mongodb.bat
```

## 📝 維護建議

1. **腳本修改**: 所有腳本文件都在 `scripts/` 目錄，便於維護
2. **配置調整**: 配置文件統一在 `config/` 目錄
3. **文檔更新**: 新增文檔放在 `docs/` 目錄
4. **路徑更新**: 某些腳本可能需要更新相對路徑

## ⚠️ 注意事項

由於文件位置調整，部分腳本內的路徑可能需要更新：
- Docker Compose 文件路徑: `config/docker-compose.yml`
- 啟動腳本需要調整相對路徑引用

建議測試所有腳本是否正常工作，如有問題可以調整相對路徑。
