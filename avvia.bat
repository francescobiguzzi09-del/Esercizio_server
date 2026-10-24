@echo off
setlocal
echo Avvio dei server...

:: Avvia ogni server dalla cartella del relativo progetto.
start "Service" /D "%~dp0backend\service" cmd /k "node src\app.js"

timeout /t 2 /nobreak >nul

start "AUTH Server" /D "%~dp0backend\AUTHserver" cmd /k "node src\server.js"

timeout /t 2 /nobreak >nul

start "Gateway" /D "%~dp0backend\gateway" cmd /k "node src\gateway.js"

echo Le finestre dei tre server sono state aperte.
endlocal