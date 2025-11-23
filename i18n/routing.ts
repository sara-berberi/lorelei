import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'sq'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

