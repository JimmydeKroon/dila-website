import Image from "next/image";
import Link from "next/link";
import { cn } from "../lib/cn";

interface LogoProps {
  /** Path inside `public` to the client's logo (already transparent). */
  src: string;
  /** Intrinsic logo size, so the browser reserves the right box. */
  width: number;
  height: number;
  /** Rendered height in px. The header and the footer size it differently. */
  size: number;
  /** Secondary line used for the accessible name, e.g. "Scooters en brommers". */
  strapline?: string;
  className?: string;
  href?: string;
  /** Load eagerly: the header logo is above the fold on every page. */
  priority?: boolean;
}

/**
 * The client's logo.
 *
 * It used to be a typographic lockup, because the only artwork we had was a
 * white-on-black square that could not sit on a light header. The current
 * `dila.png` is full colour with a transparent background and reads on both the
 * light bar and the hero photo, so the placeholder is gone — this component now
 * only wraps the image in the home link and gives it its height.
 *
 * The image is decorative (`alt=""`) and the link carries the label: a screen
 * reader should announce a destination, not the words printed in the artwork.
 */
export function Logo({
  src,
  width,
  height,
  size,
  strapline,
  className,
  href = "/",
  priority = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center rounded-md", className)}
      aria-label={strapline ? `Dila ${strapline} — naar de startpagina` : "Dila — naar de startpagina"}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        priority={priority}
        style={{ height: size, width: "auto" }}
        className="object-contain transition-opacity duration-300 group-hover:opacity-85"
      />
    </Link>
  );
}
