# Backend – Technische Dokumentation

## Stack

| Komponente | Technologie |
|---|---|
| Framework | ASP.NET Core 9.0 |
| Echtzeit | SignalR |
| ORM | Entity Framework Core 9 |
| Datenbank | SQLite (`dsb-stream-tool.db`) |
| API-Doku | Swagger / Swashbuckle |

---

## Projektstruktur

```
DSB.StreamBackend/
├── Controllers/
│   └── BroadcastController.cs   # REST-Endpunkte
├── Hubs/
│   ├── IOverlayClient.cs        # Typisiertes SignalR-Interface
│   └── OverlayHub.cs            # SignalR-Hub
├── Services/
│   └── BroadcastStateService.cs # Business-Logik + DB-Zugriff
├── Models/
│   ├── BroadcastStateEntity.cs  # EF-Entität (Hauptzustand)
│   └── MapStateEntity.cs        # EF-Entität (Maps, 1:N)
├── Dtos/
│   ├── BroadcastStateDto.cs
│   └── MapStateDto.cs
├── Context/
│   └── StreamToolDbContext.cs   # EF DbContext
└── Migrations/                  # EF-Migrationen (auto-apply beim Start)
```

---

## Datenmodell

Der gesamte Broadcast-Zustand wird als **eine einzige Zeile** in der Datenbank gehalten (`BroadcastStateEntity.Id = 1`). Es gibt keinen Multi-Tenant-Support; der State ist global.

### `BroadcastStates` (1 Zeile)

| Spalte | Typ | Beschreibung |
|---|---|---|
| `Id` | `int` | Immer `1` (Singleton) |
| `TeamAlphaName` | `string` | Name Team Alpha |
| `TeamBravoName` | `string` | Name Team Bravo |
| `AlphaIsLeft` | `bool` | Seitenanzeige Alpha |
| `ScoreAlpha` | `int` | Punktestand Alpha |
| `ScoreBravo` | `int` | Punktestand Bravo |
| `Commentator1/2` | `string` | Kommentatorennamen |
| `ShowMapScreen` | `bool` | Overlay-Sichtbarkeit |
| `ShowScoreBox` | `bool` | |
| `ShowCommentatorBox` | `bool` | |
| `ShowInfobox` | `bool` | |
| `Season` | `int` | Aktuelle Saison |
| `Division` | `int` | Aktuelle Division |

### `MapStates` (0..N Zeilen)

Fremdschlüssel `BroadcastStateEntityId → BroadcastStates.Id` mit `ON DELETE CASCADE`.

| Spalte | Typ | Beschreibung |
|---|---|---|
| `Id` | `string` (GUID) | Primärschlüssel |
| `Order` | `int` | Reihenfolge |
| `MapId` / `MapName` | `string` | Map-Referenz |
| `ModeId` / `ModeName` | `string` | Modus-Referenz |
| `ImageUrl` | `string` | Vorschaubild |
| `Winner` | `string?` | `null` = kein Ergebnis |
| `IsVisible` | `bool` | Overlay-Sichtbarkeit |

---

## REST API

Basis-URL: `/api/broadcast`

### `GET /api/broadcast/state`

Gibt den aktuellen Broadcast-State zurück. Legt die Singleton-Zeile automatisch an, falls sie noch nicht existiert (Upsert).

**Response:** `BroadcastStateDto` (200)

---

### `POST /api/broadcast/state`

Überschreibt den Broadcast-State und broadcastet das Ergebnis per SignalR an alle verbundenen Overlay-Clients.

**Body:** `BroadcastStateDto`  
**Response:** `BroadcastStateDto` (200)

Maps werden per Upsert verarbeitet: bestehende Maps werden anhand ihrer GUID-ID gematcht und aktualisiert, fehlende Maps werden gelöscht, neue hinzugefügt.

---

## SignalR

Hub-Endpunkt: `/overlayHub`

Das Interface `IOverlayClient` typisiert alle Server→Client-Aufrufe:

```csharp
public interface IOverlayClient
{
    Task BroadcastStateUpdated(BroadcastStateDto state);
}
```

| Event | Ausgelöst durch | Payload |
|---|---|---|
| `BroadcastStateUpdated` | `POST /api/broadcast/state` | `BroadcastStateDto` |

---

## Service-Layer

`BroadcastStateService` ist als **Scoped** registriert (passend zum `DbContext`-Lifetime).

Kernmethoden:

- `GetOrCreateStateAsync()` — privater Upsert-Helper; legt die Singleton-Zeile an, falls nicht vorhanden
- `GetStateAsync()` — liest und gibt den State als DTO zurück
- `UpdateStateAsync(dto)` — schreibt State + Maps, gibt aktualisierten State zurück
- `UpdateMaps(entity, dtoMaps)` — Upsert-Logik für die Map-Liste
- `ToDto(entity)` — statische Mapping-Methode Entity → DTO

---

## CORS

Erlaubte Origins (konfiguriert in `Program.cs`):

- `http://localhost:4200` (Angular Dev)
- `http://localhost:4201`

`AllowCredentials()` ist gesetzt — erforderlich für SignalR mit Cookies/Auth.

---

## Startup-Verhalten

EF-Migrationen werden beim Start automatisch angewendet:

```csharp
using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<StreamToolDbContext>();
db.Database.Migrate();
```

Die SQLite-Datei (`dsb-stream-tool.db`) wird im Arbeitsverzeichnis des Prozesses angelegt.

---

## Neue Migration anlegen

```bash
dotnet ef migrations add <Name> --project Backend/DSB.StreamBackend
```
