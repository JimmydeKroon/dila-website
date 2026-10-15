import Image from "next/image";
import type { Dictionary, ImageRef } from "@dila/content";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

interface AboutBlockProps {
  dict: Dictionary;
  image: ImageRef;
}

export function AboutBlock({ dict, image }: AboutBlockProps) {
  return (
    <Section id="over-ons" tone="surface" aria-labelledby="about-title">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeading
              id="about-title"
              eyebrow={dict.about.eyebrow}
              title={dict.about.title}
            />
            <div className="mt-6 flex flex-col gap-4">
              {dict.about.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-base leading-relaxed text-ink-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal className="relative overflow-hidden rounded-2xl bg-surface-alt">
            <span className="block aspect-4/3 w-full">
              <Image
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1200}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover"
              />
            </span>
          </Reveal>
        </div>

        <Reveal as="ul" stagger className="mt-14 grid gap-4 sm:grid-cols-3">
          {dict.about.facts.map((fact) => (
            <li
              key={fact.title}
              className="flex gap-4 rounded-2xl border border-line bg-paper p-6"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                <Icon name={fact.icon} size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink-900">
                  {fact.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  {fact.body}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
