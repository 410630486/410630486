@echo off
echo 🛑 停止 MongoDB Docker 容器...

REM 移動到項目根目錄
cd /d "%~dp0.."

docker-compose -f config\docker-compose.yml stop mongodb

echo.
echo 📊 檢查容器狀態...
docker-compose -f config\docker-compose.yml ps

echo.
echo ✅ MongoDB Docker 容器已停止！

echo.
echo 按任意鍵繼續...
pause >nul
