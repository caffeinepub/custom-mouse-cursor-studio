# Earbuds Popup Studio

## Current State
Bluetooth connection is handled by `BluetoothBatteryButton.tsx` and `useBluetoothBattery.ts`. The hook connects via Web Bluetooth API, reads battery level, and subscribes to notifications. The UI shows a connect button, a connected state with live battery bars, and error messages.

## Requested Changes (Diff)

### Add
- Step-by-step visual guide shown before/during connection (expandable helper text with numbered steps: turn on Bluetooth, pair earbuds first, click Connect, select device)
- Better error messages with actionable retry tips specific to error type (permission denied, not found, unsupported)
- Auto-reconnect: remember last connected device name in localStorage, show a "Reconnect to [device]" option when supported
- Connection status indicator with animated pulse when connected
- "How to connect" collapsible help section with tips for Android/Chrome users
- Retry button directly in error state

### Modify
- `BluetoothBatteryButton.tsx`: Enhance UI with help section, better error UI with retry, reconnect hint
- `useBluetoothBattery.ts`: Store last device name in localStorage; add reconnect logic

### Remove
- Nothing removed

## Implementation Plan
1. Update `useBluetoothBattery.ts` to save last device name to localStorage and expose a `lastDeviceName` state.
2. Update `BluetoothBatteryButton.tsx`:
   - Add collapsible "How to connect" help panel with step-by-step guide
   - Show "Last connected: [name] — Reconnect?" hint when disconnected and lastDeviceName exists
   - Better error display: specific tips per error type + Retry button
   - Animated connection status
