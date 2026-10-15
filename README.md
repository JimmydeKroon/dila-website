# Dila

Websites for **Dila Scooters en Brommers** and **Dila Watersport** — two shops at
the same address in Purmerend, sharing one identity and one design system.

## Architecture

A pnpm monorepo. Each shop is an independent Next.js app (so they can live on
separate domains, deploy separately, and grow independently), while the identity
and the components they share live in packages. Changing the header or a card
once changes it for both shops.

```
apps/
  scooters/          # Dila Scooters en Brommers  -> scooter domain
  watersports/       # Dila Watersport            -> not built yet (phase 2)
packages/
  ui/                # design tokens + every shared component
  content/           # types, shop config, brand data, copy, i18n dictionaries
assets/              # the client's original images (source of truth)
scripts/             # image pipeline
```

Everything typed and content-driven: components read from props, pages read from
`@dila/content`. Nothing about the business is hardcoded in a component, which is
what makes the second shop and a future CMS cheap.

## Getting started

```bash
pnpm install
pnpm dev                   # all apps
pnpm --filter @dila/scooters dev
```

> Node 26 does not ship Corepack any more, so `pnpm` 12.11.2 (the version pinned
> in `packageManager`) is expected to be installed globally. On Node 20/22/24,
> `corepack enable` still activates exactly that version.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs every app in dev mode via Turborepo |
| `pnpm build` | Production build for every app |
| `pnpm typecheck` | `tsc --noEmit` across all packages |
| `pnpm images` | Regenerates the web images from `assets/` |

> **Reaching the dev server through a proxy or preview hostname** needs
> `NEXT_ALLOWED_DEV_ORIGINS=<host>`. Next blocks requests to its dev-only
> resources (HMR and the client chunks) from foreign origins by default, and the
> failure is silent: HTML and CSS arrive so the page looks complete, but React
> never hydrates and nothing is clickable. `next.config.ts` reads the hostnames
> from that env var so no ephemeral host is committed.

> Turborepo resolves its cache directory from the git root. In an environment
> where the worktree's `.git` points outside the project (some sandboxes), set
> `TURBO_CACHE_DIR` to a writable path, or use `pnpm -r typecheck` instead.

## Where content lives

| What | File |
| --- | --- |
| Address, phone, e-mail, opening hours, themes | `packages/content/src/site.ts` |
| Brands (story, models, hero + gallery photos, official links) | `packages/content/src/brands.ts` |
| Maintenance services | `packages/content/src/services.ts` |
| Every UI string | `packages/content/src/locales/nl.ts` |
| Images used by this app (hero, workshop, shop gallery) | `apps/scooters/lib/content.ts` |
| Design tokens + per-shop accent | `packages/ui/src/styles/theme.css` |

### Adding a brand

1. Add a logo to `assets/logo/` and map it in `scripts/prepare-images.mjs`
   (or drop a file straight into `apps/scooters/public/images/brands/`).
2. Append an entry to `brands` in `packages/content/src/brands.ts`.

The home page grid, the hero logo strip, `generateStaticParams` and the sitemap
all pick it up automatically.

### Second language

Only Dutch ships today, but no string is hardcoded: `Dictionary` in
`packages/content/src/i18n.ts` defines the contract. Adding English means
creating `packages/content/src/locales/en.ts` and registering it — no component
or routing changes.

## Images

`assets/` holds the client's originals; `pnpm images` derives the optimised
versions into `apps/scooters/public/images/`. The script:

- crops the baked-in Google Maps navigation arrows and watermark off the
  screenshots that had them,
- resizes and re-encodes to progressive JPEG (max 2000px, ~348 KB for the hero),
- trims and resizes the client's logo to `logo/dila-logo.png` — the supplied
  `dila.png` is already transparent, so there is nothing to key out,
- crops the brand photos to 16:10 (`brands/<slug>-scooter.jpg`) and the gallery
  pool to 4:3 (`gallery/gallery-NN.jpg`).

Brand logos are used as supplied, rendered inside white chips on the hero and at
the top of each brand page — inverting them would turn the solid-red Derbi mark
into an unreadable block.

## Known placeholders / open questions

- [ ] **E-mail address** — `info@dila.nl` in `site.ts` is a guess based on the
      domain they own. Confirm or remove.
- [ ] **Canonical domain** — `https://dila.nl` is a placeholder until the client
      hands over the domain and hosting details.
- [ ] **Logo quality** — the header and footer use the client's `dila.png`, a
      raster file, at 52px and 72px. A vector version would sharpen it and give
      the site a real favicon; nothing else needs to change to swap it in.
