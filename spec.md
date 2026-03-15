# Earbuds Popup Studio

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- AirPods-style earbuds popup UI (like iPhone connection popup)
- Popup shows left earbud, right earbud, and case battery percentages
- Customize popup: background color, accent color, font style, earbuds image/icon, device name
- Add and manage multiple earbuds models/entries in a gallery
- Preview popup in real-time as user customizes
- Save customized popups to a collection

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Store earbuds models with name, battery levels (L/R/case), image URL, and customization settings (colors, font)
2. Frontend:
   - Main page: gallery of saved earbuds models
   - Popup preview component (AirPods-style card with animated appearance)
   - Customization panel: device name, battery %, color pickers, font selector, image upload
   - Add new model form
   - Real-time preview as user edits settings
   - Trigger popup demo button
