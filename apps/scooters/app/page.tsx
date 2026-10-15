import type { Metadata } from "next";
import { brands, getDictionary, scooters } from "@dila/content";
import { AboutBlock, BrandStrip, Hero, Icon } from "@dila/ui";
import { BrandsSection } from "@/components/BrandsSection";
import { MaintenanceSection } from "@/components/MaintenanceSection";
import { ShopGallerySection } from "@/components/ShopGallerySection";
import { aboutImage, heroImage } from "@/lib/content";

const dict = getDictionary("nl");

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero
        image={heroImage}
        eyebrow={`${scooters.groupName} · ${dict.hero.eyebrow}`}
        title={dict.hero.title}
        lead={dict.hero.lead}
        actions={
          <>
            <a
              href="#merken"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
            >
              {dict.hero.primaryCta}
              <Icon name="arrowRight" size={18} />
            </a>
            <a
              href="#onderhoud"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              {dict.hero.secondaryCta}
            </a>
          </>
        }
        bottom={
          <BrandStrip
            brands={brands}
            label={dict.hero.brandStripLabel}
            variant="dark"
          />
        }
      />

      <BrandsSection />
      <MaintenanceSection />
      <AboutBlock dict={dict} image={aboutImage} />
      <ShopGallerySection />
      {/*
        No contact section here. The contact details live in the footer at the
        foot of the layout, so every page — including this one and the brand
        detail pages — ends with the address, the opening hours and the logo.
      */}
    </>
  );
}
