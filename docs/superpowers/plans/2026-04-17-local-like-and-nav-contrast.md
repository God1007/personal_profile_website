# Local Like And Nav Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the external like dependency, read a baseline count from a static JSON file, keep one-like-per-browser local persistence, and improve nav text contrast.

**Architecture:** The static homepage will fetch a small JSON file from `public/` for the baseline count, then combine that with a `localStorage` marker to render the visible liked state. The nav keeps its current structure while increasing text contrast in CSS.

**Tech Stack:** Next.js static export, React, TypeScript, plain CSS, static JSON in `public/`, Vitest, Testing Library

---

## File Map

- Create: `public/likes.json`
  - Static baseline like count.
- Modify: `lib/hero-like.ts`
  - Remove external API config constant and keep local storage key plus response type.
- Modify: `components/home/hero-like-button.tsx`
  - Replace external endpoint fetch flow with static JSON baseline plus local increment behavior.
- Modify: `tests/hero-like-button.test.tsx`
  - Update tests for baseline JSON loading and local persistence behavior.
- Modify: `app/globals.css`
  - Increase nav link contrast and keep current like chip styling.

### Task 1: Add Static Baseline Count Asset

**Files:**
- Create: `public/likes.json`

- [ ] **Step 1: Create the baseline count file**

Create `public/likes.json` with:

```json
{
  "count": 12
}
```

- [ ] **Step 2: Verify the file exists**

Run:

```powershell
Get-Content public\likes.json
```

Expected: JSON with a numeric `count`.

### Task 2: Rework Hero Like Data Flow

**Files:**
- Modify: `lib/hero-like.ts`
- Modify: `components/home/hero-like-button.tsx`
- Modify: `tests/hero-like-button.test.tsx`

- [ ] **Step 1: Update the tests first**

Revise `tests/hero-like-button.test.tsx` so it covers:

- loading baseline count from `/likes.json`
- incrementing locally once
- preserving liked state after reload
- falling back safely if `/likes.json` fails

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test -- tests/hero-like-button.test.tsx
```

Expected: FAIL against the current external-endpoint implementation.

- [ ] **Step 3: Simplify shared helpers**

Update `lib/hero-like.ts` to keep only:

```ts
export const HERO_LIKE_STORAGE_KEY = "hero-like:v1";

export type HeroLikeResponse = {
  count: number;
};
```

- [ ] **Step 4: Implement local-plus-baseline button behavior**

Update `components/home/hero-like-button.tsx` so it:

- fetches `/likes.json`
- reads local liked marker
- shows `baseline + 1` when already liked
- on first click stores local marker and increments visible count
- falls back to `0` if JSON load fails

- [ ] **Step 5: Run the updated tests**

Run:

```powershell
npm test -- tests/hero-like-button.test.tsx
```

Expected: PASS

### Task 3: Improve Nav Text Contrast

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Adjust nav text color and focus visibility**

Update the nav styles so:

- default nav text is brighter and clearly readable
- hover/focus states remain distinct
- the change stays limited to nav readability

- [ ] **Step 2: Run homepage tests and build**

Run:

```powershell
npm test -- tests/home.test.tsx
npm run build
```

Expected: PASS

## Self-Review

- Spec coverage: baseline JSON, local one-like behavior, fallback behavior, nav contrast.
- Placeholder scan: commands and file paths are explicit.
- Type consistency: the client now depends only on the storage key and static response type.
