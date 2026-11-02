# Prairie Preludes Creator Studio — Release 2.0.03

**Release date:** November 2, 2026  
**Baseline:** User-supplied complete `PrairiePreludes2.0.01` patch ZIP.  
**Release approach:** Additive changes only; preserve the full 2.0.01 application workflow and existing storage identifiers.

## Preserved from 2.0.01
- Creator Command Center and its active-project, upcoming-deadline, unused-footage, publishing, pipeline, and project-attention summaries.
- Content Projects workflow, including editing existing projects, shot lists, captions, hashtags, editing/delivery notes, linked records, and status tracking.
- Existing navigation, creative library, footage usage, analytics, uploads, snapshots, original music, copyright/evidence tracking, copying log, quarterly reviews, and Backup & Settings.
- Primary database key `prairie-preludes-creator-studio-v2`.
- Secondary recovery key `prairie-preludes-creator-studio-v2-safety-copy` and its existing recovery behavior.
- Full JSON backup/restore and merge/replace behavior, with existing data categories and IDs retained.

## Changes in 2.0.03
- Includes all 2.0.02 application changes, including Recording Speed.
- Refined service-worker cache isolation and update activation.
- Service-worker cache cleanup is limited to Prairie Preludes cache namespaces; unrelated site caches are left untouched.
- Page navigations use network-first behavior with `cache: no-store`; the current release cache and `index.html` provide offline fallback.
- Service-worker registration bypasses the HTTP cache for update checks and reloads once when a new controller takes control.
- GitHub Pages requires only `index.html`; the versioned HTML file remains in the release archive only.

## File layout and deployment

- `GitHub-Pages/` contains the complete deployment payload. Upload **the contents of this folder** into the existing GitHub Pages `PPApp/` directory.
- `GitHub-Pages/` intentionally contains `index.html` only; it does not contain `PrairiePreludes2.0.03.html`.
- `Release-Archive/PrairiePreludes2.0.03.html` is the versioned archival copy. Do not upload it to GitHub Pages.
- The service worker uses a release-specific cache, network-first page navigations and cache-first asset requests, explicit update checks, and an offline fallback to `index.html`. It deletes only Prairie Preludes caches.

## Data compatibility and safety
- No database key changes.
- The 2.0.01 safety-copy key is retained; no migration away from it is performed.
- Existing data arrays and record IDs are preserved. New `recordingSpeed` is backfilled to `1` for older footage records.
- JSON export/restore includes the complete database object. Media files themselves are not embedded in JSON backups.
- Do not clear Chrome site data or uninstall the installed app to deploy this update. Keep the external JSON backup.

## Verification
- Application inline JavaScript syntax checked.
- Service-worker JavaScript syntax checked.
- `index.html` and the versioned archive HTML are byte-for-byte identical.
- Service-worker pre-cache list contains only files present in `GitHub-Pages/`.
- ZIP integrity checked.
