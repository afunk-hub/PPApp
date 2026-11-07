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

### Build 2.3.01-3 — Dropdown panel alignment
- Corrected Performance and Rights & Records dropdown panels so they open within the same full-width navigation area as Workspace.
- All three dropdown panels now use the navigation container's full available width and wrap their destination buttons within the app boundaries on mobile and desktop.
- Updated the service-worker cache identifier to ensure installed clients receive the corrected layout.
- No destination, data, storage, or import/export behavior changed.


### Build 2.3.01-4 — Compact Command Center overview
- Consolidated Active projects, Upcoming deadlines, Unused footage, and Published uploads into one “Studio at a glance” card.
- Displays the four live metrics in a single horizontal row on wider screens and a compact 2×2 grid on mobile, reducing vertical scrolling without removing any metric.
- Preserved the existing metric element IDs and their data calculations; no storage, record, or workflow changes.
- Updated the service-worker cache identifier for this build.


### Build 2.3.01-5 — Auto-close navigation dropdowns
- Selecting any destination from Workspace, Performance, or Rights & Records now closes the open dropdown after navigating to the selected section.
- The Command Center button also leaves all section dropdowns closed.
- Preserved all navigation destinations, panel activation, data records, and existing workflows.
- Updated the service-worker cache identifier so installed clients receive this behavior update.


### Build 2.3.01-6 — Automatic Music Catalog internal IDs
- New Music Catalog records now receive a unique, automatically generated `MUS-XXXXXXXX` internal ID when saved.
- The generated internal ID is displayed read-only in the form and catalog; manual entry is no longer required.
- The previous `Internal ID / registration no.` field is retained as an optional **Registration number** field so existing user-entered values are not lost or overwritten.
- Existing music records receive an internal ID on first launch; their prior registration values and all other fields remain unchanged.
- Imported music records without an internal ID receive one automatically. Existing internal IDs are retained, and collisions introduced by merging are resolved without changing existing local IDs.
- Photo Catalog and Video Catalog ID behavior is unchanged. Backup structure remains backward compatible, with the new `internalId` property included in JSON backups.
- Updated the service-worker cache identifier to deliver this build to installed PWA clients.
