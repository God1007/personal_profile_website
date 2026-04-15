# Technical Brand Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the site into a premium technical brand homepage with dual themes, stronger hierarchy, medium-strength motion, and a more developer-aligned visual identity while preserving the existing blog and static deployment flow.

**Architecture:** Keep the existing Next.js static export architecture, but refactor the presentation layer around a reusable theme system and more structured homepage sections. Introduce a client-side theme toggle with persisted preference, rebuild the homepage composition around new visual hierarchy, and restyle blog pages so the whole site feels like one coherent technical brand product.

**Tech Stack:** Next.js App Router, TypeScript, React, plain CSS with CSS custom properties, localStorage for theme persistence, Vitest, Testing Library

---

## File Structure

### Create

- `components/theme/theme-toggle.tsx`
- `components/theme/theme-provider.tsx`
- `components/home/hero-orbit.tsx`
- `tests/theme-toggle.test.tsx`

### Modify

- `app/layout.tsx`
- `app/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/blog/category/[category]/page.tsx`
- `app/blog/tag/[tag]/page.tsx`
- `app/globals.css`
- `data/site-content.ts`
- `components/blog/article-card.tsx`
- `components/blog/article-meta.tsx`
- `components/blog/related-articles.tsx`
- `tests/home.test.tsx`
- `tests/blog-index.test.tsx`
- `README.md`
- `README.zh-CN.md`

## Task 1: Fix content text and define the new homepage contract

**Files:**
- Modify: `data/site-content.ts`
- Modify: `tests/home.test.tsx`

- [ ] **Step 1: Write the failing homepage test for the redesigned technical brand hero**

Replace `tests/home.test.tsx` with:

```ts
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("shows the redesigned technical brand hero and key sections", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /engineering systems with clarity/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/陈嘉乐/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /selected projects/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /technical notes/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /education & journey/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the homepage test to verify it fails**

Run:

```bash
npm test -- tests/home.test.tsx
```

Expected: FAIL because the current homepage still uses the older structure and has no theme toggle.

- [ ] **Step 3: Rewrite `data/site-content.ts` with clean UTF-8 Chinese text and redesign-ready copy**

Update the content model so it includes these top-level sections:

```ts
export const siteContent = {
  profile: {
    name: "陈嘉乐",
    initials: "CJL",
    role: "City University of Hong Kong · Electronic Information Engineering",
    location: "Nanjing / Hong Kong",
    heroTitle: "Engineering Systems with Clarity",
    intro:
      "专注于 C++、Linux 系统编程、网络协议与智能分析，持续把底层能力、工程实现与真实问题连接起来。",
    summary:
      "南京信息工程大学计算机科学与技术本科，现于香港城市大学攻读电子信息工程硕士。",
    about:
      "我关注网络系统、系统编程、协议分析、AI 辅助工程与可验证的落地实现，希望把问题拆清楚，把系统真正做出来。",
    quickFacts: [
      "EAAI 联合作者论文经历",
      "独立完成 AI 智能网络诊断项目",
      "持续记录技术复盘与实践思考"
    ]
  },
  strengths: [
    {
      title: "C++ / Systems",
      description: "扎实的 C++11 与 Linux 系统开发基础，关注工程质量与可维护性。"
    },
    {
      title: "Networks / Protocols",
      description: "熟悉 TCP/IP、DNS、ICMP、ARP 与常见网络分析和调试方法。"
    },
    {
      title: "AI / Analysis",
      description: "结合 Python、数据分析与 AI 模型辅助实验设计、数据处理与工程判断。"
    }
  ],
  projects: [
    {
      title: "AI Intelligent Network Diagnostics",
      category: "Featured System Case",
      description:
        "基于 dbus、netlink、iptables 与 eBPF 构建智能网络诊断服务，对多维网络指标进行监控和分析。",
      impact: "覆盖网卡状态、RTT、TCP 丢包率、流量统计与 AI 分析",
      stack: "C++ · netlink · eBPF · Agent",
      featured: true
    },
    {
      title: "Multi-Agent Traffic Control Research",
      category: "Research",
      description:
        "参与 EAAI 论文相关实验与分析，围绕多智能体强化学习进行 SUMO 仿真与车流预测建模。",
      impact: "完成参数实验、仿真对比与历史数据建模",
      stack: "Python · SUMO · pandas · scikit-learn"
    },
    {
      title: "Modeling & Competition Practice",
      category: "Awards",
      description:
        "通过数学建模与创新创业竞赛积累问题抽象、分析建模与结果表达的完整实践经验。",
      impact: "省级一等奖、三等奖与校级项目成果",
      stack: "Modeling · Analysis · Presentation"
    }
  ],
  writing: {
    eyebrow: "Writing",
    title: "Technical Notes",
    intro: "记录项目复盘、技术学习、系统调试经验，以及一些关于工程实现的阶段性思考。"
  },
  timeline: [
    {
      period: "2025 - 2026",
      title: "MSc in Electronic Information Engineering",
      place: "City University of Hong Kong",
      description: "继续深入系统、网络与工程实现方向。"
    },
    {
      period: "2021 - 2025",
      title: "BSc in Computer Science and Technology",
      place: "Nanjing University of Information Science and Technology",
      description: "完成计算机基础、网络、编程与工程方法训练。"
    },
    {
      period: "2025",
      title: "EAAI Co-author Publication",
      place: "Research Contribution",
      description: "参与多智能体交通信号协同控制研究与实验分析。"
    }
  ],
  contacts: {
    email: "jaredchan1007@gmail.com",
    phone: "+86 13327829740 / +852 84961406",
    github: "https://github.com/God1007"
  }
} as const;
```

- [ ] **Step 4: Run the homepage test again to verify it still fails for the expected reason**

Run:

```bash
npm test -- tests/home.test.tsx
```

Expected: FAIL because the page structure and toggle are still missing, but the text source is now correct.

- [ ] **Step 5: Commit**

```bash
git add data/site-content.ts tests/home.test.tsx
git commit -m "feat: prepare redesign content contract"
```

## Task 2: Add and verify the theme system

**Files:**
- Create: `components/theme/theme-provider.tsx`
- Create: `components/theme/theme-toggle.tsx`
- Create: `tests/theme-toggle.test.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write the failing theme toggle test**

