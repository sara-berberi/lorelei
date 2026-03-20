import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/dj6ono36y/image/upload/v1/lorelei_hero/default";

async function getHeroImageUrl(): Promise<string> {
  try {
    const rows: any[] = await (prisma as any).$queryRaw`
      SELECT "heroImageUrl" FROM site_settings WHERE id = 1 LIMIT 1
    `;
    return rows?.[0]?.heroImageUrl || FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

export default async function Hero() {
  const t = await getTranslations("hero");
  const heroImageUrl = await getHeroImageUrl();

  return (
    <section className="relative h-[85vh] min-h-[560px] flex items-end overflow-hidden">
      {/* Background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroImageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-10 pb-16 sm:pb-20">
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/60 mb-4">
          Lorelei Boutique
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight mb-5 max-w-2xl">
          {t("title")}
        </h1>
        <p className="text-sm sm:text-base text-white/70 font-light tracking-wide mb-8 max-w-md leading-relaxed">
          {t("subtitle")}
        </p>
        <a
          href="#products"
          className="inline-block px-8 py-3 border border-white/50 text-white text-[11px] tracking-[0.25em] uppercase font-light hover:bg-white hover:text-gray-900 transition-all duration-300"
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
