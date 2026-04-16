# Home Scroll Snap Design

**Goal**

Turn the homepage into a presentation-style experience on desktop by snapping between major sections, while preserving natural scrolling on mobile and avoiding abrupt transitions or empty layouts.

**Scope**

- Apply snap behavior only to the homepage main sections.
- Keep blog pages and other routes unchanged.
- Use soft snap behavior instead of hard full-page wheel interception.
- Rebalance the grouped sections so each screen feels intentional and filled.

**Design**

The homepage will keep native browser scrolling and use CSS scroll snapping on desktop only. The snap mode will be `proximity` rather than `mandatory` so wheel and trackpad input still feel natural. Each major screen will use `min-height` near the viewport height rather than fixed height, which prevents content clipping and keeps the layout flexible.

The section grouping will be:

- Hero
- About
- Activity
- Projects + Writing
- Timeline + Contact

The last two groups will be merged at the page structure level so each snap screen has enough visual weight. Existing reveal animations stay in place, but the section shells will become more self-contained and vertically centered where appropriate.

**Layout Adjustments**

- Hero remains its own screen with current structure.
- About keeps the split layout but tightens vertical spacing and aligns the content block closer to the viewport center.
- Activity remains a single-screen feature panel centered within its screen.
- Projects and Writing become one grouped screen with two stacked content bands.
- Timeline and Contact become the final grouped screen with contact content anchored near the lower portion of the screen.

**Responsive Behavior**

- Desktop and large tablet: snap behavior enabled.
- Mobile and narrow tablets: snap disabled and the page returns to normal document flow.

**Testing**

- Add a homepage rendering test that asserts the new grouped section labels are present.
- Keep existing Coding Pulse tests passing.
- Run a production build to confirm static export still works.
