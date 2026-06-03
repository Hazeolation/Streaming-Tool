#!/bin/sh

echo "Streaming Tool wird gestartet..."
echo "Suche nach Abhängigkeiten..."

# Check for Node.js
echo "Checking for Node.js..."
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js ist nicht installiert! Installieren? (y/N)"
  read -r installNode
  if [ "$installNode" = "y" ] || [ "$installNode" = "Y" ]; then
    echo "Installiere Node.js..."
    if command -v apt-get >/dev/null 2>&1; then
      sudo apt-get update && sudo apt-get install -y nodejs npm
    elif command -v brew >/dev/null 2>&1; then
      brew install node
    else
      echo "Paketmanager nicht erkannt. Bitte installieren Sie Node.js manuell von https://nodejs.org"
      read -r -n 1 -s dummy
      exit 0
    fi
    if ! command -v node >/dev/null 2>&1; then
      echo "Node.js Installation ist fehlgeschlagen. Bitte installieren Sie node.js manuell von https://nodejs.org. Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen..."
      read -r -n 1 -s dummy
      exit 0
    fi
    echo "Node.js wurde erfolgreich installiert!"
  else
    echo "Node.js wird benoetigt. Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen..."
    read -r -n 1 -s dummy
    exit 0
  fi
fi

# Check for .NET
echo "Checking for .NET..."
if ! command -v dotnet >/dev/null 2>&1; then
  echo ".NET ist nicht installiert! Installieren? (y/N)"
  read -r installDotNet
  if [ "$installDotNet" = "y" ] || [ "$installDotNet" = "Y" ]; then
    echo "Installiere .NET SDK..."
    if command -v apt-get >/dev/null 2>&1; then
      wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
      chmod +x dotnet-install.sh
      sudo ./dotnet-install.sh --version 9.0
      rm dotnet-install.sh
    elif command -v brew >/dev/null 2>&1; then
      brew install dotnet
    else
      echo "Paketmanager nicht erkannt. Bitte installieren Sie .NET manuell von https://dotnet.microsoft.com/en-us/download/dotnet/9.0"
      read -r -n 1 -s dummy
      exit 0
    fi
    if ! command -v dotnet >/dev/null 2>&1; then
      echo ".NET Installation ist fehlgeschlagen. Bitte installieren Sie .NET manuell von https://dotnet.microsoft.com/en-us/download/dotnet/9.0. Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen..."
      read -r -n 1 -s dummy
      exit 0
    fi
  else
    echo ".NET wird benoetigt. Druecken Sie eine beliebige Taste, um dieses Fenster zu schliessen..."
    read -r -n 1 -s dummy
    exit 0
  fi
fi

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