Create `tests/theme-toggle.test.tsx`:

```ts
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

describe("ThemeToggle", () => {
  it("toggles between light and dark labels", () => {
    render(<ThemeToggle initialTheme="light" onToggle={() => undefined} />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toHaveTextContent(/light/i);

    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run:

```bash
npm test -- tests/theme-toggle.test.tsx
```

Expected: FAIL because the theme toggle component does not exist yet.

- [ ] **Step 3: Implement the client-side theme provider and toggle**

Create `components/theme/theme-provider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme") as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme = stored ?? preferred;

    setThemeState(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function setTheme(theme: Theme) {
    setThemeState(theme);
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return value;
}
```

Create `components/theme/theme-toggle.tsx`:

```tsx
"use client";

import { useTheme } from "@/components/theme/theme-provider";

type ThemeToggleProps = {
  initialTheme?: "light" | "dark";
  onToggle?: () => void;
};

export function ThemeToggle({ initialTheme, onToggle }: ThemeToggleProps) {
  if (initialTheme && onToggle) {
    return (
      <button type="button" aria-label="Toggle theme" onClick={onToggle} className="theme-toggle">
        {initialTheme}
      </button>
    );
  }

  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="theme-toggle"
    >
      {theme === "light" ? "Light" : "Dark"}
    </button>
  );
}
```

Update `app/layout.tsx` to wrap the body content:

```tsx
import { ThemeProvider } from "@/components/theme/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

Also fix all corrupted Chinese metadata strings in `app/layout.tsx` to valid UTF-8 text.

- [ ] **Step 4: Run the theme toggle test to verify it passes**

Run:

```bash
npm test -- tests/theme-toggle.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/theme/theme-provider.tsx components/theme/theme-toggle.tsx tests/theme-toggle.test.tsx app/layout.tsx
git commit -m "feat: add dual-theme system"
```

