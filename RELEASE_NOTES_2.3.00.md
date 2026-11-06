# Prairie Preludes Creator Studio 2.3.00

**Release:** Field Production & Weekly Recap Management  
**Baseline:** Validated 2.2.03 application package  
**Release state:** Candidate for user validation

## What's new

### Field Filming & Photography Management
- Added a dedicated Field Session Planner for session name, date/time, location, sunrise, sunset, golden-hour window, weather/conditions, lighting observations, subjects/scenes, equipment, shot list, capture status, and field notes.
- Added Field Session calendar markers and Command Center upcoming-session visibility.
- Added optional Field Session links to existing video projects and photo records.
- Added photography intended-use metadata while retaining the existing photo catalog, project usage history, and copyright records.
- Field Session records show associated video projects and photographs; deleting a session clears its links without deleting the creative records.

### Weekly Recap Management
- Added a separate Weekly Recap content entity for **This Week on the Plains**; standalone long-form projects remain in the existing Content Projects workflow, including the existing YouTube Long Format target.
- Added a subtitle title bank with Available, Reserved, and Used states.
- Added week covered, planned publication date, status, target/actual runtime, YouTube URL, and collection mood/theme.
- Added a searchable picker for existing short-form projects, ordered playback sequencing, and per-transition settings (Straight cut, Cross-dissolve, Fade to black).
- Recaps store references to existing projects; they do not duplicate footage, audio, or project records. The original short-video music pairings and natural audio fades remain untouched.
- Added the ◆ calendar marker, daily calendar details, Command Center upcoming-recap list, and a dedicated recap catalog.

### Command Center readiness improvements
- Replaced compressed readiness tables with horizontally scrollable rows designed for mobile screens.
- Added an **Open Project** button immediately after the Caption status in video and photo readiness rows.
- Buttons open the existing project record directly. Readiness calculations and status logic remain unchanged.

## Data compatibility and preservation

- Built from the supplied complete 2.2.03 application package.
- Retains the existing local data key and existing record identifiers.
- New collections (`fieldSessions`, `weeklyRecaps`, and `recapTitles`) default to empty arrays for existing installations and are included in JSON export/import and merge operations.
- The supplied 2.2.03 JSON backup was checked against the updated import normalizer: 25 plans, 24 footage assets, 7 photos, and 8 music records are recognized; new collections initialize safely as empty.
- The supplied backup is intentionally **not embedded in the application source or release ZIP**. This avoids exposing personal creator data if the app source is uploaded to a public GitHub repository. Existing browser data remains in place when the app files are updated; on a fresh installation, restore the backup through **Backup & Settings → Import backup JSON → REPLACE**.

## Package and PWA updates

- Updated the service-worker cache namespace to 2.3.00.
- Included the PWA manifest and 192px / 512px app icons alongside the existing logo.
- Release ZIP contains only the 2.3.00 release notes; historical release-note files are not bundled.

## Validation performed

- JavaScript syntax checks passed for both inline scripts.
- HTML structural checks found no duplicate element IDs and confirmed all 19 navigation tabs have matching panels.
- Backup normalization check passed for the supplied 2.2.03 JSON export.
- Full interactive Android/PWA regression testing remains part of user validation before declaring 2.3.00 live.
