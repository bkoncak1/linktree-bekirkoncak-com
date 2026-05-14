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

## Analytics

Two layers, both privacy-friendly, both free.

**1. Page views — Cloudflare Web Analytics**

Beacon injected via `analytics.cloudflareToken` in `profile.yaml`. Tracks
visits to `/` in the Web Analytics dashboard. Note: ad blockers (uBlock
Origin, Brave Shields, EasyPrivacy lists, etc.) block this beacon for an
estimated 20-40% of tech-savvy visitors.

**2. Per-link clicks — Worker + Analytics Engine**

Every link card renders an href to `/out/<slug>`. The Worker (`src/worker.ts`):

1. Logs a data point to the `linktree_clicks` Analytics Engine dataset
   (indexed by slug; blobs contain country, user-agent, referer)
2. Returns a `302` to the real URL

This runs at Cloudflare's edge, so ad blockers can't strip it. Bots and
`curl` are counted too — filter them in SQL if you don't want them.

Query the data in Cloudflare dashboard → Workers & Pages → Analytics
Engine → **SQL Console**:

```sql
SELECT
  index1 AS slug,
  COUNT() AS clicks
FROM linktree_clicks
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY slug
ORDER BY clicks DESC
```

Slugs are derived from each link's `title` (lowercased, non-alphanumerics
→ `-`). Override with an explicit `slug:` field in `profile.yaml` if you
want a stable identifier independent of the title.

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
public/
└── favicon.svg
scripts/
└── generate-redirects.mjs     # runs as `prebuild`; reads YAML, writes JSON
src/
├── worker.ts                  # /out/<slug> → log + 302 redirect
├── content.config.ts          # Zod schema for the profile
├── data/profile.yaml          # name, bio, avatar, links — edit this
├── generated/                 # gitignored; redirects.json built from YAML
├── layouts/Layout.astro
├── components/LinkButton.astro
├── pages/index.astro
└── styles/global.css          # Tailwind v4
```

`npm run build` runs `prebuild` first, which regenerates
`src/generated/redirects.json` from `src/data/profile.yaml`. The Worker
imports that JSON at bundle time, so any change to the YAML re-ships the
redirect map.
