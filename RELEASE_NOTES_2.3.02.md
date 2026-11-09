# Prairie Preludes Creator Studio 2.3.02

## TikTok-Specific Core Hashtags

### Master Upload Template
- Added an editable **Core TikTok Hashtags** field directly beneath **Core Brand Hashtags**.
- The new setting is stored in the existing `brandDefaults` data structure and is included automatically in JSON backups.
- Existing installations and backups without this field remain compatible; the new field defaults to blank.

### Upload Builder
- TikTok copy now combines project-specific hashtags, core brand hashtags, and core TikTok hashtags.
- Instagram and YouTube copy continue to include only project-specific and core brand hashtags.
- The additional TikTok hashtags are not added to other platform copy.

### Preservation
- Built from the validated 2.3.01-7 application package.
- Existing projects, uploads, analytics, assets, field sessions, music records, and other stored data structures are preserved.
- App-facing version display is **2.3.02**. Personal build suffixes are not displayed in the application.

## 2.3.02-1 — Project Planner Selector Organization

- Split the **Choose a content plan** selector into two alphabetical groups: unpublished projects first, followed by published projects.
- Added a **(P)** prefix to projects that have been published.
- Projects marked **Published** and projects marked **Entries created** appear in the published group. “Entries created” is used after the creator has manually published and then created the platform tracking entries.
- The selector re-sorts automatically when project status changes or the content type is switched.
- No data schema or backup format changes.
- App-facing version remains **2.3.02**; `-1` is a personal build suffix only.
