# Overlay Enhancement/New Overlay Pull Request

## Overlay

- [ ] Score-Box (enhancement)
- [ ] Map-Screen (enhancement)
- [ ] Commentator-Box (enhancement)
- [ ] Info-Box (enhancement)
- [ ] New Overlay (specify name): \_\_\_

## Description

What is being changed or added to the overlay?

## Related Issue

Fixes or relates to #\_\_\_ (link to overlay issue or feature request)

## Changes

### Overlay Changes

- Change 1
- Change 2
- Change 3

### Frontend Changes (Angular)

- Component path: `Frontend/control-panel/src/app/...`
- Changes made: ...

### Backend Changes (if applicable)

- New data models or fields
- New SignalR messages
- New endpoints
- Database schema changes

### Database Schema Changes

If new fields or tables are needed, describe:

- New tables: ...
- New fields: ...
- Migration file: `Backend/.../Migrations/...`

## Functionality

### Display

How is the data displayed in the overlay?

- Layout/positioning
- Styling/colors
- Animation/transitions

### Data Flow

Where does the overlay data come from?

1. Control Panel → Backend
2. Backend → SignalR
3. SignalR → Overlay (Browser)

### Control Panel Integration

What controls in the Control Panel drive this overlay?

- New inputs: ...
- Modified inputs: ...

## Testing

### Test Scenarios

1. Initial load and data display
2. Real-time updates via SignalR
3. Different data states/edge cases
4. Browser compatibility (Chrome, Firefox, etc.)

### How to Test

1. Start backend and frontend
2. Navigate to `/overlay/[name]` in OBS or browser
3. Test Control Panel inputs
4. Verify overlay updates in real-time

### Screenshots or Screen Recording

Show the overlay in action:

## Files Changed

### Frontend

- `Frontend/control-panel/src/app/overlays/[name]/[name].component.ts`
- `Frontend/control-panel/src/app/overlays/[name]/[name].component.html`
- `Frontend/control-panel/src/app/overlays/[name]/[name].component.scss`

### Backend

- `Backend/DSB.StreamBackend/Models/...Entity.cs`
- `Backend/DSB.StreamBackend/Dtos/...Dto.cs`
- `Backend/DSB.StreamBackend/Migrations/...cs`
- `Backend/DSB.StreamBackend/Hubs/OverlayHub.cs`

## Styling

- New CSS/SCSS files: ...
- Modified styles: ...
- Does it use DSB branding/colors? ...

## Compatibility

- [ ] Works with OBS browser source
- [ ] Responsive design (tested at common stream resolutions)
- [ ] Works across browsers (Chrome, Firefox, Safari)
- [ ] Works with existing overlays (no conflicts)

## Documentation

- [ ] README updated with new overlay route
- [ ] Documentation added for new overlay
- [ ] OBS setup guide added (if specific configuration needed)
- [ ] Control Panel usage documented

## Checklist

- [ ] All overlay functionality working
- [ ] SignalR updates tested
- [ ] No conflicts with other overlays
- [ ] Styling matches DSB design
- [ ] Performance is acceptable
- [ ] Tests pass
