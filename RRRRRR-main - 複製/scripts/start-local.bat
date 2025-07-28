@echo off
echo 🚀 啟動校務系統 (本地 Python 版本)...

REM 移動到項目根目錄
cd /d "%~dp0.."

REM 檢查 Python 是否安裝
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python 未安裝，請先安裝 Python 3.8+
    pause
    exit /b 1
)

echo 📦 安裝 Python 依賴...
cd backend
pip install -r requirements.txt

echo 🗄️ 啟動 MongoDB (請確保 MongoDB 已安裝並運行)
echo 💡 如果沒有 MongoDB，請下載安裝: https://www.mongodb.com/try/download/community

echo 🌟 啟動 Python 後端伺服器...
start cmd /k "python main.py"

cd ..
echo 🌐 啟動前端服務器...
echo 💡 在瀏覽器中訪問: http://localhost:3000

REM 檢查 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安裝，請先安裝 Node.js
    pause
    exit /b 1
)

REM 安裝 Node.js 依賴
if not exist node_modules (
    echo 📦 安裝 Node.js 依賴...
    npm install
)

echo 🚀 啟動 Node.js 前端服務器...
node server.js

pause
