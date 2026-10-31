# Prairie Preludes Creator Studio 2.0.01

## Navigation and backup resilience fixes
- Workspace, Performance, and Rights & Records navigation rows now constrain their width and support horizontal touch scrolling instead of pushing the page past its margins.

## Backup resilience fix
- Maintains a second on-device safety copy of the Creator Studio catalog after successful saves.
- If the primary catalog entry is missing or unreadable, attempts to recover from the safety copy at startup.
- Backup & Settings now reports current footage, project, upload, and music record counts.
- Clarifies that the on-device safety copy is not a substitute for a downloaded JSON backup.
- Updates the service-worker cache name and cached app filename for 2.0.01.

## Important limitation
The app remains local-first. A site-data clear, browser/app storage removal, or device loss can remove both on-device copies. Use **Export JSON backup** after important changes and keep the downloaded file outside the app.

No catalog schema changes are intended.
