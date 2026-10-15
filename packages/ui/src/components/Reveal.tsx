"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /**
   * Stagger the direct children instead of animating the block as a whole.
   * Pass `as="ul"` and render the list items as direct children — a wrapper
   * `<div>` around a `<ul>` would leave the whole list as a single child and
   * nothing would stagger.
   */
  stagger?: boolean;
  /** `ul` exists so a card grid can be the animated element itself. */
  as?: "div" | "ul";
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Fades a block in as it scrolls into view.
 *
 * The hidden state is applied at runtime, never server-rendered. That matters:
 * if hydration fails — the silent failure mode this project has been bitten by
 * before — a server-rendered `opacity: 0` would leave whole sections blank with
 * no error anywhere. This way the worst case is "no animation".
 *
 * A layout effect is used so a block that is about to animate is hidden before
 * the browser paints, avoiding a visible flicker. Anything already on screen
 * when the page loads therefore settles immediately; only blocks that scroll
 * into view play the animation, which is the point.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  as = "div",
}: RevealProps) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "out" | "in">("idle");

  useIsomorphicLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (still || typeof IntersectionObserver === "undefined") {
      setState("in");
      return;
    }

    setState("out");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setState("in");
          observer.disconnect();
        }
      },
      // Fire a little before the block reaches the bottom edge, and not for
      // something that is only just peeking into the viewport.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // A callback ref typed for the wider union keeps this polymorphic without
  // casting the node to `any`.
  const setRef = (node: HTMLDivElement | HTMLUListElement | null) => {
    nodeRef.current = node;
  };

  // `idle` is simply the visible state; only `out` and `in` are styled.
  const attrs = stagger
    ? { "data-reveal-group": state }
    : { "data-reveal": state };

  if (as === "ul") {
    return (
      <ul ref={setRef} className={className} {...attrs}>
        {children}
      </ul>
    );
  }

  return (
    <div ref={setRef} className={className} {...attrs}>
      {children}
    </div>
  );
}
