# Hero Glass And Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage hero card read as medium-opacity frosted glass while reducing the cost of the hero background assets.

**Architecture:** Keep the current homepage structure intact and concentrate the visual update in `app/globals.css`. Replace the two oversized hero background files in `public/` with compressed modern-format assets and point the existing theme-specific CSS background layers at those assets. Validate the result by checking asset sizes, running the build, and confirming the hero remains readable in both themes.

**Tech Stack:** Next.js App Router, React, TypeScript, plain CSS, static assets in `public/`

---

## File Map

- Modify: `app/globals.css`
  - Restyle the hero card to a more convincing glass treatment.
  - Reduce the backdrop fade density so more of the image shows through.
  - Point theme background layers to optimized assets.
- Create: `public/hero-light.webp`
  - Compressed light-theme hero background.
- Create: `public/hero-dark.webp`
  - Compressed dark-theme hero background.
- Verify: `public/wallhaven-3q5k8y.png`
  - Old source asset retained locally unless intentionally removed later.
- Verify: `public/wallhaven-vpyrm5.jpg`
  - Old source asset retained locally unless intentionally removed later.

### Task 1: Prepare Optimized Hero Assets

**Files:**
- Create: `public/hero-light.webp`
- Create: `public/hero-dark.webp`
- Verify: `public/wallhaven-3q5k8y.png`
- Verify: `public/wallhaven-vpyrm5.jpg`

- [ ] **Step 1: Inspect current source asset sizes**

Run:

```powershell
Get-Item public\wallhaven-3q5k8y.png, public\wallhaven-vpyrm5.jpg | Select-Object Name,Length
```

Expected: one file is roughly 4 MB and the other is roughly 20 MB, confirming they are too heavy for a first-screen background.

- [ ] **Step 2: Create compressed WebP versions**

Run one of the following depending on what is available on the machine:

Using ImageMagick:

```powershell
magick public\wallhaven-3q5k8y.png -resize 2200x2200^ -gravity center -extent 2200x1400 -quality 74 public\hero-light.webp
magick public\wallhaven-vpyrm5.jpg -resize 2200x2200^ -gravity center -extent 2200x1400 -quality 68 public\hero-dark.webp
```

Using `cwebp`:

```powershell
cwebp -q 74 public\wallhaven-3q5k8y.png -o public\hero-light.webp
cwebp -q 68 public\wallhaven-vpyrm5.jpg -o public\hero-dark.webp
```

Expected: two new `.webp` files are created in `public/` and are materially smaller than the originals.

- [ ] **Step 3: Verify compressed asset sizes**

Run:

```powershell
Get-Item public\hero-light.webp, public\hero-dark.webp | Select-Object Name,Length
```

Expected: both files are significantly smaller than the source assets, ideally well under 2 MB each.

- [ ] **Step 4: Commit**

```bash
git add public/hero-light.webp public/hero-dark.webp
git commit -m "perf: optimize hero background assets"
```

### Task 2: Restyle The Hero Card As Medium Glass

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update the hero card glass treatment**

In `app/globals.css`, update the hero card and shared panel styles with these changes:

```css
.surface-panel {
  border: 1px solid var(--line);
  background: var(--surface);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  box-shadow: var(--shadow);
}

.surface-panel-strong {
  background: var(--surface-strong);
}

.hero-copy-cover {
  position: relative;
  display: grid;
  align-content: center;
  min-height: 31rem;
  overflow: hidden;
  isolation: isolate;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06)),
    radial-gradient(circle at top, rgba(104, 179, 255, 0.18), transparent 34%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03) 42%, rgba(255, 255, 255, 0.02)),
    rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow:
    0 28px 90px rgba(13, 20, 35, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(28px) saturate(155%);
  -webkit-backdrop-filter: blur(28px) saturate(155%);
}

.hero-copy-cover::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.08) 22%, transparent 46%),
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 30%);
  opacity: 0.9;
  z-index: -1;
}

html[data-theme="dark"] .hero-copy-cover {
  background:
    linear-gradient(180deg, rgba(12, 24, 44, 0.54), rgba(12, 24, 44, 0.3)),
    radial-gradient(circle at top, rgba(104, 179, 255, 0.12), transparent 34%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.01)),
    rgba(9, 18, 33, 0.3);
  border-color: rgba(170, 203, 255, 0.18);
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    inset 0 -1px 0 rgba(255, 255, 255, 0.03);
}

html[data-theme="dark"] .hero-copy-cover::before {
  background:
    linear-gradient(180deg, rgba(168, 205, 255, 0.16), rgba(168, 205, 255, 0.03) 24%, transparent 48%),
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.08), transparent 30%);
}
```

