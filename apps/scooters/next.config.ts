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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The shared packages ship raw TypeScript, so Next has to compile them.
  transpilePackages: ["@dila/ui", "@dila/content"],
  allowedDevOrigins,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