## Task 3: Rebuild the homepage into the new technical brand layout

**Files:**
- Create: `components/home/hero-orbit.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Run the homepage test again to confirm the current page still fails**

Run:

```bash
npm test -- tests/home.test.tsx
```

Expected: FAIL

- [ ] **Step 2: Rebuild `app/page.tsx` around the new section structure**

Replace the homepage with these layout goals:

- top nav includes Chinese labels and the theme toggle
- hero uses an English H1 from `profile.heroTitle`
- hero includes Chinese supporting copy and a branded profile panel
- add `Profile Snapshot` section with structured quick facts
- convert projects into one featured card plus secondary cards
- rename the writing section visually to `Technical Notes`
- rename the journey section visually to `Education & Journey`

Key structural target:

```tsx
<main className="site-shell">
  <section className="hero-shell">
    <header className="site-nav container">
      <a className="brand-mark" href="#top" aria-label="Back to top">
        {profile.initials}
      </a>
      <nav className="nav-links" aria-label="Main navigation">
        <a href="#about">关于</a>
        <a href="#work">项目</a>
        <Link href="/blog">博客</Link>
        <a href="#timeline">经历</a>
        <a href="#contact">联系</a>
      </nav>
      <ThemeToggle />
    </header>

    <div className="hero-grid container" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{profile.role}</p>
        <h1>{profile.heroTitle}</h1>
        <p className="hero-text">{profile.intro}</p>
        <div className="hero-actions">
          <a className="button primary" href="#work">View Projects</a>
          <Link className="button secondary" href="/blog">Read Notes</Link>
        </div>
      </div>

      <aside className="hero-panel">
        <p className="panel-label">Profile Snapshot</p>
        <h2>{profile.name}</h2>
        <p>{profile.summary}</p>
        <HeroOrbit />
      </aside>
    </div>
  </section>

  {/* profile snapshot, selected projects, technical notes, education & journey, contact */}
</main>
```

Create `components/home/hero-orbit.tsx`:

```tsx
export function HeroOrbit() {
  return (
    <div className="hero-orbit" aria-hidden="true">
      <span className="orbit-core" />
      <span className="orbit-ring orbit-ring-a" />
      <span className="orbit-ring orbit-ring-b" />
      <span className="orbit-ping orbit-ping-a" />
      <span className="orbit-ping orbit-ping-b" />
    </div>
  );
}
```

- [ ] **Step 3: Run the homepage test to verify it passes**

Run:

```bash
npm test -- tests/home.test.tsx
```

Expected: PASS

- [ ] **Step 4: Manually check the page structure in the browser**

Run:

```bash
npm run dev
```

Expected: the homepage shows the new hero structure, theme toggle, and stronger hierarchy.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/home/hero-orbit.tsx
git commit -m "feat: rebuild homepage into technical brand layout"
```

## Task 4: Redesign the blog surfaces to match the new brand system

**Files:**
- Modify: `tests/blog-index.test.tsx`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/blog/category/[category]/page.tsx`
- Modify: `app/blog/tag/[tag]/page.tsx`
- Modify: `components/blog/article-card.tsx`
- Modify: `components/blog/article-meta.tsx`
- Modify: `components/blog/related-articles.tsx`

- [ ] **Step 1: Write the failing blog index test for the redesigned heading**

Replace `tests/blog-index.test.tsx` with:

```ts
import { render, screen } from "@testing-library/react";
import BlogIndexPage from "@/app/blog/page";

