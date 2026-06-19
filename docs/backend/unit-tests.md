# Unit Tests – Technical Documentation

## Stack

| Component | Technology |
|---|---|
| Framework | .NET 9.0 / NUnit 4.2.2 |
| Database | Microsoft.EntityFrameworkCore.InMemory 9.0.4 |
| Mocking | Moq 4.20.72 |
| Test Adapter | NUnit3TestAdapter 4.6.0 |
| Coverage | coverlet.collector 6.0.2 |

---

## Project Structure

```
tests/
└── DSB.StreamBackend.Tests/
    ├── DSB.StreamBackend.Tests.csproj
    ├── nuget.config
    ├── Controllers/
    │   └── BroadcastControllerTests.cs   # REST endpoint tests
    └── Services/
        └── BroadcastStateServiceTests.cs # Business logic tests
```

The test project is part of the solution file at the repository root (`DSB.StreamTool.sln`), nested under the `tests` solution folder alongside the E2E project.

---

## Prerequisites

No running backend or frontend is required. Unit tests are fully self-contained:

- **Service tests** use an in-memory EF Core database that is created and destroyed per test.
- **Controller tests** replace the SignalR hub with a Moq mock — no WebSocket connection is established.

---

## Running the Tests

```powershell
# From the repository root — runs all 15 unit tests
dotnet test tests/DSB.StreamBackend.Tests/DSB.StreamBackend.Tests.csproj

# Or via the solution (runs unit tests and E2E tests)
dotnet test DSB.StreamTool.sln
```

Expected output:

```
Bestanden!   : Fehler:     0, erfolgreich:    15, übersprungen:     0, gesamt:    15
```

---

## Test Classes

### `BroadcastStateServiceTests` (10 tests)

Tests `BroadcastStateService` against an isolated in-memory database. Each `[SetUp]` creates a new `DbContextOptions` with a unique database name (`Guid.NewGuid().ToString()`), so tests never share state.

| Test | What it verifies |
|---|---|
| `GetStateAsync_WhenNoStateExists_CreatesAndReturnsDefaultState` | When the DB is empty, a new singleton row (Id=1) is created with the default values (`"Team Alpha"`, `"Team Bravo"`, `AlphaIsLeft = true`) |
| `GetStateAsync_WhenStateExists_ReturnsPersisted` | When a row already exists, its persisted values are returned unchanged |
| `GetStateAsync_ReturnsMapsOrderedByOrder` | Maps are always returned sorted by `Order`, regardless of insertion order |
| `UpdateStateAsync_UpdatesAllFields` | All scalar fields (team names, scores, streamer, commentators, visibility flags, season, division) are written correctly |
| `UpdateStateAsync_PersistsChangesToDatabase` | Changes are flushed to the database and readable on the next query |
| `UpdateStateAsync_AddsNewMaps` | Maps with an empty `Id` are added; the returned DTO contains all new maps |
| `UpdateStateAsync_UpdatesExistingMap` | A map that already exists (matched by GUID) has its fields updated in place |
| `UpdateStateAsync_RemovesMapsNotInDto` | Maps present in the database but absent from the DTO are deleted |
| `UpdateStateAsync_MapsOrderedByOrder` | Maps passed in arbitrary order are inserted and returned sorted by `Order` |
| `UpdateStateAsync_NewMapWithEmptyId_GetsGeneratedId` | A map submitted with `Id = ""` receives an auto-generated non-empty GUID |

> [!NOTE]
> The singleton design of `BroadcastStateEntity` (always `Id = 1`) means `GetOrCreateStateAsync` either fetches the existing row or inserts a new one. Tests that rely on a pre-existing row seed it directly via `_db.BroadcastStates.Add(...)` before calling the service.

---

### `BroadcastControllerTests` (5 tests)

Tests `BroadcastController` using the real `BroadcastStateService` (backed by in-memory EF Core) and a mocked `IHubContext<OverlayHub, IOverlayClient>`.

| Test | What it verifies |
|---|---|
| `GetState_ReturnsOkWithState` | `GET /api/broadcast/state` returns an `OkObjectResult` containing a `BroadcastStateDto` |
| `GetState_ReturnsCurrentBroadcastState` | The returned DTO reflects the current state (defaults: `"Team Alpha"`, `"Team Bravo"`) |
| `UpdateState_ReturnsOkWithUpdatedState` | `POST /api/broadcast/state` returns `200 OK` with the updated DTO |
| `UpdateState_NotifiesAllOverlayClients` | `hub.Clients.All.BroadcastStateUpdated(...)` is called exactly once after each update |
| `UpdateState_SendsUpdatedStateToOverlayClients` | The state passed to the SignalR notification matches the DTO that was submitted |

> [!NOTE]
> The mock setup chains `IHubContext → IHubClients<IOverlayClient> → IOverlayClient`. `_hubClientsMock.Setup(x => x.All).Returns(_overlayClientMock.Object)` wires the `.All` property so that `hub.Clients.All.BroadcastStateUpdated(...)` resolves to the mock without requiring a real SignalR connection.

---

## Design Decisions

### In-Memory Database over SQLite

EF Core's `UseInMemoryDatabase` is used rather than an in-process SQLite file. This keeps tests fast and dependency-free — no file I/O, no migration execution. The trade-off is that some SQL-level constraints (e.g. cascade deletes enforced by the database engine) are not exercised; those are covered by the E2E tests instead.

### No Mocking of the Service Layer

`BroadcastControllerTests` constructs a real `BroadcastStateService` rather than mocking it. This means controller tests exercise the full request path (controller → service → EF Core → in-memory DB), catching any wiring issues between layers, while still running fully in-process without external dependencies.

### Isolated Database per Test

Each test creates a `DbContext` with `Guid.NewGuid().ToString()` as the database name. This guarantees complete isolation without needing `[TearDown]` cleanup of data, at the cost of a small allocation per test. The `[TearDown]` only disposes the `DbContext` instance to release the connection.

---

## nuget.config

A `nuget.config` file is scoped to the test project directory. It clears all package sources and registers only `nuget.org`. This prevents restore failures caused by the internal GitLab NuGet feed (`gitlab.dev.bbzgmbh.local`), which is unreachable from outside the corporate network.

```xml
<configuration>
  <packageSources>
    <clear />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
  </packageSources>
</configuration>
```

> [!NOTE]
> All packages used by this project (`NUnit`, `Moq`, `Microsoft.EntityFrameworkCore.InMemory`) are available on `nuget.org`. No packages from the internal feed are required.

---

## CI / GitHub Actions

Unit tests run automatically on every pull request targeting `master` via the dedicated `.github/workflows/test-dotnet.yml` workflow. The workflow triggers after a successful Build .NET CI run and executes:

```powershell
dotnet test tests/DSB.StreamBackend.Tests/DSB.StreamBackend.Tests.csproj
```

No browser binaries, running services, or environment variables are required — the job completes with a plain `dotnet test` call.
