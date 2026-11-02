# Prairie Preludes Creator Studio — Release 2.0.02

**Release date:** November 2, 2026  
**Release type:** Revision release — recording speed tracking and corrected deployment package

## Features and additions
- Added a **Recording Speed** field to footage asset records with four choices: **1/4×, 1/2×, 1×, and Time-lapse**.
- New footage records default to **1×**.
- Recording Speed is editable and displayed in the footage catalog.
- Older footage records without a speed value resolve to **1×** and remain compatible with existing records.
- Recording Speed is retained by the full JSON backup/restore flow.

## Carried-forward 2.0.01 safeguards
- Added a secondary rolling recovery copy of the complete database in browser storage, separate from the primary database key.
- If the primary database is missing or unreadable, the app attempts to recover from the secondary on-device copy.
- Added visible counts for footage records, content plans/projects, video uploads, and original music records in Backup & Settings.
- Retained horizontally scrollable navigation for narrow/mobile screens.
- The secondary copy is on the same device/browser; it is not a substitute for an exported JSON backup stored elsewhere.

## Package correction
- Added `index.html` as the GitHub Pages/PWA entry point.
- `index.html` is an identical copy of `PrairiePreludes2.0.02.html`.
- Updated the web app manifest to launch from the package root.
- Updated the service worker cache list and offline fallback to include `index.html` while retaining the versioned HTML archive.

## Data compatibility and preservation
- Existing data categories remain: uploads, snapshots, music, evidence, copying cases, quarterly reviews, content plans, and footage assets.
- Existing footage records without a `recordingSpeed` value remain compatible and resolve to **1×**.
- JSON export/restore continues to include the complete application database object. CSV metrics export remains a separate export.
- Video, audio, photo, and editing-project media files are not embedded in the JSON backup or this ZIP; the catalog stores references and notes.

## Verification
- `index.html` and `PrairiePreludes2.0.02.html` are byte-for-byte identical.
- Application JavaScript syntax checked.
- ZIP archive integrity checked.
- Required PWA files included: `manifest.webmanifest`, `sw.js`, `icon-192.png`, and `icon-512.png`.

## GitHub Pages deployment
1. Extract the ZIP.
2. Upload the contents of the extracted folder to the same folder in the GitHub Pages repository that currently contains the app. For a repository hosted at `/PPApp/`, place all files together inside `PPApp/`.
3. Replace the old `index.html`, `PrairiePreludes2.0.02.html`, `manifest.webmanifest`, and `sw.js`; upload both icons if prompted.
4. Commit the changes and wait for the Pages deployment to complete.
5. Open the site in Chrome and verify that the app displays **2.0.02**.
6. If an installed copy still shows the old version, close it and reopen the website; if needed, refresh the site and allow the updated service worker to activate.

Keep your exported JSON backup stored outside the app before installing updates.
