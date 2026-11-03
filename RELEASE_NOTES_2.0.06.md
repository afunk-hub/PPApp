# Prairie Preludes Creator Studio 2.0.06

## Content Projects: quick plan selector

- Added a selector at the top of the Content Projects page.
- Choose **Create a new plan** to clear the editor and begin a new content plan.
- Choose any saved plan to load its existing details directly into the editor for editing.
- The selector stays synchronized when a plan is opened from the project catalog or Command Center.
- Existing project records, IDs, captions, linked footage/music/uploads, checklist progress, and local storage keys are preserved.

## Deployment

Replace only `index.html` and `sw.js` in the GitHub Pages repository. Keep all other files unchanged. The service worker cache namespace is updated to 2.0.06.

## Validation

JavaScript syntax and ZIP integrity are checked before packaging. Live browser and Android runtime testing are not performed in this package build.
