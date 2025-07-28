@echo off
echo 🧹 清理重複文件，整理項目結構...
echo.

echo 🗑️  正在刪除根目錄中的重複腳本文件...

REM 刪除重複的批次檔案
if exist "start.bat" (
    echo    - 刪除 start.bat
    del "start.bat" 2>nul
)

if exist "check-mongodb-status.bat" (
    echo    - 刪除 check-mongodb-status.bat
    del "check-mongodb-status.bat" 2>nul
)

if exist "connect-mongodb.bat" (
    echo    - 刪除 connect-mongodb.bat
    del "connect-mongodb.bat" 2>nul
)

if exist "start-docker.bat" (
    echo    - 刪除 start-docker.bat
    del "start-docker.bat" 2>nul
)

if exist "start-local.bat" (
    echo    - 刪除 start-local.bat
    del "start-local.bat" 2>nul
)

if exist "start-mongodb-docker.bat" (
    echo    - 刪除 start-mongodb-docker.bat
    del "start-mongodb-docker.bat" 2>nul
)

if exist "start-system-with-docker.bat" (
    echo    - 刪除 start-system-with-docker.bat
    del "start-system-with-docker.bat" 2>nul
)

if exist "stop-docker.bat" (
    echo    - 刪除 stop-docker.bat
    del "stop-docker.bat" 2>nul
)

if exist "stop-mongodb-docker.bat" (
    echo    - 刪除 stop-mongodb-docker.bat
    del "stop-mongodb-docker.bat" 2>nul
)

if exist "start.sh" (
    echo    - 刪除 start.sh
    del "start.sh" 2>nul
)

if exist "fix_script.ps1" (
    echo    - 刪除 fix_script.ps1
    del "fix_script.ps1" 2>nul
)

echo.
echo 🗑️  正在刪除根目錄中的重複配置文件...

if exist "docker-compose.yml" (
    echo    - 刪除 docker-compose.yml
    del "docker-compose.yml" 2>nul
)

if exist "nginx.conf" (
    echo    - 刪除 nginx.conf
    del "nginx.conf" 2>nul
)

if exist "Dockerfile.python" (
    echo    - 刪除 Dockerfile.python
    del "Dockerfile.python" 2>nul
)

if exist "cleanup.bat" (
    echo    - 刪除 cleanup.bat
    del "cleanup.bat" 2>nul
)

echo.
echo ✅ 清理完成！

echo.
echo 📁 整理後的目錄結構：
echo    📂 根目錄 - 只保留核心業務文件
echo    📂 scripts\ - 所有腳本文件
echo    📂 config\ - 所有配置文件
echo    📂 docs\ - 文檔文件

echo.
echo 🚀 現在可以使用以下命令啟動系統：
echo    .\scripts\start.bat

echo.
echo 按任意鍵繼續...
pause >nul

REM 刪除清理腳本自身
del "%~f0" 2>nul
