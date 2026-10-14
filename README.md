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
corepack enable            # activates the pinned pnpm version
pnpm install
pnpm dev                   # all apps
pnpm --filter @dila/scooters dev
```

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
| Brands (story, categories, models, official links) | `packages/content/src/brands.ts` |
| Maintenance services | `packages/content/src/services.ts` |
| Every UI string | `packages/content/src/locales/nl.ts` |
| Images used by this app | `apps/scooters/lib/content.ts` |
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
- rebuilds the square white-on-black logo as a **transparent PNG**
  (`logo/dila-logo-light.png`) so it works on the dark footer.

Brand logos are used as supplied, rendered inside white chips on the hero —
inverting them would turn the solid-red Derbi mark into an unreadable block.

## Known placeholders / open questions

- [ ] **E-mail address** — `info@dila.nl` in `site.ts` is a guess based on the
      domain they own. Confirm or remove.
- [ ] **Canonical domain** — `https://dila.nl` is a placeholder until the client
      hands over the domain and hosting details.
- [ ] **Logo** — the header uses a typographic wordmark because the supplied
      logo is white-on-black and cannot sit on a light background. Swap it in
      `packages/ui/src/components/Logo.tsx` when a vector wordmark exists.
- [ ] **Favicon** — `app/icon.svg` is a placeholder "D" in the accent red.
- [ ] **Brand list** — only the five named brands are in; the client has more.
- [ ] **Brand card photos** — `brands/<slug>-scooter.jpg` are generated
      "FOTO VOLGT" placeholders. Replace them with real product shots (the
      client said these will come from the manufacturers) at the same paths.
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

Intended for Vercel, one project per app, both rooted at the monorepo. Set the
root directory to `apps/scooters` and point the domain at it. Nothing has been
deployed yet.
