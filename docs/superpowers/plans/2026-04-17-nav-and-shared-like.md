# Nav And Shared Like Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the hero navigation feel slightly more solid and replace the local-only hero like button with a shared Upstash Redis count that each browser can increment once.

**Architecture:** Keep the homepage layout largely intact, but move the like interaction into a more deliberate hero action treatment. Because the site is deployed as a static export, the client will call an external lightweight API backed by Upstash Redis instead of using a writable in-app Next route. `localStorage` will enforce a one-like-per-browser rule without introducing accounts or a heavy backend.

**Tech Stack:** Next.js App Router, React, TypeScript, plain CSS, Upstash Redis REST API, Vitest, Testing Library

---

## File Map

- Modify: `components/home/hero-like-button.tsx`
  - Replace local-only toggle state with fetch/load/submit/local-persistence behavior.
- Modify: `app/page.tsx`
  - Reposition the like control into a more intentional hero interaction area if needed.
- Modify: `app/globals.css`
  - Make the nav bar more solid and redesign the like control visually.
- Create: `lib/hero-like.server.ts`
  - Encapsulate Redis read/increment calls and environment access.
- Create: `lib/hero-like.ts`
  - Shared types, keys, and small helper utilities for the client/external-API boundary.
- Modify: `tests/hero-like-button.test.tsx`
  - Replace the local toggle test with shared-count and local-persistence behavior tests.
- Create: `lib/hero-like.server.test.ts`
  - Cover server-side count reading and increment behavior with mocked fetch.

### Task 1: Define Shared Like Server Utilities

**Files:**
- Create: `lib/hero-like.ts`
- Create: `lib/hero-like.server.ts`
- Create: `lib/hero-like.server.test.ts`

- [ ] **Step 1: Write the failing server utility tests**

Create `lib/hero-like.server.test.ts` with:

```ts
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("hero-like server helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("reads the shared hero like count from Upstash", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ result: "27" }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      )
    );

    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";

    const { getHeroLikeCount } = await import("./hero-like.server");

    await expect(getHeroLikeCount()).resolves.toBe(27);
  });

  it("increments the shared hero like count in Upstash", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ result: 28 }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );

    vi.stubGlobal("fetch", fetchMock);
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";

    const { incrementHeroLikeCount } = await import("./hero-like.server");

    await expect(incrementHeroLikeCount()).resolves.toBe(28);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test -- lib/hero-like.server.test.ts
```

Expected: FAIL because `lib/hero-like.server.ts` does not exist yet.

- [ ] **Step 3: Add shared hero-like constants and types**

Create `lib/hero-like.ts` with:

```ts
export const HERO_LIKE_STORAGE_KEY = "hero-like:v1";
export const HERO_LIKE_REDIS_KEY = "hero_like_count";

export type HeroLikeResponse = {
  count: number;
};
```

- [ ] **Step 4: Implement the minimal Upstash helpers**

Create `lib/hero-like.server.ts` with:

