# Personal Portfolio Website

A dynamic personal portfolio and technical journal built with Next.js, React, TypeScript, and plain CSS.

## Highlights

- Responsive light and dark themes
- Personal introduction, project stories, and engineering reflections
- Direct email and GitHub contact links
- Scroll-driven transitions and interactive project disclosures
- Markdown-based technical journal
- Shared, persistent appreciation counter
- Accessible reduced-motion and reduced-transparency fallbacks

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The shared appreciation count is stored in `.data/hero-likes.json` by default. The file is created automatically and ignored by Git.

## Verification

```bash
npm run lint
npm test
npm run build
```

## Shared appreciation counter

The homepage uses `/api/likes` for a real shared total.

- Each browser receives a random visitor ID.
- The server stores only a SHA-256 hash of that ID.
- Repeated or simultaneous submissions from the same browser are idempotent.
- Writes are serialized and committed with an atomic file rename.
- If the API is unavailable, the client displays the static baseline in `public/likes.json` and allows retrying.

Optional environment variables:

```bash
HERO_LIKE_STORE_PATH=/absolute/path/to/hero-likes.json
HERO_LIKE_INITIAL_COUNT=12
```

This intentionally provides lightweight browser-level duplicate protection, not account-level anti-fraud. A horizontally scaled deployment should replace the file store with Redis or a database.

## Ubuntu deployment

The writable shared counter means the site now runs as a small Node service instead of a static export.

1. Install dependencies and build in `/var/www/personal-profile-site`.
2. Create the persistent data directory:

```bash
sudo mkdir -p /var/lib/personal-profile-site
sudo chown -R www-data:www-data /var/lib/personal-profile-site
```

3. Install the included service:

```bash
sudo cp deploy/systemd/personal-profile.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now personal-profile
```

4. Install `deploy/nginx/personal-profile.conf`, then reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Content

- Homepage content: `app/page.tsx`
- Blog labels and WakaTime configuration: `data/site-content.ts`
- Blog posts: `content/blog/*.md`
- Global visual system: `app/globals.css`
- Homepage visual system: `app/profile.module.css`
- Existing interactive component styles: `app/home.css`
