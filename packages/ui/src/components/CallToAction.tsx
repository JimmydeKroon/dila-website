import type { ReactNode } from "react";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { Section } from "./Section";

interface CallToActionProps {
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Extra content rendered under the buttons, e.g. an address line. */
  footnote?: ReactNode;
}

export function CallToAction({
  title,
  body,
  primary,
  secondary,
  footnote,
}: CallToActionProps) {
  return (
    <Section tone="ink" spacing="compact">
      <Container width="wide">
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-white/10 bg-ink-900 p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-300">
              {body}
            </p>
            {footnote ? (
              <p className="mt-4 text-sm text-ink-400">{footnote}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={primary.href}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
            >
              <Icon name="phone" size={18} />
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
