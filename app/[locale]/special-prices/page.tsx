import { getTranslations } from "next-intl/server";
import SaleGrid from "@/components/SaleGrid";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function SpecialPricesPage() {
  const t = await getTranslations("common");

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ── Top urgency bar ───────────────────────────────────────────── */}
      <div className="bg-rose-500 text-white text-center py-2.5 px-4">
        <p className="text-[10px] tracking-[0.3em] uppercase font-light">
          {t("specialPricesUrgency")}
        </p>
      </div>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="border-b border-rose-100 bg-[#fff8f8]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-14 sm:py-18">

          {/* Badge row */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-rose-500 text-white text-[9px] tracking-[0.3em] uppercase px-3 py-1.5">
              <span className="w-1 h-1 rounded-full bg-white/80 animate-pulse" />
              {t("onSaleBadge")}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-rose-300">— {t("specialPricesPricesReduced")}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12">
            <div>
              <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-gray-900 mb-2">
                {t("specialPrices")}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-px w-8 bg-rose-400" />
                <p className="text-[10px] tracking-[0.2em] uppercase text-rose-400">{t("specialPricesExclusiveDeals")}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 font-light sm:mb-1 max-w-xs leading-relaxed">
              {t("specialPricesSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Sale products ─────────────────────────────────────────────── */}
      <section className="bg-white">
        <SaleGrid />
      </section>

    </div>
  );
}
