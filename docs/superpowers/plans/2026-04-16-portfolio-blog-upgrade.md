# Portfolio Blog Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the current portfolio site into a portfolio-first site with an integrated static blog, including article list/detail pages, category and tag pages, and a homepage writing preview.

**Architecture:** Keep the site statically exported with Next.js. Add a Markdown content layer with frontmatter parsing utilities, then build new blog routes and homepage integrations on top of that data. Keep content parsing isolated from UI and preserve the existing premium visual system while extending it toward editorial reading pages.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Testing Library, Markdown + frontmatter parsing, plain CSS

---

## File Structure

### Create

- `content/blog/how-i-think-about-digital-craft.md`
- `content/blog/building-a-portfolio-with-intention.md`
- `content/blog/notes-on-quiet-interfaces.md`
- `lib/blog.ts`
- `lib/blog.test.ts`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/blog/category/[category]/page.tsx`
- `app/blog/tag/[tag]/page.tsx`
- `components/blog/article-card.tsx`
- `components/blog/article-meta.tsx`
- `components/blog/related-articles.tsx`
- `tests/blog-index.test.tsx`

### Modify

- `package.json`
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `app/sitemap.ts`
- `data/site-content.ts`
- `tests/home.test.tsx`
- `README.md`
- `README.zh-CN.md`

## Task 1: Add Markdown content support

**Files:**
- Modify: `package.json`
- Create: `content/blog/how-i-think-about-digital-craft.md`
- Create: `content/blog/building-a-portfolio-with-intention.md`
- Create: `content/blog/notes-on-quiet-interfaces.md`

- [ ] **Step 1: Write the failing content-layer test dependency expectation**

Add the content parsing dependencies to the plan target so the blog utilities can be implemented predictably:

```json
"dependencies": {
  "gray-matter": "^4.0.3",
  "marked": "^16.4.1",
  "next": "^16.1.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

- [ ] **Step 2: Install the new dependencies**

Run:

```bash
npm install gray-matter marked
```

Expected: install completes successfully and `package-lock.json` updates.

- [ ] **Step 3: Add sample blog posts with frontmatter**

Create `content/blog/how-i-think-about-digital-craft.md`:

```md
---
title: "How I Think About Digital Craft"
date: "2026-04-12"
summary: "A short essay on balancing clarity, taste, and engineering discipline when building interfaces."
tags: ["Design", "Frontend", "Craft"]
category: "Essays"
featured: true
published: true
---

Good digital work rarely feels loud. It feels inevitable.

That usually comes from restraint: cleaner hierarchy, fewer competing ideas, and a stronger point of view about what matters most.

When I design or build products, I am not chasing decoration. I am trying to create confidence. That confidence comes from structure, rhythm, and careful decisions that hold together under real use.
```

Create `content/blog/building-a-portfolio-with-intention.md`:

```md
---
title: "Building a Portfolio With Intention"
date: "2026-04-08"
summary: "Notes on making a personal site feel deliberate instead of assembled from common templates."
tags: ["Portfolio", "Writing", "Brand"]
category: "Process"
featured: true
published: true
---

A portfolio should not just show work. It should show judgment.

That means editing hard, writing clearly, and choosing a visual pace that matches the kind of opportunities you want to attract.

The strongest personal sites are not always the most complex ones. They are usually the most coherent.
```

Create `content/blog/notes-on-quiet-interfaces.md`:

```md
---
title: "Notes on Quiet Interfaces"
date: "2026-04-02"
summary: "Why understated UI often creates a stronger sense of trust than visually overloaded products."
tags: ["UI", "Product", "Minimalism"]
category: "Notes"
featured: false
published: true
---

Quiet interfaces are not empty interfaces. They are selective.

They reduce friction by making fewer elements compete for attention, and they make interaction feel calmer because the layout has a clear center of gravity.
```

- [ ] **Step 4: Verify the content files exist**

Run:

```bash
Get-ChildItem content/blog
```

Expected: three Markdown files are listed.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json content/blog
git commit -m "feat: add initial blog content sources"
```

## Task 2: Build and test the blog content utility layer

**Files:**
- Create: `lib/blog.ts`
- Create: `lib/blog.test.ts`

- [ ] **Step 1: Write the failing tests for content parsing and sorting**

Create `lib/blog.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag
} from "@/lib/blog";

