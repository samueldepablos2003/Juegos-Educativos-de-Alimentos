@echo off
chcp 65001 >nul
title NutriPlato - Modo Sin Internet
cd /d "%~dp0"

set "DIST_DIR=%~dp0dist"
if not exist "%DIST_DIR%\index.html" (
    set "DIST_DIR=%~dp0Juegos-Educativos-de-Alimentos-main\Juegos-Educativos-de-Alimentos-main\dist"
)

if not exist "%DIST_DIR%\index.html" (
    echo [ERROR] No se encontro la carpeta compilada "dist".
    pause
    exit /b 1
)

set "NODE_EXE=node"
where node >nul 2>&1
if errorlevel 1 (
    if exist "%ProgramFiles%\nodejs\node.exe" (
        set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
    ) else (
        echo [ERROR] No se encontro Node.js en el sistema.
        pause
        exit /b 1
    )
)

echo Iniciando NutriPlato sin internet...
"%NODE_EXE%" "%~dp0servidor_offline.cjs" "%DIST_DIR%"
pause
