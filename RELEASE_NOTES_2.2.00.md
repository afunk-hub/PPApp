# Prairie Preludes Creator Studio 2.2.00

## Photo catalog and project publishing

- Added a Photo Studio workspace with an individual photo catalog for original photography.
- Photo records include a unique ID, title, capture date, category, location, photographer/copyright owner, copyright status, attached optimized image, description, and source/copyright notes.
- Added Photo Projects as a second project type. A project references one or more catalog photos and stores its own title, planned publish date, stage, target platforms, caption/description, unique hashtags, and notes.
- Kept the Upload Builder project-based: select a saved Photo Project to load its attached photos, project description, unique hashtags, and brand defaults. The builder does not select loose catalog photos.
- Added a photo-specific pre-publish checklist while retaining the existing video checklist.
- Added per-photo, per-platform publishing history, including publication date and project association.
- Added duplicate warnings when scheduling the same photo/platform combination in another project and when recording a repeat publication. Intentional reuse can be confirmed.
- Added Photo Projects to the planner, shared publishing calendar, and project pre-publish workflow. Photos use square Golden Wheat (`#C2A052`) calendar indicators; existing video indicators and series colors are unchanged.
- Added photo catalog records and publishing history to JSON export, import, merge, and replace workflows.
- Kept photo performance metrics out of the application. Existing video metrics and video-specific production fields remain unchanged.

## Image storage

- Attached photos are resized to a maximum 1400-pixel dimension and stored as optimized JPEG data in the app's local data store.
- Keep the full-resolution original photographs in a separate backed-up location. The catalog image is a convenient attached reference, not a replacement for your original master file.
- As with other Creator Studio records, data remains local to the browser/device until backed up and does not automatically sync between devices.

## Deployment

Replace `index.html` and `sw.js` at the GitHub Pages site root. Keep the existing manifest and icon assets. The service-worker cache namespace is updated to 2.2.00.

Before installing, retain your exported JSON backup. After updating, open Creator Studio and confirm your existing records are present. Photo records and projects will be added to the same JSON backup system.
