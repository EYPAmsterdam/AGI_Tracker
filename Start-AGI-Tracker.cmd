@echo off
setlocal EnableExtensions

cd /d "%~dp0"

echo [AGI Tracker] Preparing launcher...

call :resolve_node_tools
if errorlevel 1 (
  echo [AGI Tracker] Node.js was not found. Attempting automatic installation...
  call :install_node
  call :resolve_node_tools
  if errorlevel 1 goto :missing_node
)

if not exist "node_modules\next\package.json" (
  echo [AGI Tracker] First run detected. Installing dependencies...
  call "%NPM_CMD%" install
  if errorlevel 1 goto :install_failed
)

call :pick_port
if errorlevel 1 goto :port_failed

echo [AGI Tracker] Starting app on http://localhost:%APP_PORT%
start "AGI Milestone Tracker Server" "%ComSpec%" /k cd /d "%~dp0" ^&^& echo [AGI Tracker] Server running at http://localhost:%APP_PORT% ^&^& echo [AGI Tracker] Close this window to stop the app. ^&^& call "%NPM_CMD%" run dev -- --port %APP_PORT%

echo [AGI Tracker] Waiting for the UI to come online...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$url = 'http://localhost:%APP_PORT%';" ^
  "$deadline = (Get-Date).AddMinutes(2);" ^
  "while ((Get-Date) -lt $deadline) {" ^
  "  try {" ^
  "    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2;" ^
  "    if ($response.StatusCode -ge 200) { Start-Process $url; exit 0 }" ^
  "  } catch {}" ^
  "  Start-Sleep -Seconds 1" ^
  "}" ^
  "Start-Process $url"

exit /b 0

:resolve_node_tools
set "NODE_EXE="
set "NPM_CMD="

for /f "delims=" %%I in ('where node 2^>nul') do if not defined NODE_EXE set "NODE_EXE=%%~fI"
for /f "delims=" %%I in ('where npm.cmd 2^>nul') do if not defined NPM_CMD set "NPM_CMD=%%~fI"

if defined NODE_EXE if defined NPM_CMD exit /b 0

for %%D in ("%ProgramFiles%\nodejs" "%ProgramFiles(x86)%\nodejs" "%LocalAppData%\Programs\nodejs") do (
  if not defined NODE_EXE if exist "%%~D\node.exe" set "NODE_EXE=%%~D\node.exe"
  if not defined NPM_CMD if exist "%%~D\npm.cmd" set "NPM_CMD=%%~D\npm.cmd"
)

if defined NODE_EXE if defined NPM_CMD exit /b 0
exit /b 1

:install_node
where winget >nul 2>nul
if errorlevel 1 goto :install_node_fallback

echo [AGI Tracker] Installing Node.js LTS with Windows Package Manager...
echo [AGI Tracker] Windows may ask for permission. This can take a minute or two.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$arguments = 'install --id OpenJS.NodeJS.LTS --exact --accept-package-agreements --accept-source-agreements --disable-interactivity';" ^
  "$process = Start-Process -FilePath 'winget' -ArgumentList $arguments -Verb RunAs -Wait -PassThru;" ^
  "exit $process.ExitCode"

exit /b 0

:install_node_fallback
echo [AGI Tracker] winget is not available, so automatic Node.js install cannot continue.
start "" "https://nodejs.org/en/download"
exit /b 1

:pick_port
for %%P in (3000 3001 3002 3003 3004 3005) do (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $listener = New-Object System.Net.Sockets.TcpListener([Net.IPAddress]::Loopback, %%P); $listener.Start(); $listener.Stop(); exit 0 } catch { exit 1 }"
  if not errorlevel 1 (
    set "APP_PORT=%%P"
    exit /b 0
  )
)
exit /b 1

:missing_node
echo.
echo [AGI Tracker] Node.js and npm are still not available.
echo [AGI Tracker] If a Windows install prompt appeared, complete it and then double-click this file again.
echo [AGI Tracker] If not, the Node.js download page will help you install it once.
pause
exit /b 1

:install_failed
echo.
echo [AGI Tracker] npm install failed.
echo [AGI Tracker] Fix the error above and then run this launcher again.
pause
exit /b 1

:port_failed
echo.
echo [AGI Tracker] Could not find an open port between 3000 and 3005.
echo [AGI Tracker] Close the other app using those ports and try again.
pause
exit /b 1
