@echo off
echo ================================================
echo          校務系統 MongoDB 版本啟動
echo ================================================
echo.

REM 檢查是否安裝了 Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker 未安裝或未啟動
    echo 請先安裝並啟動 Docker Desktop
    pause
    exit /b 1
)

echo ✅ Docker 已安裝

REM 檢查是否安裝了 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安裝
    echo 請先安裝 Node.js
    pause
    exit /b 1
)

echo ✅ Node.js 已安裝

REM 移動到項目根目錄（腳本在 scripts 子目錄中）
cd /d "%~dp0.."

REM 檢查並安裝 npm 依賴
if not exist node_modules (
    echo 🔄 正在安裝依賴...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ npm install 失敗
        pause
        exit /b 1
    )
)

echo ✅ 依賴已安裝

REM 啟動 MongoDB 容器
echo 🔄 正在啟動 MongoDB 容器...
docker-compose -f config\docker-compose.yml up -d mongodb
if %errorlevel% neq 0 (
    echo ❌ MongoDB 容器啟動失敗
    pause
    exit /b 1
)

echo ✅ MongoDB 容器已啟動

REM 等待 MongoDB 初始化
echo 🔄 等待 MongoDB 初始化 (10秒)...
timeout /t 10 /nobreak >nul

REM 啟動 Node.js 服務器
echo 🔄 正在啟動 Node.js 服務器...
echo.
echo ================================================
echo   系統已啟動！請在瀏覽器中訪問:
echo   http://localhost:3000
echo ================================================
echo.
echo 按 Ctrl+C 停止服務器
echo.

node server.js
