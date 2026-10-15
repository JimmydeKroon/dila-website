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
 *  - Brand photos and the gallery pool are **Unsplash placeholders** (see
 *    `brandPhotos` / `galleryPhotos` below) and must be replaced by the
 *    client's own product shots. If a source file is missing, brand cards fall
 *    back to a generated "FOTO VOLGT" tile so the grid never looks broken.
 *  - The supplied logo (`assets/logo/dila.png`) already carries a transparent
 *    background, so the only thing `dila-logo.png` needs is a trim of its empty
 *    border and a resize. The same file is used on the light header and the
 *    dark footer because the artwork reads on both. The client's own file is
 *    left untouched.
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
 * Brand photos — used both on the home-page cards and as the brand-page hero.
 *
 * PLACEHOLDERS: these are Unsplash photos (Unsplash License: free for
 * commercial use, no attribution required, modification allowed) chosen as
 * stand-ins until the client supplies real product shots. They are deliberately
 * **not** brand-authentic, so they must not survive the first content review.
 *
 * Replace `assets/brand-photos/<slug>.jpg` with the real photo — same filename,
 * no code change. A missing source falls back to the generated placeholder.
 */
const brandPhotos = ["vespa", "kymco", "derbi", "yamaha", "peugeot"];

/**
 * Gallery pool for the brand-page mosaic. Same placeholder caveat as above.
 * Replace `assets/gallery/gallery-NN.jpg` with the real photos.
 */
const galleryPhotos = [
  "gallery-01",
  "gallery-02",
  "gallery-03",
  "gallery-04",
  "gallery-05",
  "gallery-06",
  "gallery-07",
  "gallery-08",
];

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
  for (const dir of ["shop", "workshop", "about", "hero", "brands", "gallery"]) {
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
 * The client's logo, web-ready.
 *
 * `dila.png` is a square PNG whose background is already transparent, so there
 * is no chroma-keying to do — it only needs the empty border trimmed (the
 * artwork sits inside ~4% padding) and a resize. Output is a square-ish PNG at
 * 640px, enough for the 52px header lockup at 3x DPR and the 88px footer mark.
 *
 * Because the artwork is full colour — a white/black/red wordmark — the same
 * file works over the hero photo, on the light header bar and on the dark
 * footer. There is no separate light-on-dark variant any more.
 */
async function buildSiteLogo() {
  const input = path.join(sourceDir, "logo", "dila.png");
  if (!existsSync(input)) return ["  ! skipped logo/dila-logo.png — dila.png not found"];

  const target = path.join(publicDir, "logo", "dila-logo.png");
  await mkdir(path.dirname(target), { recursive: true });

  const result = await sharp(input)
    // `trim` drops the fully transparent border, so the rendered logo fills the
    // box its height is set to instead of floating inside invisible padding.
    .trim({ threshold: 8 })
    .resize({ width: 640, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(target);

  return [
    `  ✓ logo/dila-logo.png  ${result.width}x${result.height}  ${Math.round(result.size / 1024)} KB`,
  ];
}

/**
 * Brand photos: 16:10, the ratio used by both the card image and the brand
 * hero. Sourced from `assets/brand-photos/<slug>.jpg`, or generated when the
 * client's real photo has not arrived yet.
 */
async function buildBrandPhotos() {
  const svg = placeholderSvg();
  const results = [];

  for (const slug of brandPhotos) {
    const target = path.join(publicDir, "brands", `${slug}-scooter.jpg`);
    const source = path.join(sourceDir, "brand-photos", `${slug}.jpg`);

    if (!existsSync(source)) {
      const info = await sharp(svg)
        .jpeg({ quality: 82, mozjpeg: true, progressive: true })
        .toFile(target);
      results.push(
        `  ! brands/${slug}-scooter.jpg  placeholder  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`,
      );
      continue;
    }

    const info = await sharp(source)
      .resize({ width: 1800, height: 1125, fit: "cover", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toFile(target);

    results.push(
      `  ✓ brands/${slug}-scooter.jpg  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`,
    );
  }

  return results;
}

/** Gallery pool for the brand-page mosaic: 4:3, cropped centrally. */
async function buildGalleryPool() {
  const results = [];
  const sourceGallery = path.join(sourceDir, "gallery");

  for (const name of galleryPhotos) {
    const source = path.join(sourceGallery, `${name}.jpg`);
    if (!existsSync(source)) {
      results.push(`  ! skipped gallery/${name}.jpg — source not found`);
      continue;
    }

    const info = await sharp(source)
      .resize({ width: 1400, height: 1050, fit: "cover", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toFile(path.join(publicDir, "gallery", `${name}.jpg`));

    results.push(
      `  ✓ gallery/${name}.jpg  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`,
    );
  }

  return results;
}

async function main() {
  await ensureDirs();

  console.log("Photos");
  console.log((await buildPhotos()).join("\n"));
  console.log("\nBrand photos");
  console.log((await buildBrandPhotos()).join("\n"));
  console.log("\nGallery pool (brand pages)");
  console.log((await buildGalleryPool()).join("\n"));
  console.log("\nBrand logos");
  console.log((await buildBrandLogos()).join("\n"));
  console.log("\nLogo artwork");
  console.log((await buildSiteLogo()).join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
