@echo off
echo Avvio dei server...

:: 1. Avvio app.js (della cartella service)
start "Service" cmd /k "cd /d C:\Users\francesco.biguzzi\Esercizio_server\service" && node src/app.js"

:: Attesa di 2 secondi per consentire l'avvio ordinato
timeout /t 2 /nobreak >nul

:: 2. Avvio server.js (di AUTHserver/src)
start "AUTH Server" cmd /k "cd /d C:\Users\francesco.biguzzi\Esercizio_server\AUTHserver\src" && node server.js"

timeout /t 2 /nobreak >nul

:: 3. Avvio gateway.js (di gateway/src)
start "Gateway" cmd /k "cd /d C:\Users\francesco.biguzzi\Esercizio_server\gateway\src" && node gateway.js"

echo Tutti i tre terminali sono stati avviati!