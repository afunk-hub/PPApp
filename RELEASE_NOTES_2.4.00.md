# Prairie Preludes Creator Studio 2.4.00

## Projects and Planner workflow corrections
- Moved the video and photo project planning/editing forms into the Projects dashboard, after the dashboard overview, preparedness, calendar, and Active Projects sections.
- The Projects dashboard's New Project action now opens the project planning workflow in Projects.
- Editing existing video and photo projects now returns to Projects rather than opening the Planner tab.
- Reorganized Planner into three internal sections: Upload Builder, Publishing Checklist, and Catalog. Only one section is displayed at a time.
- Kept the existing Workspace / Performance / Rights & Records top-level dropdown navigation structure and styling.
- Set standard video project platform defaults to YouTube Shorts, Instagram, Facebook, and TikTok; YouTube Long Format remains available as an optional selection.

## Compatibility
- Existing project records, upload records, footage references, and local database structure are retained.
- No historical publishing records are rewritten by this interface reorganization.

## Validation status
- JavaScript syntax check passed.
- ZIP integrity check performed after packaging.
- Interactive browser testing and live-data migration testing remain outstanding; test on a copy of the app before replacing the live deployment.

## Project-driven Video Uploads
- Reworked **Video uploads → Add a video entry** to begin with a saved video project or Weekly Recap selection instead of a manually entered title.
- Project selection supplies the video title, genre, associated footage, original music credit, and automatic Clean Visual / Text Overlay classification from the project's storytelling captions.
- Standard video projects default to all four short-form platforms (YouTube Shorts, Instagram, TikTok, and Facebook); Weekly Recaps default to YouTube Long Format and retain their recap association.
- Project changes reset platform defaults and associated metadata. Weekly Recap selections are restricted to YouTube Long Format.
- Upload records retain project and music references, all associated footage IDs, and the legacy singular footage ID for compatibility.
- The Video Entries table now displays the automatic content-treatment classification.

## Video entry save correction
- Fixed the Video Uploads form's category-visibility handler, which referenced a nonexistent element and could interrupt the form reset sequence.
- Persist the newly created or updated upload records before resetting the form, preventing the reset handler from blocking the save operation.
- Removed the obsolete linked-recap-field visibility reference; Weekly Recap association continues to come directly from the selected Weekly Recap project.
- Rechecked the embedded application script and the synchronized `inline.js` copy with Node.js syntax validation.
