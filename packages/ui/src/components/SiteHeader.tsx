"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Dictionary, SiteInfo } from "@dila/content";
import { cn } from "../lib/cn";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export interface NavItem {
  label: string;
  href: string;
}

/** A layout effect on the client, a no-op during server rendering. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

interface SiteHeaderProps {
  site: SiteInfo;
  dict: Dictionary;
  navItems: NavItem[];
  /** The client's logo. Full colour with a transparent background, so the same
   *  file works over the hero and on the paper bar. */
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  /** Rendered logo height in px — the bar is `h-20`, so keep it well inside. */
  logoSize?: number;
}

/**
 * The header is fixed and starts out transparent, so the hero photo runs to the
 * very top of the window and through the menu bar — the reason the hero no
 * longer needs a white strip above it.
 *
 * Two consequences are deliberate:
 *   - the bar is only transparent over a photo. It needs the page's first block
 *     to carry `data-hero` (as `Hero` does), the page to be at the top, and the
 *     mobile menu to be closed — the menu panel is white. Anything else gives
 *     the paper bar the nav needs to stay legible over body copy and on the 404,
 *     which has no hero at all.
 *   - because it is out of the flow, the page content has to make room for it.
 *     The layout gives `main` a top padding of one header height and the hero
 *     pulls itself back up by the same amount; see layout.tsx and Hero.tsx.
 *
 * `main` carries the padding rather than the body so a page without a hero (the
 * 404) still starts below the bar.
 */
export function SiteHeader({
  site,
  dict,
  navItems,
  logoSrc,
  logoWidth,
  logoHeight,
  logoSize = 52,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [startsOnPhoto, setStartsOnPhoto] = useState(true);

  // Close the mobile panel on Escape and whenever the viewport grows past the
  // breakpoint where the inline nav takes over.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Checked once on mount as well, so a page opened on an anchor (#onderhoud)
  // does not start with a transparent bar over a section of body copy.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  //
  // The overlay only works where there is a photo behind the bar. Asking the
  // rendered page, rather than the route, is what keeps this honest: a page
  // whose first block is a hero may go transparent, and every other page — the
  // 404 is the one that exists today — gets the solid bar, so the white nav can
  // never end up on a light background. A layout effect means the correction
  // happens before the browser paints, including after a client-side navigation
  // from a hero page to a page without one.
  //
  useIsomorphicLayoutEffect(() => {
    const first = document.querySelector("main > *:first-child");
    setStartsOnPhoto(Boolean(first?.hasAttribute("data-hero")));
  }, [pathname]);

  const overHero = startsOnPhoto && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line bg-paper/90 backdrop-blur-md",
      )}
    >
      <Container width="full">
        <div className="flex h-20 items-center justify-between gap-6">
          <Logo
            src={logoSrc}
            width={logoWidth}
            height={logoHeight}
            size={logoSize}
            strapline={site.logoStrapline}
            priority
          />

          <nav aria-label="Hoofdmenu" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      "rounded-md text-sm font-semibold transition-colors",
                      overHero
                        ? "text-white/85 hover:text-white"
                        : "text-ink-700 hover:text-accent-strong",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* The header keeps a single, quiet action on small screens: opening
              the menu. Contact details are not repeated here. */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.menu}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden",
              overHero
                ? "border-white/40 text-white hover:bg-white/10"
                : "border-ink-200 text-ink-900 hover:border-ink-300 hover:bg-surface",
            )}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
          </button>
        </div>
      </Container>

      {/*
        Kept mounted and toggled with `hidden` so the state survives, but note
        `hidden` is a plain attribute here — `lg:hidden` is a *media query* and
        would otherwise fight it. Only the utility that shows the panel at the
        right breakpoint is applied.
      */}
      <div
        id="mobile-menu"
        hidden={!open}
        data-open={open ? "true" : "false"}
        className={cn(
          "border-t border-line bg-paper shadow-lg shadow-ink-950/5",
          "lg:hidden",
        )}
      >
        <Container width="full">
          <ul className="flex flex-col py-1">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-line last:border-0">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-lg font-bold text-ink-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {/*
            No call-to-action here. Phone numbers live in the footer and in the
            maintenance section only, so the menu stays a navigation menu rather
            than a second invitation to phone.
          */}
        </Container>
      </div>
    </header>
  );
}