```ts
import { HERO_LIKE_REDIS_KEY } from "@/lib/hero-like";

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Missing Upstash Redis configuration");
  }

  return { url, token };
}

async function runRedisCommand<T>(command: string[]) {
  const { url, token } = getRedisConfig();
  const response = await fetch(`${url}/${command.join("/")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Upstash request failed: ${response.status}`);
  }

  return (await response.json()) as { result: T };
}

export async function getHeroLikeCount() {
  const payload = await runRedisCommand<string | null>(["get", HERO_LIKE_REDIS_KEY]);
  return Number.parseInt(payload.result ?? "0", 10) || 0;
}

export async function incrementHeroLikeCount() {
  const payload = await runRedisCommand<number>(["incr", HERO_LIKE_REDIS_KEY]);
  return Number(payload.result) || 0;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run:

```powershell
npm test -- lib/hero-like.server.test.ts
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/hero-like.ts lib/hero-like.server.ts lib/hero-like.server.test.ts
git commit -m "feat: add shared hero like server utilities"
```

### Task 2: Add Shared Client Endpoint Configuration

**Files:**
- Modify: `lib/hero-like.ts`

- [ ] **Step 1: Add the shared mutation response type and public endpoint key**

Update `lib/hero-like.ts` to include:

```ts
export const HERO_LIKE_API_URL = process.env.NEXT_PUBLIC_HERO_LIKE_API_URL ?? "";

export type HeroLikeMutationResponse = {
  count: number;
  liked: true;
};
```

This step exists so the client has a stable response shape and one place to read the external endpoint configuration.

- [ ] **Step 2: Remove the in-app route dependency from the plan**

There should be no writable in-app route for likes in the static export build. If a temporary route file was created during exploration, remove it now.

- [ ] **Step 3: Run a build to verify the static site still builds cleanly**

Run:

```powershell
npm run build
```

Expected: PASS with no dependence on a writable `/api/hero-like` route.

- [ ] **Step 4: Commit**

```bash
git add lib/hero-like.ts
git commit -m "chore: configure external hero like endpoint"
```

### Task 3: Rebuild The Hero Like Client Behavior

**Files:**
- Modify: `components/home/hero-like-button.tsx`
- Modify: `tests/hero-like-button.test.tsx`
- Modify: `lib/hero-like.ts`

- [ ] **Step 1: Replace the current local-toggle test with browser-persistence and shared-count tests**

Update `tests/hero-like-button.test.tsx` to:

```ts
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HERO_LIKE_STORAGE_KEY } from "@/lib/hero-like";
import { HeroLikeButton } from "@/components/home/hero-like-button";

describe("HeroLikeButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("loads and shows the shared count", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ count: 12 }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      )
    );

    render(<HeroLikeButton />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /like this intro/i })).toHaveTextContent("12");
    });
  });

  it("increments once and persists the liked state locally", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 12 }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 13, liked: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      );

    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<HeroLikeButton />);

    const button = await screen.findByRole("button", { name: /like this intro/i });
    await user.click(button);

    expect(await screen.findByRole("button", { name: /you liked this intro/i })).toHaveTextContent("13");
    expect(window.localStorage.getItem(HERO_LIKE_STORAGE_KEY)).toBe("liked");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not submit again when this browser already liked", async () => {
    window.localStorage.setItem(HERO_LIKE_STORAGE_KEY, "liked");
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ count: 13 }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    render(<HeroLikeButton />);

    const button = await screen.findByRole("button", { name: /you liked this intro/i });
    expect(button).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test -- tests/hero-like-button.test.tsx
```

Expected: FAIL because the current component still requires `baseCount` and only toggles local state.

- [ ] **Step 3: Implement the shared-count client component**

Update `components/home/hero-like-button.tsx` to:

```tsx
"use client";

import { useEffect, useState } from "react";
import { HERO_LIKE_STORAGE_KEY } from "@/lib/hero-like";

type Status = "loading" | "idle" | "submitting" | "liked" | "error";

export function HeroLikeButton() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const liked = window.localStorage.getItem(HERO_LIKE_STORAGE_KEY) === "liked";

    if (!HERO_LIKE_API_URL) {
      setStatus(liked ? "liked" : "error");
      return;
    }

    fetch(HERO_LIKE_API_URL, { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as { count: number };
        setCount(payload.count ?? 0);
        setStatus(liked ? "liked" : "idle");
      })
      .catch(() => {
        setStatus(liked ? "liked" : "error");
      });
  }, []);

  async function handleLike() {
    if (status !== "idle") {
      return;
    }

    setStatus("submitting");

    try {
      if (!HERO_LIKE_API_URL) {
        throw new Error("Missing hero like endpoint");
      }

      const response = await fetch(HERO_LIKE_API_URL, { method: "POST" });
      if (!response.ok) {
        throw new Error("Like request failed");
      }

      const payload = (await response.json()) as { count: number; liked: true };
      setCount(payload.count ?? count + 1);
      window.localStorage.setItem(HERO_LIKE_STORAGE_KEY, "liked");
      setStatus("liked");
    } catch {
      setStatus("error");
    }
  }

  const liked = status === "liked";
  const disabled = status === "submitting" || liked;
  const label = liked ? "Liked" : status === "submitting" ? "Saving" : "Appreciate";
  const ariaLabel = liked ? "You liked this intro" : "Like this intro";

  return (
    <button
      type="button"
      className={`hero-like-button${liked ? " is-liked" : ""}${status === "error" ? " is-error" : ""}`}
      aria-label={ariaLabel}
      aria-pressed={liked}
      disabled={disabled}
      onClick={handleLike}
    >
      <span className="hero-like-button-thumb" aria-hidden="true">
        +
      </span>
      <span className="hero-like-button-label">{label}</span>
      <span className="hero-like-button-count">{count}</span>
    </button>
  );
}
```

- [ ] **Step 4: Run the hero like tests to verify they pass**

Run:

```powershell
npm test -- tests/hero-like-button.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/home/hero-like-button.tsx tests/hero-like-button.test.tsx lib/hero-like.ts
git commit -m "feat: add shared hero like client behavior"
```

### Task 4: Refine Hero Placement And Visual Styling

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Move the like control into the hero action area**

Update the hero action section in `app/page.tsx` to:

```tsx
<div className="hero-actions hero-actions-extended">
  <a className="button primary" href="#about">
    Enter Profile
  </a>
  <a className="button secondary hero-button-ghost" href="#work">
    View Projects
  </a>
  <HeroLikeButton />
