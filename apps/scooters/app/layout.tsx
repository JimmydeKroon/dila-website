import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { brands, getDictionary, scooters } from "@dila/content";
import { SiteFooter, SiteHeader } from "@dila/ui";
import { footerLogo, navItems } from "@/lib/content";
import { localBusinessJsonLd } from "@/lib/structured-data";
import "./globals.css";

/**
 * Archivo carries the type: heavy and slightly industrial, which matches the
 * slab styling of the client's logo. Inter handles body copy.
 */
const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dict = getDictionary("nl");

export const metadata: Metadata = {
  metadataBase: new URL(scooters.url),
  title: {
    default: `${scooters.name} — ${scooters.tagline}`,
    template: `%s | ${scooters.name}`,
  },
  description: scooters.description,
  applicationName: scooters.name,
  keywords: [
    "scooter",
    "brommer",
    "motor",
    "Purmerend",
    "onderhoud",
    "reparatie",
    ...brands.map((brand) => brand.name),
  ],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: scooters.name,
    title: `${scooters.name} — ${scooters.tagline}`,
    description: scooters.description,
    url: scooters.url,
    images: [
      {
        url: "/images/hero/hero-shop.jpg",
        width: 2000,
        height: 1150,
        alt: scooters.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${scooters.name} — ${scooters.tagline}`,
    description: scooters.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#d81f26",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={dict.htmlLang}
      data-shop={scooters.theme}
      className={`${archivo.variable} ${inter.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#inhoud"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          {dict.nav.skipToContent}
        </a>

        <SiteHeader site={scooters} dict={dict} navItems={navItems} />

        <main id="inhoud" className="flex-1">
          {children}
        </main>

        <SiteFooter
          site={scooters}
          dict={dict}
          navItems={navItems}
          logoSrc={footerLogo.src}
          logoWidth={footerLogo.width}
          logoHeight={footerLogo.height}
        />

        <script
          type="application/ld+json"
          // JSON.stringify output is safe here: it is our own static config.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </body>
    </html>
  );
}
