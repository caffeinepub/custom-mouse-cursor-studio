# Custom Mouse Cursor Studio

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Photo upload feature to use as custom cursor
- Cursor customization panel (size, opacity, rotation, shape crop)
- Live preview canvas/playground area
- Touch/finger support (pointer events) so it works on mobile too
- Pre-built cursor effects (trail, glow, bounce)
- Gallery of uploaded cursor photos

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store uploaded cursor images as blobs
2. Frontend: upload photo, customize cursor options, apply as real CSS cursor or canvas overlay
3. Playground area: a large interactive canvas where user can move cursor/finger to see the effect
4. Customization panel: sliders for size/opacity, toggle effects (trail, glow)
5. Pointer events for both mouse and touch support
