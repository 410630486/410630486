#!/bin/bash

echo "================================================"
echo "          校務系統 MongoDB 版本啟動"
echo "================================================"
echo

# 移動到腳本的父目錄（項目根目錄）
cd "$(dirname "$0")/.."

# 檢查是否安裝了 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝或未啟動"
    echo "請先安裝並啟動 Docker"
    exit 1
fi

echo "✅ Docker 已安裝"

# 檢查是否安裝了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝"
    echo "請先安裝 Node.js"
    exit 1
fi

echo "✅ Node.js 已安裝"

# 檢查並安裝 npm 依賴
if [ ! -d "node_modules" ]; then
    echo "🔄 正在安裝依賴..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install 失敗"
        exit 1
    fi
fi

echo "✅ 依賴已安裝"

# 啟動 MongoDB 容器
echo "🔄 正在啟動 MongoDB 容器..."
docker-compose -f config/docker-compose.yml up -d mongodb
if [ $? -ne 0 ]; then
    echo "❌ MongoDB 容器啟動失敗"
    exit 1
fi

echo "✅ MongoDB 容器已啟動"

# 等待 MongoDB 初始化
echo "🔄 等待 MongoDB 初始化 (10秒)..."
sleep 10

# 啟動 Node.js 服務器
echo "🔄 正在啟動 Node.js 服務器..."
echo
echo "================================================"
echo "   系統已啟動！請在瀏覽器中訪問:"
echo "   http://localhost:3000"
echo "================================================"
echo
echo "按 Ctrl+C 停止服務器"
echo

node server.js
