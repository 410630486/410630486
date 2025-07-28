@echo off
echo 🚀 啟動校務系統 Docker 服務...

REM 移動到項目根目錄
cd /d "%~dp0.."

REM 檢查 Docker 是否運行
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker 未安裝或未運行，請先安裝並啟動 Docker Desktop
    pause
    exit /b 1
)

echo 🔧 停止現有容器...
docker-compose -f config\docker-compose.yml down

echo 🏗️ 建置並啟動服務...
docker-compose -f config\docker-compose.yml up --build -d

echo ⏳ 等待服務啟動...
timeout /t 10

echo 📊 檢查服務狀態...
docker-compose -f config\docker-compose.yml ps

echo ✅ 校務系統已啟動！
echo 🌐 前端網址: http://localhost:3000
echo 🔧 後端 API: http://localhost:8000
echo 📱 API 文檔: http://localhost:8000/docs
echo 🗄️ MongoDB: localhost:27017

echo.
echo 💡 使用以下指令管理服務:
echo    docker-compose -f config\docker-compose.yml logs -f          查看日誌
echo    docker-compose -f config\docker-compose.yml down             停止服務
echo    docker-compose -f config\docker-compose.yml restart          重啟服務
echo.

pause
