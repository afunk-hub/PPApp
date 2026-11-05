# Prairie Preludes Creator Studio 2.1.00

## Series Manager
- Added a dedicated Series Manager workspace.
- Create and edit series with a custom name, color, start date, recurrence rate, optional end date, and creative notes.
- Supported recurrence rates: daily, weekly, every two weeks, and monthly.
- Pause, resume, or archive a series. Archiving preserves the series record and all associated video assignments; no destructive series deletion is offered.
- Historical release dates are materialized and retained when the recurrence schedule is edited, paused, or archived.
- Release dates are targets, not automatically created video projects or hard publishing constraints. A missed release does not shift future recurrence dates.

## Publishing calendar and Content Planner
- Added a Series dropdown to planned videos, including an explicit **No series** option.
- Series release dates receive a background tint in the series' selected color.
- Planned videos assigned to a series receive a matching colored dot.
- Videos assigned to **No series** always use the same neutral grey dot. No-series dates never receive a series background fill.
- Multiple videos may still be planned on the same date.
- Missed release dates retain their series color and receive an additional overdue warning indicator.
- Calendar day details and the project list identify the assigned series.

## Command Center
- Added a Series Releases dashboard with active-series count, upcoming release coverage, planned videos, and overdue release indicators.
- Unplanned releases approaching within seven days are identified as needing planning; missed releases remain overdue without moving later dates.
- Added **Upcoming Video Readiness · Next 7 Days**.
- The readiness table lists each planned video in the rolling seven-day window and shows only whether its associated audio/music record and video/footage record are assigned or missing. It does not display filenames.
- Summary counts show planned videos, fully ready videos, and videos needing attention.

## Data and compatibility
- Added `series` data to the existing local database and JSON backup/restore flow.
- Existing plans are normalized with an empty series assignment, preserving their standalone status.
- Merge restore includes series records; replace restore includes the complete series collection.
- Existing upload, music, footage, evidence, analytics, and project records retain their IDs and existing data fields.
- Updated the service-worker cache namespace to 2.1.00 so installed copies can retrieve the new release.

## Deployment
- `index.html` remains the sole required application HTML file.
- Replace `index.html` and `sw.js` in the GitHub Pages site root. Keep existing site assets (manifest and icons) in place.
- Export a fresh JSON backup before updating an installed copy. After installation, verify existing records and create a new backup that includes series data.
