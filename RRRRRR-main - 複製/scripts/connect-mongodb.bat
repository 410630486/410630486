@echo off
echo 🗄️  連接到 MongoDB Shell...
echo.

REM 移動到項目根目錄
cd /d "%~dp0.."

echo 📍 連接信息:
echo    主機: localhost:27017
echo    用戶: admin
echo    密碼: admin123
echo    資料庫: school_system
echo.
docker exec -it school_system_mongodb mongosh --username admin --password admin123 --authenticationDatabase admin school_system
