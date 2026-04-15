# Personal Portfolio Website

A static personal portfolio and blog built with Next.js, TypeScript, and plain CSS. The current version uses a dual-theme visual system:

- `Light`: editorial technical brand
- `Dark`: deeper engineering tone

It is designed to deploy as static files on Ubuntu + Nginx.

## Stack

- `Next.js` App Router
- `React`
- `TypeScript`
- `plain CSS`
- `gray-matter` + `marked` for Markdown blog posts
- `Vitest` + `Testing Library`

## What is included

- Personal homepage
- Theme toggle with system-aware default
- Blog index and article pages
- Category and tag pages
- Markdown-based publishing flow
- Static export for simple server deployment

## Main folders

```text
app/
components/
content/blog/
data/
deploy/nginx/
lib/
tests/
```

## Files you will edit most often

- `data/site-content.ts`
  Edit your profile, projects, timeline, links, and homepage copy.
- `content/blog/*.md`
  Add and edit blog posts.
- `app/globals.css`
  Control theme tokens, layout, spacing, motion, and visual style.
- `app/page.tsx`
  Control homepage structure.

## Theme system

The site supports both light and dark themes.

- Default behavior: follow the user's system theme
- Manual override: use the theme toggle in the top navigation
- Storage: saved in `localStorage`

Theme files:

- `components/theme/theme-provider.tsx`
- `components/theme/theme-toggle.tsx`
- `app/globals.css`

Most colors are managed through CSS custom properties:

- `--bg`
- `--surface`
- `--ink`
- `--muted`
- `--line`
- `--accent`
- `--glow`

## Blog publishing

Create a file in `content/blog/`, for example:

```text
content/blog/my-note.md
```

Use this structure:

```md
---
title: "My Technical Note"
date: "2026-04-16"
summary: "A short summary for cards, previews, and SEO."
tags: ["Next.js", "Blog"]
category: "Engineering Notes"
featured: false
published: true
---

Write your article here in Markdown.
```

Fields:

- `title`: article title
- `date`: publish date in `YYYY-MM-DD`
- `summary`: short description
- `tags`: tag list
- `category`: one main category
- `featured`: whether it appears in featured sections
- `published`: whether it is visible on the site

## Local development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

Run:

```bash
npm run lint
npm test
npm run build
```

The static output is generated in:

```text
out/
```

## Ubuntu deployment

Build the site:

```bash
npm run build
```

Upload the generated `out/` folder to your server, or pull the repo on the server and build there.

Recommended web root:

```text
/var/www/personal-profile-site
```

Nginx config template:

```text
deploy/nginx/personal-profile.conf
```

Typical Nginx `server` block:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/personal-profile-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

After changing Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Updating the live site

After content or style updates:

```bash
npm run build
```

Then upload or sync the new `out/` contents to the server web root.

## Current content entry points

- Homepage content: `data/site-content.ts`
- Demo article: `content/blog/demo.md`

## Notes

- This project does not require a backend or database.
- It is optimized for static hosting and simple maintenance.
- If you later want CMS, comments, or search, they can be added on top of the current structure.
