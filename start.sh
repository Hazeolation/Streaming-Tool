#!/bin/sh

echo "Streaming Tool wird gestartet..."
echo "Starting frontend..."
if [ -f "./Frontend/control-panel/package.json" ]; then
  (
    cd "./Frontend/control-panel" || exit 1
    npm install
    npm start
  ) &
else
  echo "Frontend project not found! Press any key to exit..."
  read -r -n 1 -s dummy
fi

echo "Starting backend..."
if [ -f "./Backend/DSB.StreamBackend/DSB.StreamBackend.csproj" ]; then
  (
    cd "./Backend/DSB.StreamBackend" || exit 1
    dotnet run
  ) &
else
  echo "Backend project not found! Stopping frontend..."
  pkill -f "npm start" > /dev/null 2>&1 || true
  echo "Press any key to exit..."
  read -r -n 1 -s dummy
fi

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:4200"
else
  echo "Bitte oeffnen Sie http://localhost:4200 im Browser."
fi

echo "Webseite wurde im Browser geoeffnet."
echo "Streaming Tool gestartet. Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen..."
read -r -n 1 -s dummy
exit 0
