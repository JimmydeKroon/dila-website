import Link from "next/link";
import { getDictionary } from "@dila/content";
import { Container, Icon, Section } from "@dila/ui";

export default function NotFound() {
  const dict = getDictionary("nl");

  return (
    <Section tone="surface" spacing="loose">
      <Container width="narrow" className="text-center">
        <p className="font-display text-5xl font-black text-accent">404</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink-900">
          {dict.notFound.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-600">
          {dict.notFound.body}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
        >
          <Icon name="arrowLeft" size={18} />
          {dict.notFound.cta}
        </Link>
      </Container>
    </Section>
  );
}
