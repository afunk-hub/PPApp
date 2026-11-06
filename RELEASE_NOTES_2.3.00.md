# Prairie Preludes Creator Studio 2.3.00

## Field Production, Weekly Recaps & YouTube Long Format Analytics

This release candidate adds field session planning, photography organization, dedicated weekly recap production, improved Command Center readiness navigation, calendar refinements, and separate-but-combined YouTube Long Format analytics while preserving existing projects and asset IDs.

### YouTube Long Format analytics in this revision
- YouTube Long Format uploads now have a content category: **Standalone long-form video** or **Weekly recap**.
- Weekly recap upload records can link directly to the corresponding `This Week on the Plains` recap record. The Weekly Recaps catalog includes an action to prepare a linked YouTube upload record; the user confirms and saves it in Video uploads after publishing.
- Each linked recap is represented by one YouTube Long Format upload record. Its 7-, 30-, 90-day, and lifetime snapshots are saved against that upload ID, independently of the Shorts included in the recap. The original Shorts retain their own upload records and analytics; they are not duplicated or counted as recap uploads.
- The Analytics overview now has a YouTube Long Format breakdown with filters for **All YouTube Long Format**, **Standalone long-form only**, and **Weekly recaps only**, plus 7-, 30-, 90-day, and lifetime snapshot windows.
- The combined view includes both standalone videos and weekly recaps. The category filters separate them without excluding recaps from overall YouTube Long Format totals.
- The breakdown reports upload count, views, engagement actions, watch time, subscribers gained, snapshot coverage, and per-upload metrics. It uses the latest saved snapshot for each upload within the selected checkpoint.
- YouTube Long Format upload time is optional; upload-time windows remain required for short-form platform entries.
- Existing YouTube Long Format upload records without a category are treated as standalone long-form for the category breakdown. Existing snapshot IDs and video/upload IDs are preserved.

### Calendar stage and series indicators in this revision
- Video circles, photo squares, and weekly recap diamonds now use a vertically split symbol across both the Publishing Calendar and compact Projects & Planner calendar.
- The left half represents the series color (or the neutral default for projects without a series); the right half represents production stage.
- Stage colors: Planned / idea retains gold (`#B79B67`); In production uses prairie orange (`#C9783B`); Ready to publish uses the former In production blue (`#8799B4`); Published uses the former Ready to publish green (`#4F906D`).
- Weekly recap diamonds use the existing smoky violet (`#57475F`) as their left-side series color and their own status for the right-side stage color. Recap status `Assembling` maps to In production.
- The Publishing Calendar legend now explains the split-color convention and all four stages.

### Calendar refinements
- Series release dates use only their selected series fill color in both calendars; series names are shown in the selected-date details below each calendar with an **Open series** action.
- The project-planner calendar keeps date numbers aligned at the top of each day cell and includes the same selected-date details area as the publishing calendar.
- Video circles, photo squares, and weekly recap diamonds use consistent 8 px indicators and align together. Photo indicators use soft greige (`#AAA9A0`); weekly recap indicators use smoky violet (`#57475F`).

### Other updates in this revision
- **Command Center readiness:** Video and photo readiness columns use consistent fixed grid alignment within each section. Project titles, status labels, and Open Project buttons are more compact, with narrower columns.
- **Weekly recap runtime estimate:** Video projects have an optional finished-video-runtime field (`MM:SS` or `HH:MM:SS`). The Weekly Recaps form calculates an estimated total from selected projects and displays it between the project picker and playback sequence. Target and actual runtime inputs remain at the top. The estimate identifies missing project runtimes and excludes transitions and any intro/outro.
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
- Weekly recap upload links and content categories are included in normal backup exports and imports.
- Exported backup data is not included in the application package.

### Validation status
- JavaScript syntax, static HTML structure, ID uniqueness, YouTube analytics calculation/filter checks, backup-normalizer compatibility, manifest parsing, and ZIP integrity are performed for this candidate.
- Full interactive Android/PWA validation remains part of user acceptance testing.

## Update 2 — Calendar consistency and cleaner day blocks
- Matched Project Planner calendar day-block sizing, padding, and layout to the Publishing Calendar.
- Matched project, photo, and weekly recap indicator sizing and spacing across both calendars.
- Removed item-count labels from both calendar day blocks; the content-type indicators remain as the visual cues.

### Update 3 — Video plan form layout
- Aligned Genre / scene horizontally with Finished video runtime.
- Moved Target platforms into its own full-width row immediately below runtime/genre and before Format.
- Kept platform selections and saved project fields unchanged; this is a layout-only update.


### Calendar marker correction (2.3.00-5)
- Corrected the weekly recap calendar marker so its diamond clip-path is not rotated a second time into a square. The split series/stage coloring is preserved in both calendar views.
