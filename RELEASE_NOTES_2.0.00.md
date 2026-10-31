# Prairie Preludes Creator Studio 2.0.00

## Major release: Connected Creator Workflow

- Redesigned navigation into Workspace, Performance, and Rights & Records groups.
- Added the Creator Command Center with project pipeline counts, upcoming deadlines, unused-footage estimate, and project attention checks.
- Integrated the existing Content Planner into the Content Projects workflow without replacing existing plan records or IDs.
- Added edit-in-place for existing and new projects.
- Added dedicated shot-list / filming checklist and editing / delivery notes fields.
- Kept existing footage, upload, music, copyright, analytics, and backup features.
- Updated the versioned HTML entry, `index.html`, manifest description, and service-worker asset/cache version for this release.

## Data compatibility

The app continues using the existing local storage key `prairie-preludes-creator-studio-v2`. Existing plans are not rewritten on startup; new project fields are optional and backward-compatible. Export a JSON backup before deployment as a standard precaution.

## Known scope limits

- The Command Center summarizes data already recorded in this browser; it does not sync data between devices.
- Upload creation is still tracking-only; it does not publish to social platforms.
- Unused-footage calculations use known asset links from uploads and projects, so review links for accuracy.
