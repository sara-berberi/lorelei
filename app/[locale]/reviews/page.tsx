import { getTranslations } from "next-intl/server";
import ReviewsSection from "@/components/ReviewsSection";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function ReviewsPage() {
  const t = await getTranslations("reviews");

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 sm:pt-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-4">
            {t("title")}
          </p>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900">
            {t("subtitle")}
          </h1>
        </div>
      </section>

      {/* The section renders its own heading on the homepage, so hide it here. */}
      <ReviewsSection hideHeading />
    </div>
  );
}
