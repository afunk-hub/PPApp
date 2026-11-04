# Prairie Preludes Creator Studio 2.0.07

## Music Catalog editing
- Added an Edit action to each existing music catalog record.
- Existing record values load into the catalog form for editing.
- Save Changes updates the existing record in place; it does not create a duplicate.
- Cancel exits edit mode without saving changes.
- Added a separate Google Drive link field alongside the local/device file location.
- Valid HTTPS Google Drive links appear as clickable Open Google Drive file links in the catalog.
- Existing music record IDs, other fields, and copyright/evidence data are preserved.

## Deployment
Replace the existing `index.html` and `sw.js` files in the GitHub Pages site root with the files in this package. Keep all other app files and local app data unchanged. The service-worker cache namespace is updated to 2.0.07.
- In the Content Plan “Associated music” dropdown, entries whose Work type is “Original composition” now display “(C)” after the title, making compositions easy to distinguish from recordings and other catalog entries. The marker is display-only and does not change saved music records.
