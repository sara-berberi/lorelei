import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  // latin-ext covers the Albanian ë / ç glyphs.
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

// Must be an absolute URL for metadataBase / OG image resolution. Vercel
// exposes VERCEL_URL without a scheme, so it's normalised here.
const SITE_URL = (() => {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  const withScheme = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withScheme).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
})();

const DESCRIPTION =
  "Curated women's fashion delivered across Albania. Dresses, tops, coats and more — cash on delivery, free shipping over 6000 ALL.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lorelei Boutique — Curated Women's Fashion",
    template: "%s · Lorelei Boutique",
  },
  description: DESCRIPTION,
  keywords: [
    "Lorelei Boutique",
    "women's fashion Albania",
    "online boutique Tirana",
    "veshje femrash",
    "dyqan online Shqipëri",
  ],
  openGraph: {
    title: "Lorelei Boutique — Curated Women's Fashion",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Lorelei Boutique",
    type: "website",
    locale: "sq_AL",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Lorelei Boutique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorelei Boutique — Curated Women's Fashion",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `lang` is corrected per-locale by a small script in app/[locale]/layout.tsx,
  // since the locale isn't known at this level.
  return (
    <html lang="sq" className={inter.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
