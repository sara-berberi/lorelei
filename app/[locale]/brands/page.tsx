import { getTranslations } from 'next-intl/server';
import BrandsList from '@/components/BrandsList';

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('brands');

  return (
    <div className="min-h-screen">
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-light text-center mb-8 sm:mb-12">
            {t('title')}
          </h1>
          <BrandsList locale={locale} />
        </div>
      </section>
    </div>
  );
}

