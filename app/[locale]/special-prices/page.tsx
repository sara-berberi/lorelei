import { getTranslations } from "next-intl/server";
import SaleGrid from "@/components/SaleGrid";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function SpecialPricesPage() {
  const t = await getTranslations("common");

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ── Header banner ─────────────────────────────────────────────── */}
      <div className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 sm:py-20 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="text-[9px] tracking-[0.35em] uppercase text-rose-400">{t("onSaleBadge")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900">
              {t("specialPrices")}
            </h1>
          </div>
          <p className="text-sm text-gray-400 font-light sm:mb-1 max-w-xs leading-relaxed">
            {t("specialPricesSubtitle")}
          </p>
        </div>
      </div>

      {/* ── Sale products ─────────────────────────────────────────────── */}
      <section className="bg-white">
        <SaleGrid />
      </section>

    </div>
  );
}
