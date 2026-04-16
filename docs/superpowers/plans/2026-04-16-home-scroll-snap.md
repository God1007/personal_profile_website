# Home Scroll Snap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add desktop-only presentation-style section snapping to the homepage and rebalance grouped sections so transitions feel deliberate rather than abrupt.

**Architecture:** Keep native scrolling and implement section snapping with CSS on a dedicated homepage shell. Restructure the homepage into grouped snap panels in `app/page.tsx`, then tune spacing and min-height rules in `app/globals.css` so each panel fills the screen without clipping. Validate behavior with focused rendering tests and a production build.

**Tech Stack:** Next.js App Router, React, TypeScript, plain CSS, Vitest, Testing Library

---

### Task 1: Add a failing homepage structure test

**Files:**
- Create: `tests/home-page.test.tsx`
- Modify: `tests/coding-pulse.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage scroll layout", () => {
  it("renders grouped snap sections for desktop presentation flow", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 2, name: /about the engineer/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /coding pulse/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /selected projects/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /education & journey/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/home-page.test.tsx`
Expected: FAIL until the page structure and test environment support the grouped homepage render.

- [ ] **Step 3: Write minimal implementation**

No production implementation in this task. Only create the test file.

- [ ] **Step 4: Run test to verify it still fails for the intended reason**

Run: `npm test -- tests/home-page.test.tsx`
Expected: FAIL due to missing or incompatible homepage test support, not syntax errors.

### Task 2: Restructure the homepage into snap panels

**Files:**
- Modify: `app/page.tsx`
- Test: `tests/home-page.test.tsx`

- [ ] **Step 1: Update the homepage structure**

Group the page into presentation panels:

```tsx
<main className="site-shell cinematic-home home-snap-shell">
  <section className="hero-shell home-panel home-panel-hero">...</section>
  <section className="section section-frame container home-panel" id="about">...</section>
  <section className="section section-frame container home-panel" id="pulse">...</section>
  <section className="section container home-panel home-panel-combo" id="work-writing">
    <div className="home-panel-stack">
      <div className="section-frame">projects markup</div>
      <div className="section-frame">writing markup</div>
    </div>
  </section>
  <section className="section container home-panel home-panel-end" id="timeline-contact">
    <div className="home-panel-stack">
      <div className="section-frame">timeline markup</div>
      <div className="contact-band surface-panel">contact markup</div>
    </div>
  </section>
</main>
```

- [ ] **Step 2: Run the homepage test**

Run: `npm test -- tests/home-page.test.tsx`
Expected: PASS once the grouped headings still render correctly.

### Task 3: Add desktop-only snap styling and rebalance panel spacing

**Files:**
- Modify: `app/globals.css`
- Test: `tests/home-page.test.tsx`

- [ ] **Step 1: Add snap shell and panel rules**

```css
.home-snap-shell {
  scroll-snap-type: none;
}

.home-panel {
  scroll-snap-align: start;
  scroll-snap-stop: normal;
}

@media (min-width: 981px) {
  html {
    scroll-padding-top: 0;
  }

  .home-snap-shell {
    display: grid;
    gap: 0;
  }

  .home-panel {
    min-height: 100svh;
    display: grid;
    align-items: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
```

- [ ] **Step 2: Tune grouped panel layouts**

```css
@media (min-width: 981px) {
  .home-panel-combo .home-panel-stack,
  .home-panel-end .home-panel-stack {
    display: grid;
    gap: 1.5rem;
    align-content: center;
  }

  .home-panel-end .contact-band {
    margin-top: auto;
  }
}
```

- [ ] **Step 3: Run homepage and Coding Pulse tests**

Run: `npm test -- tests/home-page.test.tsx`
Expected: PASS

Run: `npm test -- tests/coding-pulse.test.tsx`
Expected: PASS

### Task 4: Final verification

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/globals.css`
- Verify: `tests/home-page.test.tsx`

- [ ] **Step 1: Run targeted parser test**

Run: `npm test -- lib/wakatime.test.ts`
Expected: PASS

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: PASS with static export output in `out/`
