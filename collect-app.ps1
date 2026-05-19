# Настройки
$SOURCE_DIR = "app"
$OUTPUT_FILE = "app-export.txt"
$EXCLUDE = @("node_modules", ".next", "dist", ".git")
$BINARY_EXTENSIONS = @(".jpg", ".png", ".gif", ".webp", ".ico", ".svg", ".woff", ".ttf", ".eot", ".woff2")

# Очищаем старый файл
if (Test-Path $OUTPUT_FILE) { Remove-Item $OUTPUT_FILE }

# Заголовок
"=== ByteWizard App Export ===" | Out-File -FilePath $OUTPUT_FILE -Encoding UTF8
"Дата: $(Get-Date -Format 'dd.MM.yyyy HH:mm:ss')" | Out-File -FilePath $OUTPUT_FILE -Append -Encoding UTF8
"" | Out-File -FilePath $OUTPUT_FILE -Append -Encoding UTF8
"=============================================" | Out-File -FilePath $OUTPUT_FILE -Append -Encoding UTF8

# Получаем все файлы
$files = Get-ChildItem -Path $SOURCE_DIR -Recurse -File -ErrorAction SilentlyContinue

foreach ($file in $files) {
    $filePath = $file.FullName
    $relativePath = $file.FullName -replace [regex]::Escape($SOURCE_DIR) + "\\", ""
    
    # Пропускаем исключённые папки
    $skip = $false
    foreach ($ex in $EXCLUDE) {
        if ($filePath -like "*$ex*") { $skip = $true; break }
    }
    if ($skip) { continue }
    
    # Пропускаем бинарные файлы
    foreach ($ext in $BINARY_EXTENSIONS) {
        if ($file.Extension -eq $ext) { $skip = $true; break }
    }
    if ($skip) { continue }
    
    # Заголовок файла
    "" | Out-File -FilePath $OUTPUT_FILE -Append -Encoding UTF8
    "─────────────────────────────────────────" | Out-File -FilePath $OUTPUT_FILE -Append -Encoding UTF8
    " FILE: $relativePath" | Out-File -FilePath $OUTPUT_FILE -Append -Encoding UTF8
    "─────────────────────────────────────────" | Out-File -FilePath $OUTPUT_FILE -Append -Encoding UTF8
    
    # Содержимое файла
    Get-Content $file.FullName -Encoding UTF8 | Out-File -FilePath $OUTPUT_FILE -Append -Encoding UTF8
    "" | Out-File -FilePath $OUTPUT_FILE -Append -Encoding UTF8
}

Write-Host "✅ Готово! Результат в файле: $OUTPUT_FILE" -ForegroundColor Green
Write-Host "📊 Размер: $((Get-Item $OUTPUT_FILE).Length) байт" -ForegroundColor Cyan