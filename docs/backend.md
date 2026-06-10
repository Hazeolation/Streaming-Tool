# Backend – Technical Documentation

## Stack

| Component | Technology |
|---|---|
| Framework | ASP.NET Core 9.0 |
| Real-Time | SignalR |
| ORM | Entity Framework Core 9 |
| Database | SQLite (`dsb-stream-tool.db`) |
| API-Documentation | Swagger / Swashbuckle |

---

## Project Structure

```
DSB.StreamBackend/
├── Controllers/
│   └── BroadcastController.cs   # REST-Endpoints
├── Hubs/
│   ├── IOverlayClient.cs        # SignalR-Interface
│   └── OverlayHub.cs            # SignalR-Hub
├── Services/
│   └── BroadcastStateService.cs # Business Logic + DB Access
├── Models/
│   ├── BroadcastStateEntity.cs  # EF-Entity (Main State)
│   └── MapStateEntity.cs        # EF-Entity (Maps, 1:N)
├── Dtos/
│   ├── BroadcastStateDto.cs
│   └── MapStateDto.cs
├── Context/
│   └── StreamToolDbContext.cs   # EF DbContext
└── Migrations/                  # EF-Migrations (auto-apply on Start)
```

---

## Data Model

The entire Broadcast State is held in the database as **a single row** (`BroadcastStateEntity.Id = 1`). There is no multi-tenant support; the state is global.

### `BroadcastStates` (1 Column)

| Column | Type | Description |
|---|---|---|
| `Id` | `int` | Always `1` (Singleton) |
| `TeamAlphaName` | `string` | Name Team Alpha |
| `TeamBravoName` | `string` | Name Team Bravo |
| `AlphaIsLeft` | `bool` | Side Display Alpha |
| `ScoreAlpha` | `int` | Point Score Alpha |
| `ScoreBravo` | `int` | Point Score Bravo |
| `Streamer` | `string` | Streamer Name |
| `Commentator1/2` | `string` | Commentator Names |
| `ShowMapScreen` | `bool` | Overlay Visibility |
| `ShowScoreBox` | `bool` | |
| `ShowCommentatorBox` | `bool` | |
| `ShowInfobox` | `bool` | |
| `Season` | `int` | Current Season |
| `Division` | `int` | Current Division |

### `MapStates` (0..N Columns)

Foreign Key `BroadcastStateEntityId → BroadcastStates.Id` with `ON DELETE CASCADE`.

| Column | Type | Description |
|---|---|---|
| `Id` | `string` (GUID) | Primary Ke |
| `Order` | `int` | Order |
| `MapId` / `MapName` | `string` | Map Reference |
| `ModeId` / `ModeName` | `string` | Mode Reference |
| `ImageUrl` | `string` | Preview Image |
| `Winner` | `string?` | `null` = No Result |
| `IsVisible` | `bool` | Overlay Visibility |

---

## REST API

Base URL: `/api/broadcast`

### `GET /api/broadcast/state`

Gets the current Broadcast State. Automatically adds the Singleton-Row, if it doesn't exist (Upsert).

**Response:** `BroadcastStateDto` (200)

---

### `POST /api/broadcast/state`

Overwrites the Broadcast State und broadcasts the Result to all connected Overlay Clients via SignalR.

**Body:** `BroadcastStateDto`  
**Response:** `BroadcastStateDto` (200)

Maps are handled via Upsert: Existing Maps are matched and updated based on their GUID, missing Maps get deleted, new Maps added.

---

## SignalR

Hub Endpointt: `/overlayHub`

The Interface `IOverlayClient` types all Server→Client Calls:

```csharp
public interface IOverlayClient
{
    Task BroadcastStateUpdated(BroadcastStateDto state);
}
```

| Event | Triggered By | Payload |
|---|---|---|
| `BroadcastStateUpdated` | `POST /api/broadcast/state` | `BroadcastStateDto` |

---

## Service Layer

`BroadcastStateService` is registered as **Scoped** (befitting of the `DbContext` lifetime).  

Core Methods:

- `GetOrCreateStateAsync()` — private Upsert Helper, adds the Singleton Row, if it doesn't exist
- `GetStateAsync()` — reads and returns the State as a DTO
- `UpdateStateAsync(dto)` — writes State + Maps, returns updated State
- `UpdateMaps(entity, dtoMaps)` — Upset Logic for the Map List
- `ToDto(entity)` — static Mapping Method Entity → DTO

---

## CORS

Allows Origins (configured in `Program.cs`):

- `http://localhost:4200` (Angular Dev)
- `http://localhost:4201`

`AllowCredentials()` is set — required for SignalR with Cookies/Auth.

---

## Startup Behaviour

EF Migrations are automatically applied on start:

```csharp
using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<StreamToolDbContext>();
db.Database.Migrate();
```

The SQLite file (`dsb-stream-tool.db`)  gets created in the working directory of the process.

---

## Add New Migration

```bash
dotnet ef migrations add <Name> --project Backend/DSB.StreamBackend
```
