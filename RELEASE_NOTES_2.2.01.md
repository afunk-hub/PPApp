# Prairie Preludes Creator Studio 2.2.01

## Photo Studio and planner refinements

- Moved the Photo Catalog to the bottom of the Photo Studio page, keeping the photo-record form at the top.
- Moved photo-project creation and the photo-project publishing-history table into Projects & Planner.
- Added a **Choose content type** selector above **Choose a content plan**. Video mode retains the existing video-plan chooser and Plan a Video form; Photo mode lists photo projects and displays the Create a Photo Project form.
- Replaced the long photo checkbox list with a collapsible searchable multi-select dropdown. Search checks photo title, category, capture location, capture date, and description. Multiple selections persist while filtering.
- Moved Caption / Description below Target Platforms and expanded it to full width with a taller editing area.
- Kept the Photo Catalog, photo records, photo projects, photo usage history, upload builder integration, photo checklist, and shared calendar behavior intact.

## Data and deployment

- This release is based directly on the user-validated 2.2.00 application package.
- No data schema changes are intended. Existing local browser data and JSON backup compatibility are retained.
- The existing local storage keys are unchanged.
- Service worker cache namespace updated to 2.2.01.

## Deployment

Replace `index.html` and `sw.js` in the GitHub Pages deployment with the files in this package. Keep the existing manifest and icon files in the deployment root. Refresh the app after deployment. Export a JSON backup before updating as a precaution.
