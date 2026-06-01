@echo off
setlocal
:: Start the Angular frontend and the backend web app from the repository root.

echo Streaming Tool wird gestartet...
echo Starting frontend...
if exist ".\Frontend\control-panel\package.json" (
    start "Streaming Tool Frontend" /min cmd /k "cd /d ".\Frontend\control-panel" && npm i && npm start"
) else (
    echo Frontend project not found! Press any key to exit...
    pause > nul
    exit /b 0
)

echo Starting backend...
if exist ".\Backend\DSB.StreamBackend\DSB.StreamBackend.csproj" (
    start "Streaming Tool Backend" /min cmd /k "cd /d ".\Backend\DSB.StreamBackend" && dotnet run"
) else (
    echo Backend project not found! Stopping frontend...
    taskkill /im "cmd.exe" /f /fi "WindowTitle eq Streaming Tool Frontend*" > nul
    echo Press any key to exit...
    pause > nul
    exit /b 0
)

start http://localhost:4200
echo Webseite wurde im Browser geoeffnet.
echo Streaming Tool gestartet. Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen...
pause > nul
exit /b 0
