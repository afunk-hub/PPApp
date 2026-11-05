# Prairie Preludes Creator Studio 2.2.02

## Fixes
- Fixed photo selection in Photo Projects so an individual photograph can be deselected from the searchable Photos in this project picker.
- Selection changes are now applied immediately when a checkbox is checked or unchecked, including while the catalog is filtered by search.
- The selected-photo count and saved project photo list now reflect deselections correctly.

## Data and deployment
- Built directly from the validated 2.2.01 package.
- Existing local storage key, data structures, photo records, photo projects, publishing history, Upload Builder, calendar, and video workflows are preserved.
- Service worker cache namespace updated for 2.2.02.
- Before updating, export a JSON backup. Replace `index.html` and `sw.js` on GitHub Pages and upload `prairie-preludes-logo.png` to the repository root. Keep the existing manifest and icon files. The logo was moved from a large embedded Base64 data URI into a separate PNG asset so GitHub can process the HTML file more reliably; the service worker already precaches this asset.

## Validation
- JavaScript syntax checked.
- HTML parsed and duplicate IDs checked.
- ZIP archive integrity checked.
- Interactive browser testing was not completed; please verify photo deselection after installation.
