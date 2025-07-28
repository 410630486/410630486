@echo off
echo 🚀 停止 Docker 服務...
echo.

REM 移動到項目根目錄
cd /d "%~dp0.."

echo 🔄 正在停止 Docker 容器...
docker-compose -f config\docker-compose.yml down

echo ✅ Docker 服務已停止
echo.
echo 按任意鍵繼續...
pause >nul
