# AGENTS.md

Orientation for an AI agent (or a developer) picking this project up cold.
Read this before changing anything. `README.md` covers the human-facing basics;
this file records the **decisions, constraints and traps** that are not visible
in the code.

---

## 1. What this is

Websites for **Dila**, a business in Purmerend (NL) with **two shops at one
address**, separated only by name:

- **Dila Scooters en Brommers** — sells scooters, brommers and motoren (Vespa,
  KYMCO, Derbi, Yamaha, Peugeot) and services them in its own workshop.
- **Dila Watersport** — boats, jetski's, same workshop, plus **winter storage**.

The client also has a storage full of spare parts and wants to sell them online
**later** — that is a separate future phase with a real data source, not a
static page.

### Status

| Phase | State |
| --- | --- |
| Monorepo + shared design system | done |
| **Scooters site (Phase 1)** | **done** — home + 5 brand pages, verified building |
| Watersport site (Phase 2) | not started; config + blue theme already wired |
| Parts marketplace | not started, needs a datastore |

## 2. Architecture — why it looks like this

**Two separate sites, not one site with two themes.** They need their own
domains, SEO and branding, but must share one identity. So: a pnpm monorepo
where each shop is its own Next.js app and everything shared lives in packages.
Change `SiteHeader` once, both shops change.

```
apps/scooters/      Next.js app for the scooter shop   (root dir on the host)
apps/watersports/   Phase 2 — not created yet
packages/ui/        design tokens + every shared component
packages/content/   types, shop config, brand data, services, NL copy, i18n
assets/             the client's original images (source of truth for pnpm images)
scripts/            image pipeline
```

**All business content is data, never literals in components.** That is what
makes Phase 2 cheap and a future CMS a swap rather than a rewrite. If you find
yourself typing "Maxwellstraat" or "0299" inside a component, stop — it belongs
in `packages/content/src/site.ts`. Same for UI strings: they go in
`packages/content/src/locales/nl.ts`.

## 3. Gotchas — each of these cost real debugging time

1. **`allowedDevOrigins` must be set when the dev server is reached through a
   proxy** (a preview hostname, a tunnel, a reverse proxy). Next 16 blocks
   cross-origin requests to its dev resources, and the failure is *silent*:
   HTML and CSS arrive so the page looks finished, but React never hydrates and
   **every interactive control does nothing**. This is read from
   `NEXT_ALLOWED_DEV_ORIGINS` (comma-separated) so no ephemeral host is
   committed. Not needed for plain `localhost` dev.
2. **Tailwind will not see the shared components** unless
   `apps/scooters/app/globals.css` keeps
   `@source "../../../packages/ui/src/**/*.{ts,tsx}"`. Tailwind skips
   `node_modules`, and pnpm symlinks workspace packages there, so without it
   the shared classes silently generate no CSS.
3. **`transpilePackages: ["@dila/ui", "@dila/content"]`** is required in
   `next.config.ts` — the packages ship raw TypeScript by design.
4. **Turborepo derives its cache dir from the git root.** In a sandbox whose
   worktree `.git` points outside the project it fails with
   `failed to create directory '/workspace/.turbo/cache'`. Use
   `TURBO_CACHE_DIR="$PWD/.turbo/cache" pnpm typecheck`, or `pnpm -r typecheck`.
5. **Never `pkill -f "next dev"`.** The pattern matches the shell running it, so
   it kills itself (seen as exit 143). Kill the recorded pid instead.
6. **Don't run a production build while the dev server is live** on a small
   machine — the OOM killer reaps one of them, which surfaces as exit 137 with
   no compiler output.

## 4. Design decisions and the reasoning

Don't "fix" these without reading why:

- **The header uses a typographic wordmark, not the client's logo.** Their
  supplied logo is a square, white-on-black PNG — it cannot sit on a light
  header or act as a favicon. The real logo *is* used on the dark footer, as a
  transparent PNG the image script derives. Replace `Logo.tsx` when the client
  commissions a proper vector wordmark.
- **Brand logos on the hero sit inside white chips**, not inverted. Inverting
  them turns the Derbi mark (a solid red block with white text) into an
  unreadable white rectangle. A future brand logo may break the same way.
- **Brand card photos are generated "FOTO VOLGT" placeholders.** The client
  said product photos will come from the manufacturers. Drop real photos at
  `apps/scooters/public/images/brands/<slug>-scooter.jpg` — same filenames,
  no code change.
- **Never claim "APK" for a brommer, snorfiets or motorfiets.** They have no
  APK obligation in the Netherlands. The copy deliberately says
  "veiligheidscontrole" instead. Also: snorfiets helmets have been mandatory
  since 1 Jan 2023, and brommer = 45 km/u (yellow plate) vs snorfiets = 25 km/u
  (blue plate). Keep legal claims accurate — this was researched, not guessed.
- **No prices, no pickup service, no booking form.** None were confirmed by the
  client, so the site stays silent rather than inventing offers.
