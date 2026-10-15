import type { NextConfig } from "next";

/**
 * Next blocks cross-origin requests to its dev-only resources (HMR and the
 * client chunks) by default. When the dev server is reached through a proxied
 * preview host, that block is silent and nasty: the HTML and CSS arrive, so the
 * page *looks* correct, but React never hydrates and every interactive control
 * — the mobile menu, the gallery lightbox — does nothing.
 *
 * Hostnames are read from the environment so no ephemeral sandbox host is
 * committed. Pass a comma-separated list:
 *
 *   NEXT_ALLOWED_DEV_ORIGINS=pv-abc.style.dev pnpm dev
 */
const allowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/**
 * Static export, for the hosting plan in AGENTS.md §7.
 *
 * The site is 100% prerendered (no API routes, no request-time data), so it
 * ships as plain files in `out/` rather than needing a Next server at runtime.
 * Two things this forces, both of which fail *quietly* if you forget them:
 *
 * - `images.unoptimized` below is required. A static export has no image
 *   optimizer, but Next still rewrites every `next/image` src to
 *   `/_next/image?url=...` unless this is set — and nothing serves that path,
 *   so every photo on the site 404s while the page itself looks fine.
 * - Route handlers need an explicit `export const dynamic = "force-static"`.
 *   `app/robots.ts` and `app/sitemap.ts` both carry it; a new route handler
 *   must do the same or `next build` fails with
 *   `export const dynamic = "force-static" ... not configured on route`.
 *
 * `next dev` is unaffected, and `next start` no longer applies — serve `out/`
 * (or let the host do it).
 */
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  // The shared packages ship raw TypeScript, so Next has to compile them.
  transpilePackages: ["@dila/ui", "@dila/content"],
  allowedDevOrigins,
  images: {
    // No optimizer to serve `/_next/image` in a static export — see above.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
