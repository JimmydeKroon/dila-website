import type { Metadata } from "next";
import { brands, getDictionary, scooters } from "@dila/content";
import { AboutBlock, BrandStrip, ContactBlock, Hero } from "@dila/ui";
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
        site={scooters}
        dict={dict}
        image={heroImage}
        primaryHref="#merken"
        brandStrip={
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
      <ContactBlock site={scooters} dict={dict} />
    </>
  );
}