describe("BlogIndexPage", () => {
  it("renders the redesigned technical notes archive", () => {
    render(<BlogIndexPage />);

    expect(screen.getByRole("heading", { level: 1, name: /technical notes/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /featured note/i })).toBeInTheDocument();
    expect(screen.getByText(/这是一个示例文章/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the targeted blog index test to verify it fails**

Run:

```bash
npm test -- tests/blog-index.test.tsx
```

Expected: FAIL because the current blog page still uses the old heading structure.

- [ ] **Step 3: Restyle and rename the blog page content**

Update the blog pages so they use:

- `Technical Notes` as the main English heading
- Chinese explanatory text beneath it
- refined metadata chips
- more structured featured area
- stronger article page hierarchy

Concrete targets:

- `app/blog/page.tsx` hero heading becomes `Technical Notes`
- featured heading becomes `Featured Note`
- `app/blog/[slug]/page.tsx` keeps article layout but upgrades labels and hierarchy
- category and tag pages keep simple archive headings but align visually with the redesign

Update `components/blog/article-meta.tsx` so tags and category look like designed metadata pills rather than plain inline spans.

- [ ] **Step 4: Run the targeted blog index test to verify it passes**

Run:

```bash
npm test -- tests/blog-index.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/blog-index.test.tsx app/blog/page.tsx app/blog/[slug]/page.tsx app/blog/category/[category]/page.tsx app/blog/tag/[tag]/page.tsx components/blog/article-card.tsx components/blog/article-meta.tsx components/blog/related-articles.tsx
git commit -m "feat: align blog surfaces with redesign"
```

## Task 5: Implement the full dual-theme visual system and motion layer

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Run the full test suite to capture the pre-style baseline**

Run:

```bash
npm test
```

Expected: PASS, establishing that behavior is correct before heavy visual changes.

- [ ] **Step 2: Replace the current single-palette CSS with a true theme token system**

Refactor `app/globals.css` so it uses:

```css
:root {
  --bg: #f4f7fb;
  --bg-secondary: #edf3fb;
  --surface: rgba(255, 255, 255, 0.72);
  --surface-strong: rgba(255, 255, 255, 0.9);
  --ink: #0f1728;
  --muted: #4d5b76;
  --line: rgba(15, 23, 40, 0.1);
  --accent: #2f7cff;
  --accent-soft: rgba(47, 124, 255, 0.12);
  --glow: rgba(72, 172, 255, 0.22);
  --shadow: 0 24px 80px rgba(17, 25, 40, 0.08);
}

html[data-theme="dark"] {
  --bg: #07111f;
  --bg-secondary: #0b172a;
  --surface: rgba(11, 23, 42, 0.72);
  --surface-strong: rgba(13, 27, 48, 0.9);
  --ink: #f4f8ff;
  --muted: #96a7c4;
  --line: rgba(152, 181, 255, 0.14);
  --accent: #68b3ff;
  --accent-soft: rgba(104, 179, 255, 0.16);
  --glow: rgba(62, 145, 255, 0.25);
  --shadow: 0 24px 100px rgba(0, 0, 0, 0.32);
}
```

Add these motion and decoration systems:

- animated background halo with `@keyframes drift`
- section reveal animation classes
- hero orbit animation
- button and card hover depth
- subtle grid overlay background layer

Also add styles for:

- `.theme-toggle`
- `.site-shell`
- `.hero-panel`
- `.hero-orbit`
- `.profile-snapshot`
- `.projects-showcase`
- `.project-card.featured`
- `.meta-pill`

- [ ] **Step 3: Run lint, tests, and build after the CSS refactor**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected: all commands pass, confirming the visual refactor did not break behavior or export.

- [ ] **Step 4: Manually inspect both themes in the browser**

Run:

```bash
npm run dev
```

Expected:

- light theme feels premium and technical
- dark theme feels deeper and more engineering-focused
- theme toggle works
- section hierarchy is noticeably stronger

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: implement dual-theme technical brand styling"
```

## Task 6: Update documentation for the redesigned site

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`

- [ ] **Step 1: Update the documentation to describe the redesign**

Add notes describing:

- dual theme support
- where the theme toggle lives
- how to change hero copy and homepage sections
- how light and dark styling is controlled through CSS variables

- [ ] **Step 2: Verify documentation references the right files**

Check that the README files reference:

- `data/site-content.ts`
- `app/page.tsx`
- `app/globals.css`
- `content/blog/*.md`

Expected: all listed files match the current codebase.

- [ ] **Step 3: Run final verification**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected: all commands pass cleanly.

- [ ] **Step 4: Commit**

```bash
git add README.md README.zh-CN.md
git commit -m "docs: document technical brand redesign"
```
