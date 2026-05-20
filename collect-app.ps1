# Настройки
$SOURCE_DIR = "app"
$OUTPUT_FILE = "app-export.txt"

$EXCLUDE = @(
    "node_modules",
    ".next",
    "dist",
    ".git"
)

$BINARY_EXTENSIONS = @(
    ".jpg",
    ".png",
    ".gif",
    ".webp",
    ".ico",
    ".svg",
    ".woff",
    ".ttf",
    ".eot",
    ".woff2"
)

# Удаляем старый файл
if (Test-Path $OUTPUT_FILE) {
    Remove-Item $OUTPUT_FILE
}

# Заголовок
"=== ByteWizard App Export ===" | Out-File $OUTPUT_FILE -Encoding utf8
"Дата: $(Get-Date -Format 'dd.MM.yyyy HH:mm:ss')" | Out-File $OUTPUT_FILE -Append -Encoding utf8
"" | Out-File $OUTPUT_FILE -Append -Encoding utf8
"=============================================" | Out-File $OUTPUT_FILE -Append -Encoding utf8

# Получаем файлы
$files = Get-ChildItem $SOURCE_DIR -Recurse -File -ErrorAction SilentlyContinue

foreach ($file in $files) {

    $filePath = $file.FullName

    $relativePath = $file.FullName -replace [regex]::Escape("$PWD\$SOURCE_DIR\"), ""

    # Проверка исключений
    $skip = $false

    foreach ($ex in $EXCLUDE) {
        if ($filePath -like "*$ex*") {
            $skip = $true
            break
        }
    }

    if ($skip) {
        continue
    }

    # Проверка бинарных файлов
    foreach ($ext in $BINARY_EXTENSIONS) {
        if ($file.Extension -eq $ext) {
            $skip = $true
            break
        }
    }

    if ($skip) {
        continue
    }

    # Заголовок файла
    "" | Out-File $OUTPUT_FILE -Append -Encoding utf8
    "─────────────────────────────────────────" | Out-File $OUTPUT_FILE -Append -Encoding utf8
    "FILE: $relativePath" | Out-File $OUTPUT_FILE -Append -Encoding utf8
    "─────────────────────────────────────────" | Out-File $OUTPUT_FILE -Append -Encoding utf8

    # Содержимое
    Get-Content -LiteralPath $file.FullName | Out-File $OUTPUT_FILE -Append -Encoding utf8

    "" | Out-File $OUTPUT_FILE -Append -Encoding utf8
}

Write-Host ""
Write-Host "Готово! Результат: $OUTPUT_FILE" -ForegroundColor Green
Write-Host "Размер: $((Get-Item $OUTPUT_FILE).Length) байт" -ForegroundColor Cyan