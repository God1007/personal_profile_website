# Nav And Shared Like Design

## Goal

Improve the homepage in two related ways:

1. Make the top navigation feel slightly more solid and stable against the hero background.
2. Replace the current local-only hero like interaction with a shared like count, while limiting each browser to one like.

## Current State

- The navigation bar is visually elegant but reads a little too light against the new hero treatment.
- The current like button in [components/home/hero-like-button.tsx](/C:/Users/99448/Desktop/personal_profile_website/components/home/hero-like-button.tsx) only uses local `useState`.
- That means:
  - the total is not shared across visitors
  - a refresh resets the count
  - there is no persistence for “already liked”
- The current button styling is also lightweight and secondary, so it does not feel like a deliberate interaction element.

## Approved Direction

Use a lightweight external backend or hosted storage for the shared total, and enforce one-like-per-browser using local persistence in the client.

Chosen implementation:

- shared count stored in `Upstash Redis`
- one-like-per-browser enforced with `localStorage`
- the static site calls an external lightweight API, rather than a Next in-app route

This is intentionally not a strict anti-abuse system. The goal is:

- shared public count
- normal visitor can like once per browser
- simple deployment and low maintenance

## Architecture

### Shared count

The shared like count will live in a small external store or endpoint.

Chosen backend:

- `Upstash Redis`

The site will talk to a small external API that reads and increments the Redis counter.

This is required because the current website is deployed as a static export, so an in-app writable Next API route is not a durable fit for production.

The homepage client will:

- fetch the current total when the hero renders
- display that total in the hero interaction area
- submit one increment when the visitor likes for the first time in that browser

### Browser-level one-like rule

The client will persist a local marker, such as a `localStorage` key, after a successful like.

Behavior:

- if the key is absent, the visitor can like once
- after success, the key is written locally
- if the key is present on later visits, the UI loads as already liked and does not submit another increment

This is sufficient for the intended protection level. Clearing browser storage will allow another like, which is acceptable for this project.

### Failure handling

The UI should stay usable even if the shared backend is temporarily unavailable.

Expected behavior:

- if the count cannot be loaded, show a safe fallback state rather than breaking the hero
- if a like submission fails, do not mark the visitor as liked locally
- keep the interaction readable and deterministic
- the external API endpoint should be configurable through public environment configuration at build time

## UI Design

### Navigation bar

The top nav should remain glass-based, but feel a bit more grounded.

Changes:

- slightly stronger fill opacity
- slightly stronger border definition
- tighter shadow so it reads more like a stable floating control bar
- preserve the current overall shape and spacing unless a minor rebalance is needed

The result should be “more present,” not heavy or boxed-in.

### Like control

The current like control should be redesigned into a more intentional hero interaction chip.

Visual direction:

- more polished pill or chip treatment
- stronger state contrast between idle and liked
- integrated count display
- clearer iconography and press feedback

### Placement

The button does not need to stay in the current ribbon if that compromises clarity.

Preferred direction:

- move it into the hero action area or keep it closely attached to the hero ribbon only if the new composition still feels balanced
- prioritize visual hierarchy and usability over preserving the exact current position

## Component Boundaries

### Hero like button

The hero like button component should evolve from a local visual toggle into a small client component responsible for:

- fetching the shared count
- checking local liked state
- submitting a like once
- rendering loading, idle, liked, and failure-tolerant states

### Data flow

The data flow should stay simple:

1. component mounts
2. read local liked marker
3. fetch shared count
4. render count and current liked state
5. if visitor clicks and is eligible, submit increment
6. on success, update count locally and persist liked marker

## Scope

### In scope

- update nav bar visual weight
- redesign the hero like control
- add shared like count integration
- persist one-like-per-browser locally
- handle load and submit failure states sanely
- update or add tests for the new behavior

### Out of scope

- user accounts
- strict anti-abuse protection
- cross-device identity
- analytics dashboards
- general homepage layout redesign beyond what is needed for the new control placement

## Verification

The change is correct when:

- the nav bar looks slightly more solid than before
- the hero like control looks more deliberate and polished
- the displayed count is shared across visitors
- a browser that already liked cannot increment again
- a fresh browser can increment once
- failed network requests do not incorrectly mark the browser as liked
- the site still builds successfully

## Risks

- choosing a backend that is heavier than needed would add maintenance without real value
- updating the hero control position could disturb the current composition if done carelessly
- local-only browser enforcement is intentionally soft and should not be presented as a secure anti-fraud mechanism

## Implementation Choice Notes

`Supabase` was considered but rejected for this scope because the current site only needs a lightweight shared counter. `Upstash Redis` is a better fit for:

- lower operational weight
- simpler counter storage
- small expected traffic
- easier integration into the current static-first site

## Deployment Notes

Because the site uses static export, the shared-like backend must live outside the Next static bundle.

Practical shape:

- static homepage hosted as it is today
- separate lightweight API endpoint backed by `Upstash Redis`
- client reads that endpoint URL from public environment configuration