Expected: the hero card becomes noticeably more translucent and glass-like without losing readability.

- [ ] **Step 2: Reduce the backdrop fade density and increase visible image detail**

In `app/globals.css`, update the backdrop image and fade styles:

```css
.hero-backdrop-image-light {
  background-image:
    linear-gradient(180deg, rgba(244, 247, 251, 0.14) 0%, rgba(244, 247, 251, 0.06) 18%, rgba(244, 247, 251, 0) 100%),
    url("/hero-light.webp");
  opacity: 0.42;
}

.hero-backdrop-image-dark {
  background-image:
    linear-gradient(180deg, rgba(7, 17, 31, 0.12) 0%, rgba(7, 17, 31, 0.05) 18%, rgba(7, 17, 31, 0) 100%),
    url("/hero-dark.webp");
  opacity: 0;
}

.hero-backdrop-fade {
  background:
    linear-gradient(180deg, rgba(7, 17, 31, 0) 0%, rgba(7, 17, 31, 0.06) 54%, rgba(7, 17, 31, 0.46) 84%, var(--bg) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, transparent 24%);
}

html[data-theme="dark"] .hero-backdrop-image-dark {
  opacity: 0.5;
}
```

Expected: more of the hero image remains visible below the main content card in both themes.

- [ ] **Step 3: Add a mobile fallback that keeps the glass treatment readable**

In the mobile media query inside `app/globals.css`, add this:

```css
@media (max-width: 720px) {
  .hero-copy-cover {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.12)),
      rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(20px) saturate(145%);
    -webkit-backdrop-filter: blur(20px) saturate(145%);
  }

  html[data-theme="dark"] .hero-copy-cover {
    background:
      linear-gradient(180deg, rgba(12, 24, 44, 0.62), rgba(12, 24, 44, 0.34)),
      rgba(9, 18, 33, 0.34);
  }
}
```

Expected: mobile retains the same visual direction without overblurring the panel.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: apply glass treatment to hero card"
```

### Task 3: Verify Asset Weight And Production Build

**Files:**
- Verify: `app/globals.css`
- Verify: `public/hero-light.webp`
- Verify: `public/hero-dark.webp`

- [ ] **Step 1: Confirm CSS now references optimized assets**

Run:

```powershell
rg -n "hero-light.webp|hero-dark.webp|hero-copy-cover|hero-backdrop-fade" app/globals.css
```

Expected: the updated CSS references the new asset names and the glass card selectors.

- [ ] **Step 2: Build the site**

Run:

```powershell
npm run build
```

Expected: `next build` completes successfully with static output generated under `out/`.

- [ ] **Step 3: Compare final asset sizes**

Run:

```powershell
Get-Item public\wallhaven-3q5k8y.png, public\wallhaven-vpyrm5.jpg, public\hero-light.webp, public\hero-dark.webp | Select-Object Name,Length
```

Expected: the new `hero-*.webp` files are materially smaller than the original source files.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css public/hero-light.webp public/hero-dark.webp
git commit -m "chore: verify hero styling and asset optimization"
```

## Self-Review

- Spec coverage: the plan covers glass styling, backdrop visibility, asset replacement, CSS updates, and build verification.
- Placeholder scan: no TBD/TODO placeholders remain; commands, file paths, and CSS snippets are explicit.
- Type consistency: the plan stays within CSS and static asset updates, so there are no unresolved API naming mismatches.
