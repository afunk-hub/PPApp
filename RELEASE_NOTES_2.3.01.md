# Prairie Preludes Creator Studio 2.3.01

## Navigation and Backup Workflow Refinements

This revision reorganizes navigation and backup controls while preserving the validated 2.3.00-6 application baseline, existing local records, and established data structures.

### Navigation
- Moved Command Center out of Workspace and placed it as a standalone navigation button above the three section menus.
- Consolidated the remaining Workspace destinations into one mobile-friendly dropdown.
- Consolidated Performance destinations into one mobile-friendly dropdown.
- Consolidated Rights & Records destinations into one mobile-friendly dropdown.
- Renamed Photo Studio to **Photo Catalog** and moved it into Rights & Records. The underlying `photostudio` panel ID and saved photo records are unchanged.
- Renamed Creative Library to **Video Catalog** and moved it into Rights & Records. The underlying `library` panel ID and saved video/asset records are unchanged.

### Backup & Settings
- Moved Export JSON backup, Export metrics CSV, and Import backup JSON controls to the space between Release Status and Release History.
- Kept Clear all local data in the Local data and backup card.
- Preserved existing export/import handlers, backup structure, merge/replace preview behavior, and local-storage keys.

### Preservation
- No application data migration or reset is performed.
- Existing tab IDs, record IDs, storage keys, and backup compatibility are preserved.
- Updated release metadata, export filenames, and service-worker cache version to 2.3.01.

### Validation
- Static HTML structure, unique IDs, navigation target coverage, JavaScript syntax, manifest JSON, and ZIP integrity are checked for this package.
- Full interactive Android/PWA acceptance testing remains recommended after installation.

### Build 2.3.01-2 — Navigation row alignment
- Placed Command Center on its own full-width navigation row.
- Aligned Workspace, Performance, and Rights & Records dropdowns together on the row immediately below.
- Adjusted dropdown sizing and labels for narrow mobile screens; destinations and behavior are unchanged.
