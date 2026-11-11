# Prairie Preludes Creator Studio 2.3.02

## Changes in this build
- Added a Command Center **Snapshots Due Today** tracker for unrecorded 24-hour, 7-day, 30-day, and 90-day checkpoints.
- Snapshot checkpoints are calculated from the publication calendar date; publication time is ignored.
- Due checkpoints remain listed until a snapshot is recorded, including overdue checkpoints.
- Added **Add Snapshot** actions that open Snapshot Metrics with the upload and checkpoint preselected.
- Centralized current-date determination on the `America/Denver` time zone, including daylight-saving transitions.

## Data and deployment
- Existing local data structure and JSON backup/import compatibility are preserved.
- Deploy using `index.html` as the application entry point.
- The app UI continues to display version 2.3.02. The ZIP suffix is for personal build tracking only.

## Follow-up correction (personal build -3)
- Fixed the Command Center rendering connection so the Snapshots Due Today list is actually refreshed and displayed when the dashboard renders.
- Overdue, unrecorded checkpoints remain visible and are now highlighted with red text and an explicit OVERDUE label.
- Snapshot tracking remains independent for each upload/platform record and checkpoint; recording one platform's snapshot does not clear another platform's checkpoint.

## Follow-up correction (personal build -4)
- Reordered the Snapshots Due Today dashboard columns to: Add Snapshot, Video title, Platform, Checkpoint, Published date.
- Removed the due-date column; overdue checkpoints remain highlighted in red and marked OVERDUE.
- Constrained the snapshot table to the dashboard width, with horizontal scrolling on narrower screens.

## Follow-up correction (personal build -5)
- Replaced the snapshot entry's Watch time (minutes) input with Average watch time (seconds).
- New snapshots store average watch time in a dedicated `avgWatchSeconds` field.
- Existing historical `watch` values are preserved and displayed as legacy watch minutes; they are not silently converted because they represent a different metric.
- Snapshot tables, upload-time analytics, comparison metrics, insights, and CSV exports distinguish the new seconds-based average from legacy watch-minute data.

## Follow-up correction (personal build -6)
- Added an Edit action to each saved snapshot record.
- Editing updates the existing snapshot in place, preserving its upload/platform association, checkpoint, and record ID; it does not create a duplicate or clear another platform's checkpoint.
- The snapshot date and metric values can be corrected. Upload/platform and checkpoint selectors are locked while editing to protect the original association.
- Legacy watch-minute values remain intact when editing older snapshots that do not have an average-watch-seconds value.

## Follow-up correction (personal build -7)
- Analytics Overview now reports **Views to Date** using the most recently recorded snapshot for each individual upload/platform entry, regardless of checkpoint type.
- Overall views, views by platform, and views by genre all use the same latest-snapshot-per-upload calculation.
- Performance Insights now ranks and calculates its metrics from each upload/platform entry's most recently recorded snapshot, rather than requiring a lifetime checkpoint.
- Adding or editing a snapshot automatically changes the latest-snapshot contribution on the next dashboard render; snapshots are not summed across checkpoints for the same upload.
