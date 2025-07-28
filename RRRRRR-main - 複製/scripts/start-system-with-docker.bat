@echo off
echo 🚀 啟動完整系統 (MongoDB Docker + Node.js)...

REM 移動到項目根目錄
cd /d "%~dp0.."

echo.
echo 📦 啟動 MongoDB Docker 容器...
docker-compose -f config\docker-compose.yml up -d mongodb

echo.
echo ⏳ 等待 MongoDB 啟動...
timeout /t 8 /nobreak > nul

echo.
echo 🌐 啟動 Node.js 服務器...

REM 檢查並安裝依賴
if not exist node_modules (
    echo 📦 安裝 Node.js 依賴...
    npm install
)

start "校務系統服務器" node server.js

echo.
echo ⏳ 等待服務器啟動...
timeout /t 3 /nobreak > nul

echo.
echo ✅ 系統已啟動！
echo 🌐 請在瀏覽器中訪問: http://localhost:3000
echo 📊 檢查 MongoDB 狀態: .\scripts\check-mongodb-status.bat
echo 🛑 停止系統: .\scripts\stop-docker.bat

echo.
echo 按任意鍵繼續...
pause >nul
