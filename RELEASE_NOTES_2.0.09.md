# Prairie Preludes Creator Studio 2.0.09

## Monthly publishing calendar
- Added a dedicated Publishing Calendar navigation tab with a traditional Sunday–Saturday month view.
- Planned dates display visible indicators and the number of planned videos.
- Selecting any date shows all projects planned for that day, including dates with no planned videos.
- Multiple videos per day remain fully supported; the calendar does not enforce or impose a daily limit.
- Added previous/next month navigation and a Today shortcut.
- Added a compact date-indicator calendar to Projects & Planner.
- Added a compact publishing schedule summary to Command Center with days covered, open dates, and planned-video totals.
- Coverage counts calendar dates containing at least one project with a planned publish date. An open date is simply a date without a planned project; it is not treated as a missed deadline.
- Existing project records, IDs, and local data structures are preserved.

## Deployment
Replace the existing `index.html` and `sw.js` in the GitHub Pages site root. Keep other app files and all locally stored app data unchanged. The release package uses `index.html` as the sole application HTML file; do not deploy a versioned duplicate HTML file. Export and verify a fresh JSON backup before updating an installed copy.
