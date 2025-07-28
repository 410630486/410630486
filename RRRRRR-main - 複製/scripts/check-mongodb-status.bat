@echo off
echo 📊 MongoDB Docker 容器狀態檢查...
echo.

REM 移動到項目根目錄
cd /d "%~dp0.."

echo 🔍 容器運行狀態:
docker-compose -f config\docker-compose.yml ps

echo.
echo 📈 MongoDB 容器詳細信息:
docker inspect school_system_mongodb --format "{{.State.Status}}: {{.Config.Image}}"

echo.
echo 📋 最近的 MongoDB 日誌:
docker logs school_system_mongodb --tail 10

echo.
echo 🔗 連接測試:
echo db.adminCommand('ping') | docker exec -i school_system_mongodb mongosh --username admin --password admin123 --authenticationDatabase admin --quiet

echo.
echo 按任意鍵繼續...
pause >nul