- [ ] **Favicon** — `app/icon.svg` is a placeholder "D" in the accent red.
- [ ] **Brand list** — only the five named brands are in; the client has more.
- [ ] **Brand and gallery photos are stock stand-ins** — `brands/<slug>-scooter.jpg`
      and `gallery/gallery-NN.jpg` are Unsplash photos (Unsplash License), not
      the client's products, and some show models from brands we do not carry.
      Replace them with real shots from the manufacturers at the same paths —
      and replace the matching `alt` texts in `brands.ts`.
- [ ] **Photo rights** — the shop photos came from Google Maps exports. The
      client must confirm they own or have permission to use them.
- [ ] **Workshop photos** — only one exists so far; the gallery currently shows
      the showroom.
- [ ] **Structured data** — no geo coordinates, and no `department` link between
      the two shops, because neither was confirmed.
- [ ] **Draft indexing** — `app/robots.ts` allows crawling. Consider
      `disallow` while the site is still under review.
- [ ] **Not built** — contact form, appointment booking, prices, reviews, and
      the parts marketplace (its own phase, with a real data source).

## Deployment

The site is a **static export**: `pnpm build` writes plain HTML/CSS/JS/images to
`apps/scooters/out/`, with no Next server involved at runtime. That is what the
chosen host serves, and it is why `next.config.ts` sets `output: "export"` and
`images: { unoptimized: true }` — see the comment in that file, and AGENTS.md §7
for why the host is Cloudflare rather than Vercel.

**Do not run `next start`.** There is no server build any more. Preview the
export the same way the host serves it:

```bash
pnpm build
cd apps/scooters && npx wrangler dev   # http://localhost:8787
```

`npx wrangler dev` reads `apps/scooters/wrangler.jsonc` and serves `out/` through
the same asset routing the live site uses, so a routing surprise shows up here
instead of after a deploy. A plain static server (`npx serve apps/scooters/out`)
renders the pages too, but it does not reproduce that routing.

### How it deploys: GitHub → Cloudflare (Workers Builds)

Pushing to `main` — or opening a pull request — triggers a Cloudflare build that
runs the build command, then `npx wrangler deploy` from `apps/scooters`, which
uploads `out/` as **static assets** of an asset-only Worker. No server, no
OpenNext, nothing to keep running.

Dashboard → **Workers & Pages → Create → Workers → Connect to Git** → pick
`JimmydeKroon/dila-website`, then set:

| Field | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | `apps/scooters` |
| Build command | `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @dila/scooters build` |
| Deploy command | `npx wrangler deploy` — the default, leave it |

`apps/scooters/wrangler.jsonc` must keep `name: "dila-website"` matching the
Worker in the dashboard, and must not be deleted — see the comment at the top of
that file for the failure it prevents.

Notes that matter:

- **The deploy command only works because `apps/scooters/wrangler.jsonc`
  exists.** Without a Wrangler config, `wrangler deploy` runs *automatic
  configuration*, sees Next.js, and tries to convert the project to OpenNext SSR
  — the wrong shape for a static export. That step then runs a plain `npm
  install`, which cannot parse this repo's `workspace:*` dependencies and fails
  the build with `npm error Unsupported URL Type "workspace:": workspace:*`.
  A committed config suppresses auto-configuration entirely.
- The build command must not be a bare `pnpm build` — that is Turborepo and would
  run every workspace task instead of just this app.
- The **root directory is `apps/scooters` while the install runs from the repo
  root** (`cd ../..`), because the shared `packages/*` are outside the app
  directory. This is the monorepo trap: a host that only installs inside
  `apps/scooters` cannot resolve `@dila/ui` or `@dila/content` and fails on the
  missing packages.
- Every branch and pull request gets its own preview URL, and those URLs are
  public by default — which is exactly what makes them usable as a client review
  link.
- `workers.dev` is fine for a review link, but Cloudflare's own docs say it is
  not for business-critical production, so point the client's real domain at the
  project for launch.

### Publishing a new build

Push to `main` and Cloudflare rebuilds automatically. To deploy by hand:

```bash
pnpm build
cd apps/scooters && npx wrangler deploy
```

`npx wrangler login` once, first. No environment variables are needed to build or
deploy — there are no secrets in this project.

> If the Worker name collides with an older project in the same account, rename
> it in `apps/scooters/wrangler.jsonc` **and** in the dashboard.

> **Draft indexing.** `app/robots.ts` currently allows crawling. Flip `allow` to
> `disallow` there if the review URL must stay out of search engines.
