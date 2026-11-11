# Release Notes — 2.3.05-01

Patch to the unvalidated 2.3.05 release. The app continues to display version **2.3.05**.

## Changes
- Wrapped Selected Video Snapshot History in a dedicated horizontally scrollable region.
- Set a minimum table width so all snapshot metric columns remain readable on narrow screens.
- Constrained the scroll region to the available card width; horizontal scrolling stays within the history section rather than expanding the app viewport.
- Added mobile momentum scrolling and an accessible region label.

## Compatibility
- No database schema or stored data changes.
- Existing JSON backup and restore compatibility is preserved.
