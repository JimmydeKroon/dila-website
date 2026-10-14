"use client";

import { useEffect, useState } from "react";
import type { Dictionary, SiteInfo } from "@dila/content";
import { cn } from "../lib/cn";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export interface NavItem {
  label: string;
  href: string;
}

interface SiteHeaderProps {
  site: SiteInfo;
  dict: Dictionary;
  navItems: NavItem[];
}

export function SiteHeader({ site, dict, navItems }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <Container width="wide">
        <div className="flex h-20 items-center justify-between gap-6">
          <Logo strapline={site.logoStrapline} />

          <nav aria-label="Hoofdmenu" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-md text-sm font-semibold text-ink-700 transition-colors hover:text-accent-strong"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Phone number intentionally lives in the footer only — the header
              keeps a single, quiet action: opening the menu. */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.menu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-ink-900 transition-colors hover:border-ink-300 hover:bg-surface lg:hidden"
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
        <Container width="wide">
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
          <div className="pb-5">
            <a
              href={site.phoneHref}
              className="flex items-center gap-3 rounded-xl bg-accent px-5 py-3.5 font-semibold text-accent-ink"
            >
              <Icon name="phone" size={18} />
              {site.phone}
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}