</div>
```

And remove the old `HeroLikeButton` call from the hero ribbon.

- [ ] **Step 2: Make the nav bar slightly more solid and redesign the like chip**

Update `app/globals.css` with styling along these lines:

```css
.site-nav-framed {
  padding: 0.9rem 1.15rem;
  border-radius: 1.4rem;
  background: rgba(11, 23, 42, 0.66);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 40px rgba(6, 12, 24, 0.18);
}

.hero-actions-extended {
  align-items: center;
}

.hero-like-button {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 3.25rem;
  padding: 0 1.05rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05)),
    rgba(255, 255, 255, 0.08);
  color: var(--ink);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 14px 32px rgba(13, 20, 35, 0.12);
}

.hero-like-button.is-liked {
  border-color: rgba(104, 179, 255, 0.36);
  background:
    linear-gradient(180deg, rgba(104, 179, 255, 0.28), rgba(104, 179, 255, 0.12)),
    rgba(104, 179, 255, 0.12);
}

.hero-like-button:disabled {
  cursor: default;
}

.hero-like-button.is-error {
  border-color: rgba(255, 179, 71, 0.3);
}

.hero-like-button-thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 1rem;
  font-weight: 700;
}

.site-nav-framed .theme-toggle {
  background: rgba(255, 255, 255, 0.08);
}
```

- [ ] **Step 3: Run the homepage tests**

Run:

```powershell
npm test -- tests/home.test.tsx
npm test -- tests/hero-like-button.test.tsx
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/globals.css tests/hero-like-button.test.tsx
git commit -m "feat: redesign hero like control and nav bar"
```

### Task 5: Full Verification

**Files:**
- Verify: `app/api/hero-like/route.ts`
- Verify: `lib/hero-like.server.ts`
- Verify: `components/home/hero-like-button.tsx`
- Verify: `app/page.tsx`
- Verify: `app/globals.css`

- [ ] **Step 1: Run the focused test set**

Run:

```powershell
npm test -- lib/hero-like.server.test.ts
npm test -- tests/hero-like-button.test.tsx
npm test -- tests/home.test.tsx
```

Expected: PASS

- [ ] **Step 2: Run a full production build**

Run:

```powershell
npm run build
```

Expected: PASS

- [ ] **Step 3: Record required environment variables for deployment**

Ensure deployment config includes:

```text
NEXT_PUBLIC_HERO_LIKE_API_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Expected: the static site points at a real external like endpoint, and the external service has the Upstash credentials it needs.

- [ ] **Step 4: Commit**

```bash
git add lib/hero-like.server.ts lib/hero-like.ts lib/hero-like.server.test.ts components/home/hero-like-button.tsx app/page.tsx app/globals.css tests/hero-like-button.test.tsx
git commit -m "chore: finalize shared hero like flow"
```

## Self-Review

- Spec coverage: the plan covers nav styling, shared count storage, browser-local one-like enforcement, failure handling, control placement, and tests.
- Placeholder scan: commands, file paths, route names, and code snippets are explicit.
- Type consistency: shared types and storage keys are introduced before the route and client use them.
