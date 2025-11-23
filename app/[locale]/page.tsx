import { getTranslations } from "next-intl/server";
import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("hero");

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Hero />
      <section className="py-6 rounded-lg mt-2 text-center max-w-4xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-semibold text-pink-700">
          {t("salesAnnounce")}
        </h3>
        <p className="text-pink-600 font-light mt-2">
          {t("salesAnnounceSubtitle")}
        </p>
      </section>
      <section id="products" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Product grid */}
          <ProductGrid />
        </div>
      </section>
      <section className="py-12 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Payment info */}
          <p className="text-gray-700 text-lg font-light"></p>

          {/* Instagram link */}
          <p className="text-gray-600">
            {t("followInstagram")}{" "}
            <a
              href="https://www.instagram.com/lorelei_boutique/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline"
            >
              {/* <FaInstagramSquare className="w-5 h-5" /> */}
              @lorelei_boutique
            </a>
          </p>

          {/* Thank you note */}
          <p className="text-gray-700 font-light">{t("thankYou")}</p>

          {/* Rights info */}
          <p className="text-gray-500 text-sm">{t("rightsInfo")}</p>
        </div>
      </section>
    </div>
  );
}
