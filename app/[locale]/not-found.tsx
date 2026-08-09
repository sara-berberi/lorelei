import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-white">
      <div className="text-center max-w-md">
        <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-6">
          {t("label")}
        </p>
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-gray-900 mb-5">
          404
        </h1>
        <p className="text-sm text-gray-500 font-light leading-relaxed mb-10">
          {t("message")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}`}
            className="px-8 py-3.5 bg-[#1a0a20] text-white text-[10px] tracking-[0.25em] uppercase font-light hover:bg-black transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}#products`}
            className="px-8 py-3.5 border border-gray-200 text-gray-600 text-[10px] tracking-[0.25em] uppercase font-light hover:border-gray-900 hover:text-gray-900 transition-colors"
          >
            {t("shop")}
          </Link>
        </div>
      </div>
    </div>
  );
}
