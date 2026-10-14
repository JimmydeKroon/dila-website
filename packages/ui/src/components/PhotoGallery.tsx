"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Dictionary, ImageRef } from "@dila/content";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";

interface PhotoGalleryProps {
  images: ImageRef[];
  dict: Dictionary;
  className?: string;
}

/**
 * Store-and-workshop photos. Opens in a lightweight lightbox so visitors can
 * actually see the place they are about to drive to. Escape closes, ← / → step
 * through the set, and the overlay is a native dialog-like element with a
 * focusable close button.
 */
export function PhotoGallery({ images, dict, className }: PhotoGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, step]);

  if (images.length === 0) return null;

  const active = index === null ? null : images[index];

  return (
    <>
      <ul
        className={cn(
          "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
          className,
        )}
      >
        {images.map((image, i) => (
          <li
            key={image.src}
            className="relative overflow-hidden rounded-xl bg-surface-alt"
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group block h-full w-full cursor-zoom-in"
              aria-label={`${dict.about.galleryTitle}: ${image.alt}`}
            >
              <span className="block aspect-4/3 w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={900}
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  style={image.focal ? { objectPosition: image.focal } : undefined}
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {isOpen && active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/92 p-4 sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={dict.nav.closeMenu}
            className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
          >
            <Icon name="close" size={20} />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Vorige foto"
                className="absolute left-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 sm:left-6"
              >
                <Icon name="arrowLeft" size={22} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Volgende foto"
                className="absolute right-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 sm:right-6"
              >
                <Icon name="arrowRight" size={22} />
              </button>
            </>
          ) : null}

          <figure
            className="flex max-h-full w-full max-w-5xl flex-col items-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              width={1920}
              height={1280}
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="max-h-[78vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="text-center text-sm text-ink-300">
              {active.alt}
              {images.length > 1 ? (
                <span className="ml-2 text-ink-500">
                  {(index ?? 0) + 1} / {images.length}
                </span>
              ) : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
