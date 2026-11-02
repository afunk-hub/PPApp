# Prairie Preludes Creator Studio — Release 2.0.03

**Release date:** November 2, 2026  
**Release type:** Revision release — service-worker cache and update correction

## Changes
- Corrected the service worker so it searches only the current release's cache instead of all browser caches.
- Explicitly retires older Prairie Preludes cache namespaces, including the legacy `prairie-preludes-1.0.07` cache and previous `prairie-preludes-creator-studio-*` caches.
- Uses network-first handling for page navigations, with the current release cache as an offline fallback.
- Requests service-worker script updates without relying on the browser HTTP cache and calls `registration.update()` when the page loads.
- Reloads the page after a new service worker takes control so the updated app shell is displayed.
- Retains the 2.0.02 Recording Speed feature and the 2.0.01 secondary recovery-copy and data-visibility safeguards.

## Data compatibility and preservation
- No database schema changes are made in this release.
- All existing data categories, local-storage keys, JSON export/import behavior, and recovery-copy behavior are retained from 2.0.02.
- The service worker clears only caches with Prairie Preludes-specific names; it does not clear localStorage or IndexedDB application records.
- Keep the external JSON backup. The service-worker cache is not a data backup.

## Verification
- Added the missing `PrairiePreludes2.0.03.html` release-named copy; it is byte-for-byte identical to `index.html` and satisfies the service worker's pre-cache list.
- JavaScript syntax checked.
- Service-worker syntax checked.
- ZIP integrity checked.
- Required PWA files included: manifest, service worker, and both icons.

## Deployment
1. Extract this ZIP.
2. Upload the CONTENTS of the `PPApp-main` folder into the **same existing `PPApp` folder** in the GitHub Pages repository. Do not create a nested `PPApp-main` folder.
3. Replace the existing files when prompted, including `index.html`, `PrairiePreludes2.0.03.html`, `manifest.webmanifest`, and `sw.js`.
4. Commit and wait for GitHub Pages deployment.
5. Test both `https://afunk-hub.github.io/PPApp/` and `https://afunk-hub.github.io/PPApp/?v=2.0.03` in Chrome. Both should display 2.0.03.
6. Reopen the installed app. The updated worker should now be able to install because every file in its pre-cache list exists.

If an older home-screen installation remains pinned to a different URL/scope, verify its launch URL before removing or reinstalling it. Do not clear Chrome site storage as a first-line fix.
