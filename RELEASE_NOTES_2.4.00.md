# Prairie Preludes Creator Studio 2.4.00

## Projects and Planner workflow update

- Added a Projects dashboard entry in Workspace with Activity Overview, two-week preparedness, publishing calendar, and upcoming Active Projects.
- Relocated the visible monthly calendar workflow into Projects while retaining the existing calendar rendering and date-detail behavior.
- Calendar project markers are displayed as elongated bars with equal 50/50 series-color and publishing-stage-color halves.
- Updated the preparedness indicator to use Prairie Preludes Dusty Rose, Golden Wheat, and Prairie Sage colors while retaining the existing weighted scoring calculation.
- Added a storytelling caption count to Plan a Video, with dynamically generated numbered caption fields.
- Added multiple footage associations to video projects while retaining the legacy primary asset reference for compatibility.
- Updated application version and backup export version to 2.4.00.

## Compatibility

Existing local database keys and record structures are retained. New project fields are additive (`assetIds`, `storyCount`, and `storyCaptions`); existing `assetId` remains supported. Existing publishing records, snapshots, footage records, and analytics data are not intentionally rewritten.

## Notes

This release preserves the existing main navigation dropdown styling and Command Center placement. The Projects dashboard and Planner workflow are an initial implementation of the agreed redesign; existing project editing and publishing workflows remain available.
