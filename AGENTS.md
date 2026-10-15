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
| **Scooters site (Phase 1)** | **done** — home + 5 brand pages; auto-rebuilds on Cloudflare on every push to `main` (see §7) |
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
7. **`html` must keep `data-scroll-behavior="smooth"`,** because `theme.css`
   sets `scroll-behavior: smooth` on it. Next 16 reads that attribute to switch
   smooth scrolling off for the duration of a route transition, and without it
   the router's own scroll handling animates while the new page is still laying
   out. The symptom is specific and looks like a content bug: a client-side
   navigation to a long page lands *partway down it* instead of at the top —
   clicking the header logo on a brand page dropped the visitor into the brands
   section. Next logs a `missing-data-scroll-behavior` warning in dev, so treat
   that warning as a real defect rather than noise.
8. **`wrangler deploy` will try to convert this project to OpenNext SSR** unless
   `apps/scooters/wrangler.jsonc` is present. With no Wrangler config, wrangler
   runs *automatic configuration*, sees Next.js, and offers to migrate to
   `@opennextjs/cloudflare` — wrong for a fully prerendered export, and its setup
   step runs a plain `npm install`, which cannot parse this repo's `workspace:*`
   dependencies. The build then dies with the misleading
   `npm error Unsupported URL Type "workspace:": workspace:*` — nothing to do
   with the actual site. That config file is load-bearing; keep it committed.

## 4. Design decisions and the reasoning

Don't "fix" these without reading why:

- **The header and the footer use the client's real logo**, `dila.png`, which
  turned out to have a transparent background already (the earlier white-on-black
  square was a different export). One file, one `Logo` component, two sizes: 52px
  in the header bar, 72px in the footer. Nothing derives a light-on-dark variant
  any more — the artwork reads on paper and on ink alike. The typographic
  wordmark placeholder is gone.
