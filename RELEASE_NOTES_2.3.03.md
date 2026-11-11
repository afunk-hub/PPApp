# Prairie Preludes Creator Studio — Version 2.3.03

## Snapshot metrics and analytics
- Added Saves, Average Percentage Viewed, and Completion Rate to snapshot entry and reporting.
- Added an N/A option to every snapshot metric. N/A is stored distinctly from zero and excluded from applicable totals, averages, rates, and comparisons.
- Added Clean Visual and Quote Overlay creative-treatment labels to each snapshot for controlled creative testing.
- Added Analytics Overview visualizations for views over time, platform performance, audience retention, genre performance, creative-treatment comparison, engagement breakdown, and individual video performance.
- Added a shared snapshot-checkpoint selector and platform/genre/video filters for like-for-like comparisons, plus coverage/sample counts and selectable individual-video snapshot history.
- Replaced legacy watch-minutes tracking in analytics with Average Watch Time in seconds.
- Updated snapshot tables, YouTube long-format reporting, monthly analytics, cross-platform comparisons, and CSV export to recognize N/A values.

## Data compatibility
- Existing uploads, snapshots, plans, assets, music, photos, field sessions, weekly recaps, and other records are preserved.
- Existing numeric zero values remain zero. Existing historical values are not automatically converted to N/A.
- Existing snapshot records without newly introduced metrics display as unavailable until those metrics are recorded.

## Deployment
- Deploy `index.html` as the app entry point. Keep the existing supporting assets and service worker files in the ZIP.
