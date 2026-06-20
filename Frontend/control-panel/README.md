# Control Panel

The `Frontend/control-panel` package is the Angular control UI for the DSB Streaming Tool.
It provides the dashboard used to control broadcast state, and the overlay pages that are shown as OBS browser sources.

## What this package contains

- `src/app/pages/dashboard/` — main control panel UI
- `src/app/overlays/` — overlay views for OBS browser sources
- `src/app/services/` — state sync, backend API, and SignalR integration
- `src/app/models/` — broadcast state and display models
- `public/` — static assets such as map images

## Quickstart

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- .NET 9 SDK installed and the backend running locally at `http://localhost:7000`

> [!NOTE]
> The backend must be running for overlay state, SignalR updates, and API requests to work.

### Install dependencies

From `Frontend/control-panel`:

```bash
npm install
```

### Start development server

```bash
npm start
```

Open `http://localhost:4200/` in your browser.

## Available npm scripts

- `npm start` — start the Angular development server
- `npm run build` — build the app for production
- `npm run watch` — build in watch mode using the development configuration
- `npm test` — run unit tests
- `npm run code-quality` — run ESLint on `src/`
- `npm run serve:ssr:control-panel` — serve the SSR build from `dist/control-panel`

## Backend integration

This frontend currently connects to the backend using hard-coded URLs:

- API: `http://localhost:7000/api/broadcast`
- SignalR hub: `http://localhost:7000/overlayHub`

If the backend host or port changes, update these values in:

- `src/app/services/broadcast-api.ts`
- `src/app/services/signalr.ts`

## Overlay routes

The app exposes these routes:

- `/` — Control Panel dashboard
- `/overlay/score-box` — Score box overlay
- `/overlay/map-screen` — Map screen overlay
- `/overlay/commentator-box` — Commentator box overlay
- `/overlay/info-box` — Info box overlay

Use the overlay routes as OBS browser source URLs when the app is running.

## Development notes

- The app uses Angular 22 and SSR support via `@angular/ssr`.
- `BroadcastStateService` loads initial broadcast state from the backend and syncs live updates through SignalR.
- Overlay components react to the shared broadcast state and render scenes suitable for browser sources.

## Testing & quality

Run unit tests:

```bash
npm test
```

Run lint checks:

```bash
npm run code-quality
```

## Contributing

When changing this package:

1. Work in a feature branch.
2. Keep code and comments consistent with Angular best practices.
3. Add or update tests for new features.
4. Confirm `npm test` and `npm run code-quality` pass.

## Notes

This README documents only the `control-panel` frontend package. Use the repository root README for workspace-wide setup, overall architecture, and release information.
