# Prairie Preludes Creator Studio 2.0.05

## Content Projects layout refinement

The Content Projects page has been reorganized in this order:

1. Plan a video
2. Master Upload Template · Brand Defaults
3. Upload Builder
4. Project pre-publish checklist
5. Projects and content plans

The Projects and content plans list now appears at the bottom of the page. The pre-publish checklist sits directly between Upload Builder and the project list.

## Data and compatibility

- Layout-only revision; no project, caption, checklist, brand-default, footage, music, upload, or metric records are intentionally modified.
- Existing localStorage database and safety-copy keys are unchanged.
- Service-worker cache namespace updated to 2.0.05 so the deployed app can receive the new layout.
- No new database migration is required.

## Deployment

Replace only `index.html` and `sw.js` in the GitHub Pages repository with the files in this package. Keep the release notes for your records.

## Validation

JavaScript syntax and ZIP integrity should be checked before release. This package has not been live-tested in Android Chrome or the installed PWA.
