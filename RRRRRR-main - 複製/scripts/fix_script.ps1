# 修復 index.html 中的 JavaScript 語法錯誤

# 移動到項目根目錄
Set-Location (Split-Path $PSScriptRoot -Parent)

# 讀取文件並修復問題
$content = Get-Content -Path "index.html" -Raw

# 找到問題區域並替換
$pattern = '(\s*loadAttendanceManagementPage\(\);\s*\}\s*)<small>遲到</small>.*?(?=async function showEmployeeDetails)'
$replacement = '$1

        // 員工管理函數
        async function showEmployeeDetails'

$fixedContent = $content -replace $pattern, $replacement

# 寫入修復後的文件
$fixedContent | Out-File -FilePath "index_fixed.html" -Encoding UTF8

Write-Host "已創建修復後的文件: index_fixed.html"
Write-Host "修復完成！按任意鍵繼續..."
Read-Host
