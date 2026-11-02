# Prairie Preludes Creator Studio — Release 2.0.04

**Release date:** November 2, 2026  
**Baseline:** Complete user-supplied GitHub repository containing the 2.0.03 application.  
**Release type:** Additive revision release.

## Changed files only

This delta package contains only these files:

- `index.html` — application update.
- `sw.js` — release-specific service-worker cache update.
- `RELEASE_NOTES_2.0.04.md` — this release note.

All existing icons, logos, manifest, and other repository files remain unchanged. For GitHub Pages, replace only `index.html` and `sw.js` in the existing `PPApp/` deployment directory. Keep the release notes with your release archive; they are not required by the app at runtime.

## What's new

### Master Upload Template
- Added editable, device-saved Brand Defaults for the brand name, signature/tagline, original violin credit, copyright line, and core hashtags.
- Core hashtags are prefilled as `#PrairiePreludes #AQuieterKindOfBeautiful #PeacefulMoments #OriginalViolinMusic`.
- Generated descriptions always include the exact signature phrase **“A quieter kind of beautiful.”**
- Existing project captions and hashtags are not overwritten when Brand Defaults are saved.

### Upload Builder
- Added a project-based builder for Instagram, YouTube, and TikTok.
- Combines the selected project's title, scene/genre, caption, hashtags, linked music title, and Brand Defaults into copy-ready platform text.
- Includes an optional video-specific detail field and a separate Copy action for each platform.
- The app prepares copy for manual posting; it does not publish to social platforms.

### Project-specific pre-publish checklists
- Added a saved checklist to each Content Project.
- Checklist completion is stored with that project and survives normal app reloads and JSON backup/restore.
- Includes checks for final edit/framing, audio, original-music credit, caption/hashtags, thumbnail, export format/quality, copyright evidence, and publishing details.

## Compatibility and safety

- Existing primary database key remains `prairie-preludes-creator-studio-v2`.
- Existing safety-copy key remains `prairie-preludes-creator-studio-v2-safety-copy`.
- Existing projects, footage, uploads, metrics, music, copyright records, IDs, and other data structures are retained.
- New `brandDefaults` and per-project `prePublishChecklist` fields are additive; older backups remain importable through the existing backup/restore path.
- No existing caption, hashtag, or project content is mass-edited.
- No media files are embedded in JSON backups.

## Deployment

1. Keep your external JSON backup.
2. Download and unzip the delta package.
3. In the existing GitHub repository, replace only `index.html` and `sw.js` with the files from this package.
4. Commit the changes and wait for GitHub Pages deployment.
5. Open the app and confirm Version 2.0.04 appears in the header and Backup & Settings.
6. Open Content Projects, save or select a project, test its checklist, save Brand Defaults, and generate each platform's upload copy.
7. Export a fresh JSON backup after confirming the new features work.

Do not clear Chrome site data or uninstall the installed app during deployment. The service worker uses a new 2.0.04 cache namespace and retires only Prairie Preludes cache namespaces.

## Verification performed

- Application inline JavaScript passes `node --check`.
- Service-worker JavaScript passes `node --check`.
- Delta ZIP contains only the two changed application files and the release notes.
- The app's existing database keys and data model remain unchanged; new fields are additive.
