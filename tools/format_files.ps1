# tools/format_files.ps1
# Enforces project coding standards for MD and JS files.

Write-Host "Running Code Formatting Script..."

# Helper to write UTF-8 without BOM (standard for Web/Linux, widely compatible)
function Write-Utf8NoBom {
    param($Path, $Content)
    $enc = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($Path, $Content, $enc)
}

# 1. MARKDOWN: CRLF, Spaces, UTF-8
Get-ChildItem -Recurse -Filter *.md | Where-Object { $_.FullName -notmatch 'node_modules|\.git' } | ForEach-Object {
    $path = $_.FullName
    $content = [System.IO.File]::ReadAllText($path)
    
    # Normalize to LF first
    $content = $content -replace "`r`n", "`n"
    # Convert Tabs to 4 Spaces (standard markdown indent)
    $content = $content -replace "`t", "    "
    # Convert to CRLF
    $content = $content -replace "`n", "`r`n"
    
    Write-Utf8NoBom -Path $path -Content $content
    Write-Host "Formatted (MD/CRLF): $($_.Name)"
}

# 2. JAVASCRIPT: CRLF, 2 Spaces, Single Final CRLF, UTF-8
Get-ChildItem -Recurse -Filter *.js | Where-Object { $_.FullName -notmatch 'node_modules|\.git' } | ForEach-Object {
    $path = $_.FullName
    $content = [System.IO.File]::ReadAllText($path)
    
    # Normalize to LF
    $content = $content -replace "`r`n", "`n"
    
    # Convert Tabs to 2 Spaces
    $content = $content -replace "`t", "  "
    
    # Convert to CRLF
    $content = $content -replace "`n", "`r`n"
    
    # Ensure Single Final CRLF
    $content = $content.TrimEnd() + "`r`n"
    
    Write-Utf8NoBom -Path $path -Content $content
    Write-Host "Formatted (JS/CRLF): $($_.Name)"
}

Write-Host "Formatting Complete."