- **Brand logos sit on white chips**, not on the background and never inverted.
  Most of the marks are near-black artwork (Vespa, Yamaha, Peugeot), so on the
  hero photo they need a plate to be readable at all, and inverting is not the
  alternative: the Derbi mark is a solid red block that would invert into an
  unreadable white rectangle. That is why the home page's brand row is inside
  the hero at its foot (`Hero`'s `bottom` slot, `BrandStrip variant="dark"`) and
  why a brand page shows its mark in a chip above the headline. The chips *were*
  removed once, by moving the row onto a paper band below the hero and the brand
  mark into the story section; the client wanted the original treatment back.
- **Brand and gallery photos are Unsplash placeholders.** The client said
  product photos will come from the manufacturers, so the grid, the brand hero
  and the brand-page mosaic are filled with stock photography for now (Unsplash
  License: commercial use allowed, no attribution required). They are **not
  brand-authentic** — the Derbi card shows a scooter that is not a Derbi — and
  must not survive the first content review. Replacing them is a file swap:
  `assets/brand-photos/<slug>.jpg` and `assets/gallery/gallery-NN.jpg`, same
  filenames, then `pnpm images`. If a brand photo is missing, the pipeline falls
  back to a generated "FOTO VOLGT" tile so the grid never looks broken.
- **The phone number is printed in exactly one place: the footer.** The client
  does not want the site to push visitors to call — everything else points at
  the address, the opening hours and e-mail. No `tel:` link exists outside the
  footer's own `tel:` href, and no copy says "bel ons".
- **The maintenance section has no call to action at all.** It went through
  three phases: a button plus a "liever bellen?" line (both dialling the same
  number, read as a duplicate), then the button alone, and finally neither. It
  is now a photo grid of the workshop beside a card per service — the section
  describes the work instead of selling it. Do not add a `tel:` link back; the
  number lives in the footer only. The APK note that used to close the section
  is gone as well — see the APK bullet below.
- **The hero has a `bottom` slot but no `aside` slot.** `bottom` is the
  full-width row below a hairline at the foot of the photo, and the brand strip
  is the only thing that uses it. `aside` was the right-hand scroll cue, removed
  because it duplicated the "Bekijk onze merken" button a few centimetres away —
  do not add a second way to jump to the same section.
- **The number stays in the JSON-LD (`telephone`)** because that is metadata for
  search engines, not a call to action — remove it only if the client asks. Note
  that the shared `CallToAction` component still hardcodes a phone icon; it is
  currently unused, so make that icon configurable before using it again.
- **Brand pages are three sections, not seven.** A photo hero, the story (with
  the link to the manufacturer's own site), and a photo mosaic. The older
  category cards, model grid, "why us" list and CTA band were cut deliberately:
  the page is meant to be read top to bottom. A "Modellen" sidebar card was cut
  later for the same reason — the story paragraphs already name models — so
  `Brand.models` and `Brand.categories` are rendered nowhere and their dictionary
  strings (`brandPage.modelsTitle`, `brandPage.modelsLead`) are gone. The data
  itself stays: it is the client's, it costs nothing, and it is what a future
  "modellen" block would read.
- **Scroll animation is progressive enhancement.** `Reveal` sets its hidden
  state at runtime, never in the server-rendered HTML. A server-rendered
  `opacity: 0` would turn the hydration failure in §3 into a *blank page* with
  no error anywhere; this way the worst case is "no animation". The CSS is also
  gated on `prefers-reduced-motion`, so disabling motion in the OS removes the
  animation rather than shortening it.
- **Never claim "APK" for a brommer, snorfiets or motorfiets.** They have no
  APK obligation in the Netherlands, which is what the maintenance note said
  before it was cut from the page as a full-width band nobody needed to read.
  `dict.maintenance.note` is still in the dictionary, unused — put it somewhere
  smaller if the claim has to be on the site. Also: snorfiets helmets have been mandatory
  since 1 Jan 2023, and brommer = 45 km/u (yellow plate) vs snorfiets = 25 km/u
  (blue plate). Keep legal claims accurate — this was researched, not guessed.
- **No prices, no pickup service, no booking form.** None were confirmed by the
  client, so the site stays silent rather than inventing offers.
- **No Google Maps iframe.** Embedding drops third-party cookies without
  consent, which would drag a cookie banner in. Map blocks are styled links out
  to Google Maps. `site.mapEmbedUrl` exists if they ever accept a consent notice.
- **Contact and footer are one band, not two.** They used to be a contact
  section plus a footer that repeated the same address, e-mail and route link a
  few hundred pixels apart. `ContactBlock` is gone; `SiteFooter` is the single
  dark block at the foot of every page and carries `id="contact"`, which is what
  the menu's "Contact" item anchors to. It lives in the layout, so `/#contact`
  resolves from a brand page too. Anything contact-related belongs there. The
  logo and the tagline signed the band off under the address; the second menu
  ("Op deze pagina") was removed, because it repeated the header a thousand
  pixels below itself, and with it went the first divider. One `border-t`
  remains, above the copyright line.
- **The header floats over the hero.** It is `fixed`, starts transparent with
  the white nav, and turns into the paper bar once it is scrolled
  (or while the mobile menu is open, since the menu panel is white). Mechanics
  to keep in mind when touching either component: because the header is out of
  the flow, `layout.tsx` gives `main` a top padding of one header height
  (`pt-20`, matching the bar's `h-20`) and `Hero` cancels it with `-mt-20` so
  the photo runs to the top of the window. A new full-bleed block at the top of
  a page must do the same, and a page without a hero gets the clearance for
  free. The header and the hero share `Container width="full"`, which is also
  why the two are the only full-bleed bands on the site: the rest stays in the
  centred `wide` column. The overlay is also gated on the page actually opening
  with a hero: `Hero` marks itself with `data-hero` and the header looks for
  that on the first block in `main`, falling back to the solid bar. That is what
  keeps the full-colour logo legible over the 404's white background — if you
  wrap a hero in another element, the marker must stay the first child of `main`
  or the bar goes solid.
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
- The client's logo is **trimmed and resized, nothing more**: `dila.png`
  already has a transparent background, so there is no chroma-keying step to
  keep in sync. Output is `logo/dila-logo.png`, 640px.
- Brand photos are cropped to **16:10** (one ratio serves both the card and the
  wide brand hero) and the gallery pool to **4:3**. The mosaic crops those tiles
  further at render time, so keep new sources landscape and roomy.
- A brand with no source photo gets a generated "FOTO VOLGT" tile instead of a
  broken image.

## 6. Unconfirmed / placeholder — do not treat as final

- [ ] **`info@dila.nl` is a guess** based on the domain they own. Confirm or drop.
- [ ] **Canonical domain** `https://dila.nl` is a placeholder.
- [ ] **Brand list is incomplete** — only the five named brands.
- [ ] **Photo rights** — the shop photos came from Google Maps exports; the
      client must confirm they may be published.
- [ ] **Favicon** is a placeholder "D" in the accent red.
- [ ] **Brand and gallery photos are stock, not the client's.** See the note in
      §4 — they are stand-ins with the right *shape*, and several show models
      from brands we do not carry. Replace before launch, and replace the `alt`
      text with them: the alt texts in `brands.ts` describe the current photos.
- [ ] **No workshop photo set** — there is one real workshop photo. The
      maintenance section and the brand mosaics are filled from the same
      placeholder pool (`galleryPool` in `packages/content/src/brands.ts`).
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
- **Cloudflare free has no commercial-use restriction** (verified in their
  Self-Serve Subscription Agreement §2.2.1). But §2.2.1(a) forbids "sign up for
  the Services on behalf of a third party" — so the client should own the
  account, or the developer hosts it as their own project.
- **It deploys as an asset-only Worker, driven by the GitHub integration.**
  Cloudflare's "connect a repo" flow creates a *Workers Builds* pipeline, which
  runs a build command and then a **deploy command** (`npx wrangler deploy`); a
  Pages project has no deploy command at all. Both products are viable and cost
  the same for this site, so the shape was chosen to match the integration that
  already exists rather than to re-create it as Pages.
- **The site is a static export and already configured as one.**
  `next.config.ts` sets `output: "export"` and `images: { unoptimized: true }`;
  `pnpm build` writes `apps/scooters/out/`. There is no server build, so
  **`next start` no longer works** — serve `out/` instead.
- **Two traps in that export, both silent or confusing.** (a) Without
  `images.unoptimized`, Next still rewrites every `next/image` src to
  `/_next/image?url=...`; a static export ships no optimizer, so **every photo
  404s while the pages themselves render fine** — the site looks broken with no
  error. Verify with `grep -c '_next/image' out/index.html` (must be 0) and
  confirm `out/_next/image` does not exist. (b) Route handlers need an explicit
  `export const dynamic = "force-static"`, which `app/robots.ts` and
  `app/sitemap.ts` both carry; a new route handler must too or `next build`
  fails with `export const dynamic = "force-static" ... not configured on route`.
- **The tradeoff accepted:** no runtime image optimisation. The pipeline in
  `scripts/prepare-images.mjs` already emits sane sizes (66-255 KB, max 2000px),
  so the export serves those as-is rather than generating AVIF/WebP per request.
- **Deploy shape:** `apps/scooters/wrangler.jsonc` declares `name`,
  `compatibility_date` and `assets.directory: "./out"` with **no `main`** — no
  Worker script at all, so it is pure static hosting. Requests to static assets
  are **free and unlimited with no daily request cap** on the free plan, because
  nothing invokes a Worker script (verified: Cloudflare's "Billing and
  Limitations" page for static assets). Free-tier 429s only apply to requests
  that *do* hit a script — so do not add `main` or `run_worker_first` without
  re-checking that. Confirmed locally: `wrangler deploy --dry-run` reads the
  export and never runs automatic configuration.
- **Monorepo root:** the host's project root is `apps/scooters` while the build
  command starts with `cd ../..`, because the shared `packages/*` live outside
  the app directory. A host that only installs inside `apps/scooters` cannot
  resolve `@dila/ui` or `@dila/content` and fails on the missing packages.
  No environment variables are required to build or run.

## 8. Commands

```bash
pnpm install
pnpm --filter @dila/scooters dev     # http://localhost:3000
pnpm typecheck                       # tsc --noEmit, all packages
pnpm build                           # production build
pnpm images                          # regenerate derived images from assets/
cd apps/scooters && npx wrangler dev      # serve out/ through the host's routing (8787)
cd apps/scooters && npx wrangler deploy   # deploy by hand after npx wrangler login
```

`corepack enable` used to be the first step. Node 26 **no longer ships
Corepack**, so pnpm 12.11.2 — the version pinned in `packageManager` — is
installed globally instead. On Node 20/22/24 `corepack enable` still works and
honours the same pin, so that route is fine there too. Either way, every command
above expects a `pnpm` on `PATH`; without one, Turbo cannot spawn the per-package
tasks and `pnpm typecheck` fails with `Unable to find package manager binary`.

## 9. Where things live

- **Repo:** `github.com/JimmydeKroon/dila-website`, branch `main`. It is a fresh
  repository: the project was originally generated in a cloud workspace and
  handed over as a `.zip`, so there is no earlier history and no `images/`
  commit to clean up. `assets/` is the source of truth for `pnpm images`.
- **The client's original images on the developer's machine:**
  `~/Documents/freelance projects/Dila/images/{logo,shop}` — identical to
  `assets/` and deliberately kept outside the repo. Copy them into `assets/logo`
  and `assets/shop` if `pnpm images` ever has to run from a clean checkout.
- **Deployment:** GitHub `main` → Cloudflare (Workers Builds), static export,
  running as an asset-only Worker named `dila-website`. Pushing to `main` or
  opening a PR rebuilds and redeploys automatically; branch and PR builds get
  their own public preview URL. The dashboard fields and the manual deploy
  command are in `README.md` under "How it deploys". The one thing an agent
  cannot do is the Cloudflare login.

## 10. Next up

1. Get the client's **email and domain** (and confirm photo rights).
2. Real **scooter photos per brand** to replace the placeholders.
3. **Phase 2: the watersport site.** `packages/content/src/site.ts` already has
   its `SiteInfo` (shared address/phone/hours, blue `data-shop` theme). Needs
   the winter-storage section with package/price cards, and it is the only
   section with no shared equivalent in `packages/ui` yet.
4. Then: contact form, and the parts marketplace as its own service.
