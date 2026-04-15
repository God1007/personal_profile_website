# Personal Portfolio Website

A polished, static-first personal portfolio built with Next.js and designed for simple deployment on Ubuntu + Nginx.

## Part 1 — Final recommendation

### Recommended solution

Use a **static Next.js website** with the App Router, TypeScript, plain CSS, and deployment through **Nginx** on Ubuntu.

Why this is the best fit:

- It gives you a premium frontend without forcing you to learn backend complexity.
- It is easy to host on your own server.
- It performs well and is good for SEO.
- It is easier for a beginner to maintain than a full-stack app with a database.

### Alternative solution

Use **Astro** for an even lighter static site.

Why I did not choose it as the main recommendation:

- Astro is excellent for content-heavy sites.
- Next.js has a larger ecosystem and is easier to grow later if you eventually want a blog, contact form backend, analytics, or CMS integration.

### Do you need a backend or database?

No, not for this version.

This portfolio is best as a **static site** because:

- your content changes occasionally, not every minute
- there is no login system
- there is no admin dashboard
- you do not need dynamic user data

If you later want a real contact form, blog CMS, or admin panel, you can add backend services later.

## Part 2 — Project architecture

### Stack

- `Next.js` for the website framework
- `React` for components
- `TypeScript` for safer, clearer code
- `plain CSS` for styling without unnecessary abstraction
- `Vitest + Testing Library` for a basic automated test
- `Nginx` for production hosting

### Why this architecture fits

- **Beginner-readable:** small number of files, no database, no API routes
- **Production-friendly:** static export is fast and stable
- **Easy to edit later:** text content is centralized in one file
- **Easy to deploy:** build once, upload the `out/` folder to the server

### Folder structure

```text
personal_profile_website/
├─ app/
│  ├─ globals.css
│  ├─ icon.svg
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ robots.ts
│  └─ sitemap.ts
├─ data/
│  └─ site-content.ts
├─ deploy/
│  └─ nginx/
│     └─ personal-profile.conf
├─ tests/
│  ├─ home.test.tsx
│  └─ setup.ts
├─ .gitignore
├─ eslint.config.mjs
├─ next.config.ts
├─ next-env.d.ts
├─ package.json
├─ tsconfig.json
├─ vitest.config.ts
└─ README.md
```

### Main files you will edit most often

- `data/site-content.ts`
  Change your name, bio, project descriptions, links, email, and experience.
- `content/blog/*.md`
  Add and edit blog posts with frontmatter metadata and Markdown body content.
- `app/page.tsx`
  Change the page structure.
- `app/globals.css`
  Change colors, spacing, layout, motion, and typography feel.

## Part 3 — Full project code

The full project code is already included in this repository.

### Key implementation notes

- The site is intentionally **single-page** for clarity and easy maintenance.
- Content is data-driven through `data/site-content.ts`.
- Blog content is stored in `content/blog/`.
- `next.config.ts` uses `output: "export"` so production output becomes static files inside `out/`.
- SEO basics are included through `metadata`, `robots.ts`, and `sitemap.ts`.

### Blog pages included

- `/blog`
- `/blog/[slug]`
- `/blog/category/[category]`
- `/blog/tag/[tag]`

### How to create a new blog post

Create a new Markdown file in `content/blog/`, for example:

```text
content/blog/my-new-article.md
```

Use this structure:

```md
---
title: "My New Article"
date: "2026-04-16"
summary: "A short summary for list pages and SEO."
tags: ["Next.js", "Writing"]
category: "Notes"
featured: false
published: true
---

Write your article body here in Markdown.
```

Field meanings:

- `title`: article title
- `date`: publish date in `YYYY-MM-DD`
- `summary`: short description used on cards and previews
- `tags`: article tags
- `category`: one main category
- `featured`: whether it can appear in homepage and featured sections
- `published`: whether the post should appear on the site

### Local commands

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Build production files:

```bash
npm run build
```

After build, the static site is generated in:

```text
out/
```

## Part 4 — Local development guide

### 1. What to install on your local machine

Install these tools:

- `Node.js` LTS
- `npm` (comes with Node.js)
- `Git`
- A code editor such as `VS Code`

Check whether Node.js is installed:

```bash
node -v
npm -v
```

### 2. Run the project locally

From the project folder:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

### 3. Edit the content

Open:

```text
data/site-content.ts
```

Change:

- name
- location
- role
- introduction
- project cards
- timeline
- email / GitHub / LinkedIn

### 4. Test the site

Run:

```bash
npm test
```

This checks that the expected sections are rendered.

### 5. Build for production

Run:

```bash
npm run build
```

This creates the static production files inside `out/`.

## Part 5 — Ubuntu server deployment guide

Target server:

- IP: `111.230.182.246`
- OS: `Ubuntu 22.04`

### 1. SSH into the server

From your local machine:

```bash
ssh root@111.230.182.246
```

This logs you into the server as the root user.

### 2. Update package lists and installed packages

```bash
apt update
apt upgrade -y
```

What this does:

- `apt update` refreshes package information
- `apt upgrade -y` installs newer package versions

### 3. Create a safer non-root user

Replace `alex` with your preferred username:

```bash
adduser alex
usermod -aG sudo alex
```

