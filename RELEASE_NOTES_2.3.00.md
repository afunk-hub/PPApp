# Prairie Preludes Creator Studio 2.3.00

## Field Production & Weekly Recap Management

This release candidate adds field session planning, photography organization, dedicated weekly recap production, and improved Command Center readiness navigation while preserving existing projects and asset IDs.

### Updates in this revision
- **Command Center readiness:** Video and photo readiness columns now use consistent fixed grid alignment within each section. Project titles, status labels, and Open Project buttons are more compact, with narrower columns to reduce horizontal space.
- **Weekly recap runtime estimate:** Video projects now have an optional finished-video-runtime field (`MM:SS` or `HH:MM:SS`). The Weekly Recaps form calculates an estimated total from selected projects and displays it between the project picker and playback sequence. Target and actual runtime inputs remain at the top. The estimate identifies missing project runtimes and excludes transitions and any intro/outro.
- **Field session golden hour:** Sunrise and sunset remain manually entered. Separate AM and PM golden-hour windows calculate automatically as sunrise through one hour after sunrise, and one hour before sunset through sunset.

### Field Session Planner
- Session name, date/time, location, sunrise/sunset, golden-hour windows, weather/conditions, lighting observations, subjects/scenes, equipment, shot list, capture status, and field notes.
- Link field sessions to existing video projects and photos without duplicating creative records.
- Upcoming field sessions appear on the Command Center and calendar.

### Photo Studio
- Photo intended-use categories and optional field-session links.

### Weekly Recaps
- Dedicated `This Week on the Plains` recap records, separate from regular video projects.
- Subtitle title catalog with Available, Reserved, and Used states.
- Select and order existing short-form video projects; project footage and audio are referenced, not duplicated.
- Track transitions between adjacent projects without changing original project audio fades.
- Recaps appear in the Command Center and calendar.

### Preservation and compatibility
- Existing local-storage key and existing record IDs are preserved.
- New collections initialize safely for older backups; existing project records gain an optional runtime field without requiring migration.
- Exported backup data is not included in the application package.

### Validation status
- JavaScript syntax, static HTML structure, ID uniqueness, backup-normalizer compatibility, manifest parsing, and ZIP integrity checks are performed for this candidate.
- Full interactive Android/PWA validation remains part of user acceptance testing.
