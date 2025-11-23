import { notFound } from 'next/navigation';
import { getTranslations, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import LanguageToggle from '@/components/LanguageToggle';
import CartButton from '@/components/CartButton';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/contexts/CartContext';
import Link from 'next/link';

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

  const t = await getTranslations('common');
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CartProvider>
        <div className="min-h-screen bg-white">
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
              <div className="flex justify-between items-center h-14 sm:h-16">
                <Link href={`/${locale}`} className="text-lg sm:text-2xl font-light tracking-wider">
                  Lorelei Boutique
                </Link>
                <div className="flex items-center gap-3 sm:gap-6 relative z-10">
                  <Link href={`/${locale}`} className="text-xs sm:text-sm font-medium hover:text-gray-600 hidden sm:block">
                    {t('home')}
                  </Link>
                  <Link href={`/${locale}#products`} className="text-xs sm:text-sm font-medium hover:text-gray-600 hidden sm:block">
                    {t('products')}
                  </Link>
                  <CartButton />
                  <div className="relative z-20">
                    <LanguageToggle currentLocale={locale} />
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <CartDrawer />
        </div>
      </CartProvider>
    </NextIntlClientProvider>
  );
}

