@echo off
echo 🚀 啟動 MongoDB Docker 容器...

REM 移動到項目根目錄
cd /d "%~dp0.."

docker-compose -f config\docker-compose.yml up -d mongodb

echo.
echo ⏳ 等待 MongoDB 啟動...
timeout /t 5 /nobreak > nul

echo.
echo 📊 檢查容器狀態...
docker-compose -f config\docker-compose.yml ps

echo.
echo ✅ MongoDB Docker 容器已啟動！
echo 📍 MongoDB 連接地址: mongodb://admin:admin123@localhost:27017/school_system?authSource=admin

echo.
echo 按任意鍵繼續...
pause >nul
