# Frontend – Technical Documentation

## Stack

### Still needs to be adjusted

| Component         | Technology                    |
| ----------------- | ----------------------------- |
| Framework         | ASP.NET Core 9.0              |
| Real-Time         | SignalR                       |
| ORM               | Entity Framework Core 9       |
| Database          | SQLite (`dsb-stream-tool.db`) |
| API-Documentation | Swagger / Swashbuckle         |

---

## Project Structure

```
control-panel/
├── public/                      # Images and vector graphics for displaying
├── src/
│   ├── app/
│   │   ├── feature/             # Control panel specific components
│   │   ├── layouts/             # Main layout components for dashboard (Sidebar, ...)
│   │   ├── models/              # Interfaces for map data types, broadcast state, ...
│   │   ├── overlay/             # Overlays that get integrated in OBS as browser sources
│   │   ├── pages/               # Components to display specific pages like the dashboard
│   │   ├── services/            # Frontend APIs to retrieve and modify data
│   │   │
│   │   │ # Config settings and registration of main app, as well as router settings
│   │   ├── app.config.server.ts
│   │   ├── app.config.ts
│   │   ├── app.html
│   │   ├── app.routes.server.ts
│   │   ├── app.routes.ts
│   │   ├── app.scss
│   │   ├── app.spec.ts
│   │   └── app.ts
│   │
│   │ # Bootstrap application registration
│   ├── main.ts
│   ├── mainserver.ts
│   └── server.ts
```

---

## Data Models

### `BroadcastStates`

| Column               | Type     | Description              |
| -------------------- | -------- | ------------------------ |
| `teamAlphaName`      | `string` | Name Team Alpha          |
| `teamBravoName`      | `string` | Name Team Bravo          |
| `alphaIsLeft`        | `bool`   | Side Display Alpha       |
| `scoreAlpha`         | `int`    | Point Score Alpha        |
| `scoreBravo`         | `int`    | Point Score Bravo        |
| `streamer`           | `string` | Streamer Name            |
| `commentator1/2`     | `string` | Commentator Names        |
| `showMapScreen`      | `bool`   | Overlay Visibility       |
| `showScoreBox`       | `bool`   |                          |
| `showCommentatorBox` | `bool`   |                          |
| `showInfobox`        | `bool`   |                          |
| `season`             | `int`    | Current Season           |
| `division`           | `int`    | Current Division         |
| `week`               | `int`    | Current Season Week      |
| `startTime`          | `Date`   | Time the match starts at |

### `MapStates`

Foreign Key `BroadcastStateEntityId → BroadcastStates.Id` with `ON DELETE CASCADE`.

| Column                | Type            | Description        |
| --------------------- | --------------- | ------------------ |
| `id`                  | `string` (GUID) | Primary Key        |
| `prder`               | `int`           | Order              |
| `mapId` / `mapName`   | `string`        | Map Reference      |
| `modeId` / `modeName` | `string`        | Mode Reference     |
| `imageUrl`            | `string`        | Preview Image      |
| `winner`              | `string?`       | `null` = No Result |
| `isVisible`           | `bool`          | Overlay Visibility |

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

| Event                   | Triggered By                | Payload             |
| ----------------------- | --------------------------- | ------------------- |
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

The SQLite file (`dsb-stream-tool.db`) gets created in the working directory of the process.

---

## Add New Migration

```bash
dotnet ef migrations add <Name> --project Backend/DSB.StreamBackend
```
