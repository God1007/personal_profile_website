# Portfolio + Blog Design

**Date:** 2026-04-16

## Goal

Upgrade the current personal portfolio into a portfolio-first website with an integrated lightweight blog system. The homepage should still introduce the person first, while the blog becomes a meaningful secondary destination for long-form writing, notes, and essays.

## Project Direction

This site will remain:

- static-first
- easy to deploy on Ubuntu + Nginx
- beginner-maintainable
- visually refined and minimal

This site will expand from a single-page portfolio into a small content site with:

- a homepage
- a blog index page
- article detail pages
- taxonomy support for categories and tags
- featured writing surfaced on the homepage

## Recommended Approach

### Chosen approach

Use **Next.js + Markdown with frontmatter metadata**.

Each article will live in the repo as a content file with a stable schema. Build-time utilities will read the content and generate static pages.

### Why this approach fits

- keeps deployment identical to the current static workflow
- avoids a backend and database
- gives structured content for blog list pages and SEO
- remains light enough for a beginner to maintain
- can grow later into MDX or a CMS without discarding the current site

### Explicitly not included in this phase

- CMS integration
- comments
- search
- database
- admin dashboard
- analytics tooling

## Information Architecture

### Top-level pages

- `/`
  Homepage
- `/blog`
  Blog listing page
- `/blog/[slug]`
  Article detail page
- `/blog/category/[category]`
  Category archive page
- `/blog/tag/[tag]`
  Tag archive page

### Navigation

The top navigation should become:

- About
- Work
- Writing
- Journey
- Contact

The `Writing` item should point to `/blog`.

## Homepage Design

The homepage should remain portfolio-first, not blog-first.

### Section order

1. Hero
2. About
3. Selected Work
4. Writing Preview
5. Experience & Education
6. Contact
7. Footer

### Section intent

#### Hero

Keep the current premium and spacious feel. The hero should present identity, role, tone, and primary call to action.

#### About

Continue to summarize working style, positioning, and strengths.

#### Selected Work

Keep this as a curated project section, limited to a few strong examples rather than a large catalog.

#### Writing Preview

Add a new blog preview area on the homepage. This section should show the most recent or featured 3 to 4 articles. Each card should include:

- title
- publication date
- category
- short summary

This section should include a clear call to action such as `View all articles`.

#### Experience & Education

Keep as a credibility layer below projects and writing.

#### Contact

Keep simple and direct.

## Blog UX Design

The blog should feel like a natural extension of the portfolio rather than a separate template.

### Blog list page

The blog index page should include:

- a compact intro header
- a featured article block if one or more featured posts exist
- a grid or stacked list of articles
- visible category and tag metadata

If article count grows, the layout should still feel organized and editorial rather than crowded.

### Blog detail page

Each article page should include:

- title
- date
- category
- tags
- article body
- previous / next article links
- recommended articles section

The article layout should emphasize readability:

- narrower content width
- generous spacing
- restrained typography hierarchy
- subtle separators and metadata styling

## Content Model

Blog posts should use Markdown with frontmatter.

### Frontmatter schema

Each post should support:

- `title`
- `date`
- `summary`
- `tags`
- `category`
- `featured`
- `published`

Optional fields:

- `coverImage`

### Example

```md
---
title: "How I built my personal site from scratch"
date: "2026-04-16"
summary: "A practical walkthrough of design, implementation, and deployment decisions."
tags: ["Next.js", "Portfolio", "Nginx"]
category: "Development"
featured: true
published: true
---

Article body starts here.
```

### Content storage

Add a dedicated content folder, likely:

- `content/blog/`

Each article should map to a slug derived from the filename.

## Data and Utility Layer

The implementation should add lightweight content utilities that:

- read all Markdown posts
- parse frontmatter
- filter unpublished posts
- sort posts by date descending
- derive slugs, categories, and tags
- find featured posts
- provide previous / next article relationships
- provide related article suggestions by shared category or tags

This logic should stay isolated from the UI so the content system remains easy to reason about.

## Visual Direction

The visual language should stay aligned with the current site:

- warm neutrals
- glass-like layered surfaces
- calm spacing
- high-contrast typography
- minimal but intentional motion

### Blog-specific visual behavior

- article cards should feel editorial, not like generic SaaS cards
- metadata should be visible but quiet
- reading pages should prioritize comfort over decorative effects
- the transition from homepage to blog should feel consistent in tone

## SEO and Metadata

The expanded site should include:

- homepage metadata
- blog index metadata
- article-level metadata
- canonical URLs
- Open Graph basics for articles
- sitemap entries for blog pages

If category and tag pages are added, they should also receive reasonable titles and descriptions.

## Responsiveness

The revised site should support:

- desktop
- tablet
- mobile

### Responsive priorities

- homepage sections should stack cleanly on smaller screens
- blog list cards should collapse predictably
- article pages should keep readable line lengths on mobile
- metadata blocks should not become visually noisy on narrow widths

## Technical Scope

### New file groups expected

- blog content directory
- content parsing utilities
- blog list page
- dynamic article route
- taxonomy routes
- reusable blog UI components if needed

### Existing file groups expected to change

- homepage layout
- site content model
- global styles
- sitemap generation
- README and Chinese usage documentation
- tests

## Testing Strategy

At minimum, add or update tests that verify:

- homepage still renders core sections
- homepage now renders a writing preview section
- blog index renders article entries
- article page generation works for sample content
- content utilities sort and filter posts correctly

## Risks and Boundaries

### Main risks

- making the homepage too content-heavy and diluting the portfolio focus
- overbuilding the blog system before real writing needs appear
- introducing a CMS-level architecture too early

### Scope boundary for this phase

The implementation should stop at a polished static blog system with structured metadata and taxonomy pages. Anything requiring authoring UI, external services, or dynamic runtime behavior is out of scope.

## Final Recommendation

Proceed with a portfolio-first redesign that adds a static Markdown blog system with category and tag support. Preserve the current refined visual tone, keep the homepage focused on personal introduction and selected work, and use the blog as a strong but secondary content destination.
