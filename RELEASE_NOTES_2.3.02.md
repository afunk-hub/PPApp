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
