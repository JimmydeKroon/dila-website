/**
 * Build the web-ready images from the client's originals in `assets/`.
 *
 *   pnpm images
 *
 * Once photos are updated, re-running this regenerates everything into
 * `apps/<app>/public/images` — no component changes needed, as long as the
 * output filenames stay the same.
 *
 * Two things worth knowing about the source material:
 *
 *  - The eight shop photos were exported from Google Maps, so several of them
 *    still have Google's navigation arrows and watermark burned into the
 *    image. Those are cropped away here (`crop` below).
 *  - Brand card photos are generated placeholders until the client sends real
 *    product shots (see `brandSlugs` below).
 *  - The supplied logo is a square, white-on-black PNG. `dila-logo-light.png`
 *    rebuilds it as a transparent PNG by using each pixel's brightest channel
 *    as its alpha (the standard "remove black background" trick), which is what
 *    lets it sit on the dark footer. The client's own file is left untouched.
 */
import { mkdir, readdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, "assets");
const publicDir = path.join(root, "apps", "scooters", "public", "images");

/** Output plan, keyed by a stable substring of the original filename. */
const photos = {
  "02.01.12": {
    out: "shop/showroom-01.jpg",
    alt: "Showroom met scooters",
    width: 1600,
  },
  "02.02.42": {
    out: "shop/showroom-02.jpg",
    alt: "Rij scooters in de winkel",
    width: 1600,
  },
  "02.04.09": {
    out: "about/night-scooter.jpg",
    alt: "Scooter op straat in de avond",
    width: 1100,
    // Google Maps chrome is burned into the bottom of the frame.
    crop: { bottom: 150 },
  },
  "02.04.46": {
    out: "shop/showroom-03.jpg",
    alt: "Scooters opgesteld voor de balie",
    width: 1600,
  },
  "02.05.09": {
    out: "shop/interior.jpg",
    alt: "Overzicht van de winkel",
    width: 1100,
    crop: { bottom: 150 },
  },
  "02.05.57": {
    out: "about/team.jpg",
    alt: "Het team in de winkel",
    width: 1600,
  },
  "02.06.15": {
    out: "workshop/workshop-01.jpg",
    alt: "Werkplaats met gereedschap en een oude brommer",
    width: 1600,
    // Left-hand "previous photo" arrow from the original export.
    crop: { left: 30 },
  },
  "02.06.31": {
    out: "hero/hero-shop.jpg",
    alt: "Scooters voor de winkel van Dila in Purmerend",
    width: 2000,
  },
};

/**
 * Brand card photos.
 *
 * PLACEHOLDERS: the client has not supplied product shots per brand yet. These
 * are generated so the brand grid has its image slot filled and nothing looks
 * broken. Drop real photos at the same paths in `assets/brand-photos/<slug>.jpg`
 * and add them to `brandPhotos` below — the filenames the site uses do not
 * change.
 */
const brandSlugs = ["vespa", "kymco", "derbi", "yamaha", "peugeot"];

/** Neutral "photo follows" placeholder, rasterised so Next can optimise it. */
function placeholderSvg() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <rect width="1200" height="750" fill="#eef1f5"/>
  <g transform="translate(600 345)" fill="none" stroke="#c6ccd8" stroke-width="12" stroke-linejoin="round">
    <rect x="-115" y="-82" width="230" height="164" rx="18"/>
    <circle cx="-46" cy="-30" r="17" fill="#c6ccd8" stroke="none"/>
    <path d="M-100 55 L-28 -12 L18 30 L58 -6 L102 42" stroke-linecap="round"/>
  </g>
  <text x="600" y="545" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="32" font-weight="600" fill="#98a0ad" letter-spacing="6">FOTO VOLGT</text>
</svg>`);
}

/** Brand logos, renamed to match the slugs used in the content package. */
const brandLogos = {
  "vespa-logo.svg": "brands/vespa.svg",
  "KYMCO-logo.svg": "brands/kymco.svg",
  "derbi-logo.svg": "brands/derbi.svg",
  "Yamaha-logo.svg": "brands/yamaha.svg",
  "Peugeot_logo.svg": "brands/peugeot.svg",
};

async function ensureDirs() {
  for (const dir of ["shop", "workshop", "about", "hero", "brands"]) {
    await mkdir(path.join(publicDir, dir), { recursive: true });
  }
}

async function buildPhotos() {
  const files = await readdir(path.join(sourceDir, "shop"));
  const results = [];

  for (const [key, plan] of Object.entries(photos)) {
    const file = files.find((name) => name.includes(key));
    if (!file) {
      results.push(`  ! skipped ${plan.out} — no source matching "${key}"`);
      continue;
    }

    const input = path.join(sourceDir, "shop", file);
    const output = path.join(publicDir, plan.out);

    let pipeline = sharp(input);
    if (plan.crop) {
      const meta = await sharp(input).metadata();
      const width = meta.width ?? 0;
      const height = meta.height ?? 0;
      const left = plan.crop.left ?? 0;
      const top = plan.crop.top ?? 0;
      pipeline = pipeline.extract({
        left,
        top,
        width: width - left - (plan.crop.right ?? 0),
        height: height - top - (plan.crop.bottom ?? 0),
      });
    }

    const info = await pipeline
      .resize({ width: plan.width, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toFile(output);

    results.push(
      `  ✓ ${plan.out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`,
    );
  }

  return results;
}

async function buildBrandLogos() {
  const results = [];

  for (const [from, to] of Object.entries(brandLogos)) {
    const input = path.join(sourceDir, "logo", from);
    if (!existsSync(input)) {
      results.push(`  ! skipped ${to} — ${from} not found`);
      continue;
    }
    await copyFile(input, path.join(publicDir, to));
    results.push(`  ✓ ${to}`);
  }

  return results;
}

/**
 * Rebuild the client's logo as a transparent PNG by mapping each pixel's
 * brightest channel to its alpha. Black background → fully transparent,
 * white and red artwork → opaque. Only used on dark surfaces.
 */
async function buildTransparentLogo() {
  const input = path.join(sourceDir, "logo", "dila.png");
  if (!existsSync(input)) return ["  ! skipped dila-logo-light.png — dila.png not found"];

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const brightest = Math.max(r, g, b);
    // Ignore anything close to pure black, then ramp quickly to full opacity so
    // antialiased edges stay soft instead of turning grey.
    const alpha = brightest <= 12 ? 0 : Math.round(Math.min(255, (brightest - 12) * 1.08));
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = alpha;
  }

  const target = path.join(publicDir, "logo", "dila-logo-light.png");
  await mkdir(path.dirname(target), { recursive: true });

  const result = await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(target);

  return [
    `  ✓ logo/dila-logo-light.png  ${result.width}x${result.height}  ${Math.round(result.size / 1024)} KB`,
  ];
}

async function buildBrandPlaceholders() {
  const svg = placeholderSvg();
  const results = [];

  for (const slug of brandSlugs) {
    const target = path.join(publicDir, "brands", `${slug}-scooter.jpg`);
    const info = await sharp(svg)
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(target);
    results.push(
      `  ✓ brands/${slug}-scooter.jpg  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`,
    );
  }

  return results;
}

async function main() {
  await ensureDirs();

  console.log("Photos");
  console.log((await buildPhotos()).join("\n"));
  console.log("\nBrand card photos (placeholders)");
  console.log((await buildBrandPlaceholders()).join("\n"));
  console.log("\nBrand logos");
  console.log((await buildBrandLogos()).join("\n"));
  console.log("\nLogo artwork");
  console.log((await buildTransparentLogo()).join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
