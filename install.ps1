# Instala las skills y plugins de este repo de forma GLOBAL (para tu usuario).
# Uso (desde la carpeta del repo):  powershell -ExecutionPolicy Bypass -File .\install.ps1

$ErrorActionPreference = 'Stop'
$repo   = $PSScriptRoot
$target = Join-Path $env:USERPROFILE '.claude\skills'

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host 'Claude Code no está instalado. Mira MANUAL-HERRAMIENTAS.md, sección Claude Code.' -ForegroundColor Red
    exit 1
}

# 1. Skills sueltas -> ~/.claude/skills
New-Item -ItemType Directory -Force $target | Out-Null
$skills = Get-ChildItem (Join-Path $repo 'skills') -Directory
foreach ($s in $skills) {
    $dest = Join-Path $target $s.Name
    if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
    Copy-Item -Recurse $s.FullName $dest
}
Write-Host "OK  $($skills.Count) skills copiadas en $target" -ForegroundColor Green

# 2. Plugins (marketplace -> plugin)
$ErrorActionPreference = 'Continue'
$plugins = Get-Content (Join-Path $repo 'plugins.json') -Raw | ConvertFrom-Json
foreach ($p in $plugins) {
    Write-Host "--> $($p.plugin)" -ForegroundColor Cyan
    claude plugin marketplace add $p.source
    claude plugin install $p.plugin
    if ($LASTEXITCODE -ne 0) { Write-Host "    ERROR instalando $($p.plugin)" -ForegroundColor Yellow }
}

Write-Host "`nListo. Cierra y vuelve a abrir Claude Code para que cargue todo." -ForegroundColor Green