What this does:

- creates a normal user account
- gives that user sudo permission

### 4. Copy your SSH key to the new user

If your local machine already has an SSH key:

```bash
ssh-copy-id alex@111.230.182.246
```

Then test:

```bash
ssh alex@111.230.182.246
```

### 5. Set up the firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

What this does:

- allows SSH so you do not lock yourself out
- allows HTTP and HTTPS
- enables the firewall

### 6. Install Nginx

```bash
sudo apt install nginx -y
```

Check status:

```bash
sudo systemctl status nginx
```

### 7. Create the website directory

```bash
sudo mkdir -p /var/www/personal-profile-site
sudo chown -R $USER:$USER /var/www/personal-profile-site
```

### 8. Build the site on your local machine

Back on your local machine, inside the project:

```bash
npm install
npm run build
```

### 9. Upload the built files

From your local machine:

```bash
scp -r out/* alex@111.230.182.246:/var/www/personal-profile-site/
```

This copies the generated static files to the server.

### 10. Install the Nginx site config

On the server:

```bash
sudo cp deploy/nginx/personal-profile.conf /etc/nginx/sites-available/personal-profile
```

If the `deploy` folder is only on your local machine, copy the config content manually or upload the file first.

Edit the config:

```bash
sudo nano /etc/nginx/sites-available/personal-profile
```

Replace:

```text
example.com
www.example.com
```

with your real domain.

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/personal-profile /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

What this does:

- creates the active site link
- checks whether Nginx config syntax is valid
- reloads Nginx without stopping it

## Part 6 — Domain and HTTPS guide

### How to choose and buy a domain

Pick a domain that is:

- short
- easy to spell
- easy to say aloud
- close to your real name or professional identity

Good patterns:

- `yourname.com`
- `yourname.dev`
- `yourname.design`
- `firstname-lastname.com`

Common extension advice:

- `.com` is the most universal
- `.dev` is modern and good for developers
- `.design` fits portfolio branding but is less universal

You can buy domains from registrars such as:

- Cloudflare Registrar
- Namecheap
- Porkbun
- GoDaddy

### What an A record is

An **A record** tells the internet which IPv4 address your domain should point to.

In your case, your server IPv4 is:

```text
111.230.182.246
```

### DNS records to add

At your domain registrar or DNS provider, add:

```text
Type: A
Host: @
Value: 111.230.182.246
```

```text
Type: A
Host: www
Value: 111.230.182.246
```

Meaning:

- `@` means the root domain, such as `example.com`
- `www` means `www.example.com`

### Verify DNS is working

Run on your local machine:

```bash
nslookup example.com
nslookup www.example.com
```

Both should resolve to:

```text
111.230.182.246
```

### What to do before enabling HTTPS

Make sure:

- DNS already points to the server
- Nginx is serving the site over plain HTTP first
- your domain opens correctly in the browser

### Enable HTTPS with Let's Encrypt

Official instructions are generated by Certbot for your chosen stack:

- `https://certbot.eff.org/instructions`

For Ubuntu 22.04 + Nginx, the common setup is:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com -d www.example.com
```

What this does:

- installs Certbot
- asks Nginx to apply the SSL certificate automatically
- configures renewal

Test renewal:

```bash
sudo certbot renew --dry-run
```

## Part 7 — Maintenance and update workflow

### When you want to update the site later

1. Edit the content or styles locally.
2. Run tests.
3. Build the project.
4. Upload the new `out/` files to the server.

Commands:

```bash
npm test
npm run build
scp -r out/* alex@111.230.182.246:/var/www/personal-profile-site/
```

If you only changed text or CSS, this is still the same workflow.

### Recommended Git workflow

Initialize Git if needed:

```bash
git init
git add .
git commit -m "Initial portfolio site"
```

Later updates:

```bash
git add .
git commit -m "Update portfolio content"
```

## Part 8 — Troubleshooting

### Problem: `npm install` fails

Possible causes:

- Node.js version is too old
- network issues
- broken npm cache

Try:

```bash
node -v
npm cache clean --force
npm install
```

### Problem: `npm run build` fails

Possible causes:

- TypeScript error
- invalid import path
- syntax mistake while editing

Try:

```bash
npm test
npm run build
```

Read the first error carefully. Usually the first error is the real one.

### Problem: Nginx test fails

Run:

```bash
sudo nginx -t
```

Common causes:

- wrong file path in `root`
- missing semicolon
- invalid `server_name`

### Problem: domain does not open

Check:

- DNS A records
- firewall rules
- whether Nginx is running

Commands:

```bash
sudo systemctl status nginx
nslookup example.com
```

### Problem: HTTPS cannot be issued

Check:

- DNS is already correct
- port 80 is open
- the domain already loads over HTTP

Run:

```bash
sudo ufw status
sudo systemctl status nginx
```

### Problem: website shows old content after upload

Possible causes:

- browser cache
- files copied to wrong directory

Try:

- hard refresh the browser
- verify the files exist in `/var/www/personal-profile-site`

## Official references used for deployment guidance

- Next.js deployment docs: `https://nextjs.org/docs/app/getting-started/deploying`
- Certbot instructions: `https://certbot.eff.org/instructions`
