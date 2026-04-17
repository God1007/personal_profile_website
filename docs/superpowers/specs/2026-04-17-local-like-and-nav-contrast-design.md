# Local Like And Nav Contrast Design

## Goal

Simplify the hero like feature and improve navigation readability.

1. Make the navigation text clearly readable against the hero background.
2. Replace the external shared-like flow with a static baseline count from a JSON file plus one-like-per-browser local persistence.

## Approved Direction

The site will no longer depend on any external like backend.

Instead:

- a static JSON file provides the baseline public count
- the client reads that count on load
- if this browser has already liked, the UI shows baseline plus one
- if this browser likes for the first time, the UI stores a local marker and increments the visible count locally

This keeps the interaction simple, stable, and fully compatible with static export.

## Architecture

### Like count

The baseline count will live in a static JSON asset under `public/`.

The client will:

- fetch the JSON file
- read the baseline count
- check `localStorage`
- display either the baseline count or baseline plus one

### One-like rule

`localStorage` remains the only persistence layer.

Behavior:

- if no local marker exists, the browser can like once
- after liking, the marker is written locally
- future visits in that browser show the liked state and incremented visible count

### Failure handling

If the JSON file fails to load:

- the UI should fall back to `0`
- the button should remain usable locally

## UI Design

### Navigation

The nav bar structure stays the same, but the nav link text should gain stronger contrast so it is readable over the darkened glass header.

Changes:

- nav text color becomes brighter in the default hero state
- hover/focus remains visible without relying on subtle contrast
- no layout change required

### Like control

Keep the improved placement and polished chip styling from the current work.

Only the data source changes:

- remove external endpoint dependency
- keep local persistence
- keep liked and error-tolerant visual states where useful

## Scope

### In scope

- remove external like endpoint dependency from the client
- add static baseline count JSON
- keep browser-local liked persistence
- improve nav text contrast
- update tests to reflect the new local-plus-baseline behavior

### Out of scope

- real shared writable counts
- external backend deployment
- analytics or anti-abuse systems

## Verification

The change is correct when:

- nav links are clearly readable
- the like button loads a baseline count from static JSON
- first click locally increments the visible count and persists liked state
- refresh preserves liked state in the same browser
- build succeeds with no external like API dependency
