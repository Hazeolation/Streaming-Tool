# DSB Streaming Tool

Ein Overlay-Tool für die Deutsche Splatoon Bundesliga. Overlays laufen als Browserquelle in OBS, das Control Panel steuert alles in Echtzeit per SignalR.

## Stack

- **Frontend** - Angular (Control Panel + Overlays)
- **Backend** - ASP.NET Core 9, SignalR, SQLite

## Overlays

| Route | Beschreibung |
|---|---|
| `/overlay/score-box` | Punktestand beider Teams |
| `/overlay/map-screen` | Map-Anzeige |
| `/overlay/commentator-box` | Kommentatoren |
| `/overlay/info-box` | Info-Box |

## Quickstart

**Backend**

Öffne `Backend/DSB.StreamBackend/DSB.StreamBackend.csproj` in Visual Studio und starte das Projekt. Der Server läuft dann auf `https://localhost:{port}` - die genaue URL steht im Output-Fenster. Swagger ist unter `/swagger` erreichbar.

**Frontend**

```bash
cd Frontend/control-panel
npm install
npm start
```

Angular läuft danach auf `http://localhost:4200`. Das Control Panel erreichst du direkt über `http://localhost:4200` - also einfach die Root-URL, kein extra Pfad nötig. Die Overlays sind unter den Routes in der Tabelle oben erreichbar.

> Hinweis: Das Backend muss laufen, damit die Overlays per SignalR live aktualisiert werden!

## Screenshots

**Control Panel**
![Control Panel](docs/screenshots/control_panel.png)

**Score-Box Overlay**
![Score-Box](docs/screenshots/score-box.png)

**Info-Box Overlay**
![Info-Box](docs/screenshots/info-box.png)
