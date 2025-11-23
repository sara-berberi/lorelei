import { getTranslations } from 'next-intl/server';
import ProductGrid from '@/components/ProductGrid';
import Hero from '@/components/Hero';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('hero');

  return (
    <div className="min-h-screen">
      <Hero />
      <section id="products" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-light text-center mb-8 sm:mb-12">
            {t('subtitle')}
          </h2>
          <ProductGrid />
        </div>
      </section>
    </div>
  );
}