describe("blog content utilities", () => {
  it("returns published posts sorted by date descending", () => {
    const posts = getAllPosts();

    expect(posts.map((post) => post.slug)).toEqual([
      "how-i-think-about-digital-craft",
      "building-a-portfolio-with-intention",
      "notes-on-quiet-interfaces"
    ]);
  });

  it("returns featured posts only", () => {
    const featured = getFeaturedPosts();

    expect(featured).toHaveLength(2);
    expect(featured.every((post) => post.featured)).toBe(true);
  });

  it("loads a single post by slug", () => {
    const post = getPostBySlug("building-a-portfolio-with-intention");

    expect(post.title).toBe("Building a Portfolio With Intention");
    expect(post.category).toBe("Process");
  });

  it("filters posts by category", () => {
    const posts = getPostsByCategory("Essays");

    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("how-i-think-about-digital-craft");
  });

  it("filters posts by tag", () => {
    const posts = getPostsByTag("UI");

    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("notes-on-quiet-interfaces");
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run:

```bash
npm test -- lib/blog.test.ts
```

Expected: FAIL because `@/lib/blog` does not exist yet.

- [ ] **Step 3: Write the minimal content utility implementation**

Create `lib/blog.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const blogDirectory = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category: string;
  featured: boolean;
  published: boolean;
  content: string;
  html: string;
};

type BlogFrontmatter = Omit<BlogPost, "slug" | "content" | "html">;

function parsePostFile(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(blogDirectory, fileName);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = data as BlogFrontmatter;

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    summary: frontmatter.summary,
    tags: frontmatter.tags,
    category: frontmatter.category,
    featured: frontmatter.featured,
    published: frontmatter.published,
    content,
    html: marked.parse(content) as string
  };
}

export function getAllPosts(): BlogPost[] {
  return fs
    .readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(parsePostFile)
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getPostBySlug(slug: string): BlogPost {
  return getAllPosts().find((post) => post.slug === slug)!;
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}
```

- [ ] **Step 4: Run the targeted test to verify it passes**

Run:

```bash
npm test -- lib/blog.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/blog.ts lib/blog.test.ts
git commit -m "feat: add blog content utilities"
```

## Task 3: Add homepage writing preview and keep portfolio priority

**Files:**
- Modify: `app/page.tsx`
- Modify: `data/site-content.ts`
- Modify: `tests/home.test.tsx`

- [ ] **Step 1: Write the failing homepage test for writing preview**

Update `tests/home.test.tsx`:

```ts
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("shows the core portfolio sections and the writing preview", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /crafting calm, premium digital experiences/i
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 2, name: /about me/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /selected work/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /writing & notes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view all articles/i })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("heading", { level: 2, name: /experience & education/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the homepage test to verify it fails**

Run:

```bash
npm test -- tests/home.test.tsx
```

Expected: FAIL because the writing preview does not exist yet.

- [ ] **Step 3: Add the homepage writing copy and preview integration**

Update `data/site-content.ts` by adding:

```ts
  writing: {
    eyebrow: "Writing",
    title: "Writing & notes",
    intro:
      "Short essays, build notes, and reflections on design, frontend craft, and making digital work feel more intentional."
  },
```

Update `app/page.tsx`:

```tsx
import Link from "next/link";
import { getFeaturedPosts } from "@/lib/blog";
import { siteContent } from "@/data/site-content";

export default function HomePage() {
  const { profile, strengths, projects, timeline, contacts, writing } = siteContent;
  const featuredPosts = getFeaturedPosts().slice(0, 3);

  return (
    <main>
      <section className="hero-shell">
        <header className="site-nav container">
          <a className="brand-mark" href="#top" aria-label="Back to top">
            {profile.initials}
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <Link href="/blog">Writing</Link>
            <a href="#timeline">Journey</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        {/* existing hero */}
      </section>

      {/* existing about and work sections */}

      <section className="section container" id="writing">
        <div className="section-heading narrow">
          <p className="eyebrow">{writing.eyebrow}</p>
          <h2>{writing.title}</h2>
          <p className="section-intro">{writing.intro}</p>
        </div>

        <div className="article-preview-grid">
          {featuredPosts.map((post) => (
            <article key={post.slug} className="article-preview-card">
              <p className="article-preview-meta">
                {post.category} · {post.date}
              </p>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <Link href={`/blog/${post.slug}`}>Read article</Link>
            </article>
          ))}
        </div>

        <div className="section-cta">
          <Link className="button secondary" href="/blog">
            View all articles
          </Link>
        </div>
      </section>

      {/* existing timeline, contact, footer */}
    </main>
  );
}
```

- [ ] **Step 4: Run the homepage test to verify it passes**

Run:

```bash
npm test -- tests/home.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx data/site-content.ts tests/home.test.tsx
git commit -m "feat: add homepage writing preview"
```

## Task 4: Build the blog index page

**Files:**
- Create: `app/blog/page.tsx`
- Create: `components/blog/article-card.tsx`
- Create: `components/blog/article-meta.tsx`
- Create: `tests/blog-index.test.tsx`

- [ ] **Step 1: Write the failing blog index test**

Create `tests/blog-index.test.tsx`:

```ts
import { render, screen } from "@testing-library/react";
import BlogIndexPage from "@/app/blog/page";

describe("BlogIndexPage", () => {
  it("renders the writing archive and article entries", () => {
    render(<BlogIndexPage />);

    expect(screen.getByRole("heading", { level: 1, name: /writing/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /featured article/i })).toBeInTheDocument();
    expect(screen.getByText(/How I Think About Digital Craft/i)).toBeInTheDocument();
    expect(screen.getByText(/Building a Portfolio With Intention/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the blog index test to verify it fails**

Run:

```bash
npm test -- tests/blog-index.test.tsx
```

Expected: FAIL because the route does not exist yet.

- [ ] **Step 3: Implement reusable article UI and the blog index route**

Create `components/blog/article-meta.tsx`:

```tsx
type ArticleMetaProps = {
  date: string;
  category: string;
  tags?: string[];
};

export function ArticleMeta({ date, category, tags = [] }: ArticleMetaProps) {
  return (
    <div className="article-meta">
      <span>{date}</span>
      <span>{category}</span>
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}
```

Create `components/blog/article-card.tsx`:

```tsx
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { ArticleMeta } from "@/components/blog/article-meta";

type ArticleCardProps = {
  post: BlogPost;
};

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="article-card">
      <ArticleMeta date={post.date} category={post.category} tags={post.tags} />
      <h2>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p>{post.summary}</p>
    </article>
  );
}
```

Create `app/blog/page.tsx`:

```tsx
import { ArticleCard } from "@/components/blog/article-card";
import { getAllPosts, getFeaturedPosts } from "@/lib/blog";

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts()[0];
  const rest = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <main className="blog-page container">
      <header className="blog-hero">
        <p className="eyebrow">Writing</p>
        <h1>Writing</h1>
        <p className="section-intro">
          Essays, process notes, and reflections on thoughtful digital work.
        </p>
      </header>

      {featured ? (
        <section className="featured-article">
          <p className="eyebrow">Featured</p>
          <h2>Featured article</h2>
          <ArticleCard post={featured} />
        </section>
      ) : null}

      <section className="article-list">
        {rest.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run the blog index test to verify it passes**

Run:

```bash
npm test -- tests/blog-index.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/blog/page.tsx components/blog/article-card.tsx components/blog/article-meta.tsx tests/blog-index.test.tsx
git commit -m "feat: add blog index page"
```

## Task 5: Build article detail, category, and tag routes

**Files:**
- Create: `app/blog/[slug]/page.tsx`
- Create: `app/blog/category/[category]/page.tsx`
- Create: `app/blog/tag/[tag]/page.tsx`
- Create: `components/blog/related-articles.tsx`
- Modify: `lib/blog.ts`

- [ ] **Step 1: Write the failing utility test for adjacent and related posts**

Extend `lib/blog.test.ts`:

```ts
import { getAdjacentPosts, getRelatedPosts } from "@/lib/blog";

it("returns previous and next posts for a slug", () => {
  const adjacent = getAdjacentPosts("building-a-portfolio-with-intention");

  expect(adjacent.previous?.slug).toBe("how-i-think-about-digital-craft");
  expect(adjacent.next?.slug).toBe("notes-on-quiet-interfaces");
});

it("returns related posts based on category or tags", () => {
  const related = getRelatedPosts("how-i-think-about-digital-craft");

  expect(related.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the targeted utility test to verify it fails**

Run:

```bash
npm test -- lib/blog.test.ts
```

Expected: FAIL because the new utility functions do not exist yet.

- [ ] **Step 3: Implement the route support utilities and route pages**

Extend `lib/blog.ts`:

```ts
export function getAllCategories(): string[] {
  return Array.from(new Set(getAllPosts().map((post) => post.category)));
}

export function getAllTags(): string[] {
  return Array.from(new Set(getAllPosts().flatMap((post) => post.tags)));
}

export function getAdjacentPosts(slug: string) {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  return {
    previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
  };
}

export function getRelatedPosts(slug: string): BlogPost[] {
  const current = getPostBySlug(slug);

  return getAllPosts()
    .filter((post) => post.slug !== slug)
    .filter(
      (post) =>
        post.category === current.category || post.tags.some((tag) => current.tags.includes(tag))
    )
    .slice(0, 3);
}
```

Create `components/blog/related-articles.tsx`:

```tsx
import { ArticleCard } from "@/components/blog/article-card";
import type { BlogPost } from "@/lib/blog";

type RelatedArticlesProps = {
  posts: BlogPost[];
};

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="related-articles">
      <h2>Recommended reading</h2>
      <div className="article-list">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
```

Create `app/blog/[slug]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleMeta } from "@/components/blog/article-meta";
import { RelatedArticles } from "@/components/blog/related-articles";
import { getAdjacentPosts, getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const adjacent = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug);

  return (
    <main className="article-page container">
      <article className="article-layout">
        <p className="eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <p className="article-summary">{post.summary}</p>
        <ArticleMeta date={post.date} category={post.category} tags={post.tags} />
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      <nav className="article-pagination" aria-label="Article pagination">
        {adjacent.previous ? (
          <Link href={`/blog/${adjacent.previous.slug}`}>Previous: {adjacent.previous.title}</Link>
        ) : (
          <span />
        )}
        {adjacent.next ? <Link href={`/blog/${adjacent.next.slug}`}>Next: {adjacent.next.title}</Link> : null}
      </nav>

      <RelatedArticles posts={related} />
    </main>
  );
}
```

Create `app/blog/category/[category]/page.tsx`:

```tsx
import { ArticleCard } from "@/components/blog/article-card";
import { getAllCategories, getPostsByCategory } from "@/lib/blog";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);

  return (
    <main className="blog-page container">
      <header className="blog-hero">
        <p className="eyebrow">Category</p>
        <h1>{category}</h1>
      </header>
      <section className="article-list">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
```

Create `app/blog/tag/[tag]/page.tsx`:

```tsx
import { ArticleCard } from "@/components/blog/article-card";
import { getAllTags, getPostsByTag } from "@/lib/blog";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <main className="blog-page container">
      <header className="blog-hero">
        <p className="eyebrow">Tag</p>
        <h1>{tag}</h1>
      </header>
      <section className="article-list">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run the utility tests to verify they pass**

Run:

```bash
npm test -- lib/blog.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/blog/[slug]/page.tsx app/blog/category/[category]/page.tsx app/blog/tag/[tag]/page.tsx components/blog/related-articles.tsx lib/blog.ts lib/blog.test.ts
git commit -m "feat: add blog detail and taxonomy pages"
```

## Task 6: Extend styles, metadata, sitemap, and docs

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/sitemap.ts`
- Modify: `README.md`
- Modify: `README.zh-CN.md`

- [ ] **Step 1: Write the failing expectation around sitemap coverage**

Update `app/sitemap.ts` target behavior to include all blog pages, category pages, and tag pages using blog utilities.

- [ ] **Step 2: Run the production build to verify the current route metadata coverage is incomplete**

Run:

```bash
npm run build
```

Expected: either missing route coverage or no blog pages included yet.

- [ ] **Step 3: Implement the final styling and metadata adjustments**

Update `app/layout.tsx` metadata title/description to reflect the portfolio + writing positioning.

Update `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { getAllCategories, getAllPosts, getAllTags } from "@/lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://example.com";
  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date)
  }));

  const categories = getAllCategories().map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: new Date()
  }));

  const tags = getAllTags().map((tag) => ({
    url: `${baseUrl}/blog/tag/${tag}`,
    lastModified: new Date()
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date()
    },
    ...posts,
    ...categories,
    ...tags
  ];
}
```

Update `app/globals.css` to add:

```css
.blog-page,
.article-page {
  padding-top: 3rem;
  padding-bottom: 4rem;
}

.blog-hero,
.article-layout {
  max-width: 760px;
  margin: 0 auto 2rem;
}

.article-list,
.article-preview-grid {
  display: grid;
  gap: 1.25rem;
}

.article-card,
.article-preview-card,
.featured-article,
.related-articles,
.article-pagination {
  border: 1px solid var(--line);
  background: var(--bg-elevated);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow);
  border-radius: 1.5rem;
  padding: 1.5rem;
}

.article-meta,
.article-preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-body {
  display: grid;
  gap: 1rem;
  line-height: 1.9;
  color: var(--muted);
}

.article-body h2,
.article-body h3,
.article-card h2,
.article-preview-card h3 {
  color: var(--ink);
}

.article-pagination {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 2rem auto;
  max-width: 760px;
}
```

Update both README files so they describe:

- the new blog directory
- how to create a new post
- how the frontmatter works
- what pages now exist

- [ ] **Step 4: Run lint, tests, and build to verify everything passes**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected: all commands pass cleanly.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx app/sitemap.ts README.md README.zh-CN.md
git commit -m "feat: finish portfolio blog styling and documentation"
```
