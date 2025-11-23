'use client';

import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light tracking-wide mb-3 sm:mb-4">
          {t('title')}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light px-2">
          {t('subtitle')}
        </p>
      </div>
    </section>
  );
}

