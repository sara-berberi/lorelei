import { notFound } from "next/navigation";
import { getTranslations, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import LanguageToggle from "@/components/LanguageToggle";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const t = await getTranslations("common");
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CartProvider>
        <div className="min-h-screen bg-white">
          {/* Announcement bar */}
          <div className="bg-[#1a0a20] text-white text-center py-2 px-4">
            <p className="text-[11px] tracking-[0.25em] uppercase font-light text-white/80">
              {t("announcement-text")}
            </p>
          </div>

          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="flex justify-between items-center h-16 sm:h-20">

                {/* Left: hamburger + logo */}
                <div className="flex items-center gap-1">
                  <MobileMenu locale={locale} />
                  <Link href={`/${locale}`} className="flex items-center">
                    <img
                      src="https://res.cloudinary.com/dj6ono36y/image/upload/v1763922421/_979F0DC6-3FB1-4148-AF21-52C979B86FD4_-removebg-preview_bpaz6n.png"
                      alt="Lorelei Boutique"
                      className="w-14 h-14 sm:w-18 sm:h-18 object-contain"
                    />
                  </Link>
                </div>

                {/* Center: nav links (desktop) */}
                <nav className="hidden sm:flex items-center gap-8">
                  <Link href={`/${locale}`} className="text-[11px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors">
                    {t("home")}
                  </Link>
                  <Link href={`/${locale}#products`} className="text-[11px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors">
                    {t("products")}
                  </Link>
                  <Link href={`/${locale}/brands`} className="text-[11px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors">
                    {t("brands")}
                  </Link>
                  <Link href={`/${locale}/mystery-box`} className="text-[11px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors">
                    {t("mysteryBox")}
                  </Link>
                  <Link href={`/${locale}/special-prices`} className="text-[11px] tracking-[0.2em] uppercase text-rose-400 hover:text-rose-600 transition-colors">
                    {t("specialPrices")}
                  </Link>
                </nav>

                {/* Right: cart + language + admin */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <Link href={`/${locale}/admin`} className="hidden sm:block text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-900 transition-colors">
                    Admin
                  </Link>
                  <div className="w-px h-4 bg-gray-200 hidden sm:block" />
                  <CartButton />
                  <LanguageToggle currentLocale={locale} />
                </div>
              </div>
            </div>
          </header>

          <main>{children}</main>
          <CartDrawer />
          <WhatsAppButton floating />
        </div>
      </CartProvider>
    </NextIntlClientProvider>
  );
}
