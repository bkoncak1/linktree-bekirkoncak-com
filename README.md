# linktree-bekirkoncak-com

Personal linktree at [linktree.bekirkoncak.com](https://linktree.bekirkoncak.com).
Built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/),
deployed as a static site to Cloudflare Workers (assets).

Sibling of [bkir.dev](https://bkir.dev). Same stack, same conventions.

## Editing the page

Everything — name, bio, avatar, and the full list of links — lives in a single
YAML file: `src/data/profile.yaml`. Edit it and rebuild.

```yaml
name: Bekir Koncak
handle: "@bkir"
bio: Links, profiles, and elsewhere.
avatar: /avatar.jpg          # optional, drop the file in public/

links:
  - title: GitHub
    url: https://github.com/bkoncak1
    description: code            # optional
    icon: 💻                     # optional, replaces the favicon
```

The Zod schema in `src/content.config.ts` validates the YAML at build time, so
typos and invalid URLs fail loudly.

## Analytics (optional)

Cloudflare Web Analytics is wired up — privacy-friendly, no cookies, free.

1. Cloudflare dashboard → Analytics & Logs → Web Analytics → **Add a site**
   (pick "Manual setup", domain `linktree.bekirkoncak.com`)
2. Copy the **site token** (a hex string in the snippet)
3. Set it in `src/data/profile.yaml`:

   ```yaml
   analytics:
     cloudflareToken: "your-token-here"
   ```

4. Rebuild and redeploy

You get visit counts automatically. Per-link click counts show up as
pageviews to `/out/<slug>` in the dashboard (Instagram → `/out/instagram`,
Bluesky → `/out/bluesky`, etc.) — every click fires a virtual SPA pageview
that the beacon picks up.

## Local development

Requires Node 20+.

```bash
npm install
npm run dev      # dev server on http://localhost:4321
npm run build    # production build to dist/
npm run preview  # preview the build locally
```

## Deploy to Cloudflare

`wrangler.jsonc` is preconfigured for a Workers Assets deployment bound to
`linktree.bekirkoncak.com`.

```bash
npm run deploy   # astro build && wrangler deploy
```

First-time setup: make sure `bekirkoncak.com` is on your Cloudflare account and
that Wrangler is authenticated (`npx wrangler login`).

## Project structure

```
src/
├── content.config.ts          # Zod schema for the profile
├── data/profile.yaml          # name, bio, avatar, links — edit this
├── layouts/Layout.astro
├── components/LinkButton.astro
├── pages/index.astro
└── styles/global.css          # Tailwind v4
```
