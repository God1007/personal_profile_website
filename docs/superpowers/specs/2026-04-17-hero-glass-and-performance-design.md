# Hero Glass And Performance Design

## Goal

Improve the first homepage section in two ways:

1. Make the central hero panel feel like medium-opacity frosted glass so the background image remains more visible.
2. Reduce first-load slowness caused by oversized hero background assets.

## Current State

- The hero content is rendered inside a large centered panel in [app/page.tsx](/C:/Users/99448/Desktop/personal_profile_website/app/page.tsx).
- The visual treatment is mostly defined in [app/globals.css](/C:/Users/99448/Desktop/personal_profile_website/app/globals.css).
- The hero background currently relies on two large static assets from `public/`:
  - `wallhaven-3q5k8y.png`
  - `wallhaven-vpyrm5.jpg`
- The panel background is still too opaque, so it blocks too much of the image behind it.
- The dark background image is especially heavy and contributes materially to slow first paint on deployment.

## Approved Direction

Use a medium-transparency glass treatment for the main hero panel and reduce hero asset weight without changing the homepage structure.

This keeps the current layout, typography, and interaction model intact while improving visual depth and perceived performance.

## Visual Design

### Hero panel

The main hero panel will remain a single centered content block.

It will be restyled to look more like glass by:

- lowering the base fill opacity
- increasing background blur modestly
- adding a soft inner highlight near the top edge
- sharpening the border contrast slightly
- reducing the density of the solid overlay so more of the hero image reads through

The result should stay readable on both light and dark themes. The panel should not become fully translucent or hard to scan.

### Backdrop relationship

The hero backdrop will remain behind the panel, but the fade and overlay intensity will be slightly reduced so the image is more legible under the glass card.

This is a controlled adjustment, not a full redesign of the hero section.

## Performance Design

### Asset strategy

The current hero images are too large for first-load background assets. Replace them with compressed modern-format versions sized for the actual rendered use.

Preferred direction:

- convert hero backgrounds to `webp` or `avif`
- keep one light asset and one dark asset
- target visually acceptable compression instead of lossless preservation

### Loading behavior

The current CSS references both theme background images in the stylesheet. Browsers may still fetch more than one background asset depending on rendering conditions.

The implementation should reduce unnecessary transfer by:

- swapping to smaller compressed assets
- keeping the theme-specific background layering simple
- avoiding additional JS-based image orchestration unless needed

We are optimizing first-load weight first, not building an elaborate image loader.

## Scope

### In scope

- refine hero panel glass styling
- slightly rebalance hero backdrop opacity/fade
- replace heavy hero image files with optimized equivalents
- update CSS references to the new assets
- verify the homepage still works in both themes and at mobile/desktop sizes

### Out of scope

- changing homepage copy or structure
- redesigning the entire hero section
- introducing a new animation system
- adding runtime image loading logic unless compression alone proves insufficient

## Implementation Notes

- Primary edits will be in [app/globals.css](/C:/Users/99448/Desktop/personal_profile_website/app/globals.css).
- If optimized assets are added, they will live under `public/`.
- Existing JSX structure in [app/page.tsx](/C:/Users/99448/Desktop/personal_profile_website/app/page.tsx) should be preserved unless a minimal wrapper or pseudo-element hook is needed.

## Verification

Implementation will be considered correct when:

- the hero panel reads visually as glass rather than a mostly solid slab
- more of the hero background is visible behind the content
- the page remains readable in both themes
- the background assets served from production are materially smaller than the current versions
- build output still succeeds

## Risks

- too much transparency could reduce text contrast
- aggressive compression could visibly degrade the background image
- backdrop blur may render differently across devices, so the fallback fill still needs to look intentional