- **No Google Maps iframe.** Embedding drops third-party cookies without
  consent, which would drag a cookie banner in. Map blocks are styled links out
  to Google Maps. `site.mapEmbedUrl` exists if they ever accept a consent notice.
- **Opening hours appear exactly once** (contact section). They were briefly
  also in the footer and read as a duplication.
- **No `geo` coordinates and no `department` link between the two shops** in
  the JSON-LD. Neither was confirmed; a wrong pin or a wrong company structure
  in structured data is worse than nothing.
- **Copy is Dutch-first but fully dictionary-driven.** Adding English = create
  `packages/content/src/locales/en.ts`, satisfy the `Dictionary` type, register
  it. No component or routing changes.

## 5. Image pipeline (`pnpm images`)

`assets/` holds the client's originals; the script writes optimised versions to
`apps/scooters/public/images/`. Non-obvious things it does:

- The shop photos were exported from **Google Maps** and have navigation arrows
  and a watermark burned in. The script crops those off per-file (`crop` keys).
- The client's logo is rebuilt as a **transparent PNG** by mapping each pixel's
  brightest channel to alpha — the standard "remove black background" trick.
- Brand card placeholders are generated here, not hand-made.

## 6. Unconfirmed / placeholder — do not treat as final

- [ ] **`info@dila.nl` is a guess** based on the domain they own. Confirm or drop.
- [ ] **Canonical domain** `https://dila.nl` is a placeholder.
- [ ] **Brand list is incomplete** — only the five named brands.
- [ ] **Photo rights** — the shop photos came from Google Maps exports; the
      client must confirm they may be published.
- [ ] **Favicon** is a placeholder "D" in the accent red.
- [ ] **No workshop photo set** — there is one; the gallery shows the showroom.
- [ ] **`app/robots.ts` currently allows crawling.** Make indexing a build-time
      switch before any review deployment so a draft URL is never indexed.

### Verified external facts

Brand links were checked, not guessed: KYMCO `kymco.nl`, Yamaha
`yamaha-motor.eu/nl/nl/`, Derbi `derbi.com`, **Peugeot `peugeot-motocycles.nl`**
(the obvious `peugeot-motocycles.com` is unreachable), Vespa
`vespa.com/nl_NL/` (returns 403 to bots — Cloudflare, the URL is correct).

## 7. Hosting — read this before choosing a plan

- **Vercel Hobby is NOT licensed for this project.** Their fair-use guidelines
  state Hobby is non-commercial only, and define commercial as including
  "a paid employee or consultant writing the code" and "advertising the sale of
  a product or service". A client business site therefore needs **Pro**.
  Preview URLs are also public on Hobby.
- **Cloudflare Pages free has no commercial-use restriction** (verified in their
  Self-Serve Subscription Agreement §2.2.1). But §2.2.1(a) forbids "sign up for
  the Services on behalf of a third party" — so the client should own the
  account, or the developer hosts it as their own project.
- The site is **100% static-capable** (no API routes, no dynamic data), so a
  static host works. A static export needs `output: "export"` **and**
  `images: { unoptimized: true }` in `next.config.ts` — note that this trades
  away Next's runtime image optimisation, so prefer a host that can run
  `next build` normally if you have the choice.
- **Monorepo hosts:** set the project root to `apps/scooters` **and** enable
  "include source files outside the root directory", or the build fails on the
  missing `packages/*`. No environment variables are required to build or run.

## 8. Commands

```bash
corepack enable
pnpm install
pnpm --filter @dila/scooters dev     # http://localhost:3000
pnpm typecheck                       # tsc --noEmit, all packages
pnpm build                           # production build
pnpm images                          # regenerate derived images from assets/
```

## 9. Where things live

- **Repo:** `github.com/JimmydeKroon/dila-website`, branch `main`. It is a fresh
  repository: the project was originally generated in a cloud workspace and
  handed over as a `.zip`, so there is no earlier history and no `images/`
  commit to clean up. `assets/` is the source of truth for `pnpm images`.
- **The client's original images on the developer's machine:**
  `~/Documents/freelance projects/Dila/images/{logo,shop}` — identical to
  `assets/` and deliberately kept outside the repo. Copy them into `assets/logo`
  and `assets/shop` if `pnpm images` ever has to run from a clean checkout.
- **Deployment:** nothing is deployed and no host is chosen yet — see §7 before
  picking a plan.

## 10. Next up

1. Get the client's **email, domain and real logo** (and confirm photo rights).
2. Real **scooter photos per brand** to replace the placeholders.
3. **Phase 2: the watersport site.** `packages/content/src/site.ts` already has
   its `SiteInfo` (shared address/phone/hours, blue `data-shop` theme). Needs
   the winter-storage section with package/price cards, and it is the only
   section with no shared equivalent in `packages/ui` yet.
4. Then: contact form, and the parts marketplace as its own service.
