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
