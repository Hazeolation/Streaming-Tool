@echo off
setlocal
:: Start the Angular frontend and the backend web app from the repository root.

echo Streaming Tool wird gestartet...
echo Suche nach Abhaengigkeiten...

call :checkExecutable node "Node.js" OpenJS.NodeJS "https://nodejs.org"
if errorlevel 1 exit /b 0

call :checkDotNet9
if errorlevel 1 exit /b 0

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
echo Streaming Tool gestartet. Druecken Sie eine beliebige Taste, um dieses Fenster zu schlieÃen...
pause > nul
exit /b 0

:checkExecutable
setlocal
set "exe=%~1"
set "name=%~2"
set "wingetId=%~3"
set "installUrl=%~4"
where %exe% >nul 2>nul
if %errorlevel% equ 0 (
    echo %name% gefunden!
    endlocal
    exit /b 0
)

echo %name% ist nicht installiert! Installieren? (y/N)
set /p "installChoice="
if /i "%installChoice%"=="y" (
    echo Installiere %name% mittels WinGet...
    winget install -e --id %wingetId%
    where %exe% >nul 2>nul
    if %errorlevel% neq 0 (
        echo %name% Installation ist fehlgeschlagen. Bitte installieren Sie %name% manuell von %installUrl%.
        echo Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen...
        pause > nul
        endlocal
        exit /b 1
    )
    echo %name% wurde erfolgreich installiert!
    endlocal
    exit /b 0
)

echo %name% wird benoetigt. Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen...
pause > nul
endlocal
exit /b 1

:checkDotNet9
setlocal
where dotnet >nul 2>nul
if %errorlevel% neq 0 (
    set "dotnetOk=0"
) else (
    set "dotnetOk=0"
    for /f "delims=" %%A in ('dotnet --list-sdks 2^>nul ^| findstr /r "^9\."') do set "dotnetOk=1"
)

if %dotnetOk% equ 1 (
    endlocal
    echo .NET 9 SDK gefunden!
    exit /b 0
)

echo .NET 9 SDK ist nicht installiert! Installieren? (y/N)
set /p "installDotNet="
if /i "%installDotNet%"=="y" (
    echo Installiere .NET 9 SDK mittels WinGet...
    winget install -e --id Microsoft.DotNet.SDK.9
    set "dotnetOk=0"
    for /f "delims=" %%A in ('dotnet --list-sdks 2^>nul ^| findstr /r "^9\."') do set "dotnetOk=1"
    if %dotnetOk% equ 1 (
        echo .NET 9 SDK wurde erfolgreich installiert!
        endlocal
        exit /b 0
    )
    echo .NET Installation ist fehlgeschlagen. Bitte installieren Sie .NET 9 manuell von https://dotnet.microsoft.com/en-us/download/dotnet/9.0
    echo Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen...
    pause > nul
    endlocal
    exit /b 1
)

echo .NET 9 wird benoetigt. Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen...
pause > nul
endlocal
exit /b 1