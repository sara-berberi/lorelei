import { getTranslations } from "next-intl/server";
import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";
import MobileMenu from "@/components/MobileMenu";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("hero");
  const footerT = await getTranslations("footer");

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

      {/* Elevated Footer Section */}
      <footer className="py-16 bg-gradient-to-b from-pink-50 to-white border-t border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand Description */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">
              {footerT("brandName")}
            </h2>
            <p className="text-gray-600 leading-relaxed font-light">
              {footerT("brandDescription")}
            </p>
          </div>

          {/* Payment Notice */}
          <div className="text-center mb-14 py-6 border-y border-pink-200 bg-gradient-to-r from-transparent via-pink-50 to-transparent">
            <p className="text-gray-800 text-base font-medium">
              {footerT("paymentTitle")}
            </p>
            <p className="text-gray-500 text-sm mt-2 font-light">
              {footerT("paymentSubtitle")}
            </p>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-xl font-serif text-gray-800 text-center mb-8">
              {footerT("faqTitle")}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-pink-50 to-transparent hover:from-pink-100 transition-colors">
                <h4 className="text-base font-medium text-gray-800">
                  {footerT("faq1Question")}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {footerT("faq1Answer")}
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-pink-50 to-transparent hover:from-pink-100 transition-colors">
                <h4 className="text-base font-medium text-gray-800">
                  {footerT("faq2Question")}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {footerT("faq2Answer")}
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-pink-50 to-transparent hover:from-pink-100 transition-colors">
                <h4 className="text-base font-medium text-gray-800">
                  {footerT("faq3Question")}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {footerT("faq3Answer")}
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-pink-50 to-transparent hover:from-pink-100 transition-colors">
                <h4 className="text-base font-medium text-gray-800">
                  {footerT("faq4Question")}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {footerT("faq4Answer")}
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-pink-50 to-transparent hover:from-pink-100 transition-colors">
                <h4 className="text-base font-medium text-gray-800">
                  {footerT("faq5Question")}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {footerT("faq5Answer")}
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-pink-50 to-transparent hover:from-pink-100 transition-colors">
                <h4 className="text-base font-medium text-gray-800">
                  {footerT("faq6Question")}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {footerT("faq6Answer")}
                </p>
              </div>
            </div>
          </div>

          {/* Social & Closing */}
          <div className="text-center space-y-6 pt-8 border-t border-pink-100">
            <div>
              <p className="text-gray-600 text-sm mb-2">
                {footerT("socialTitle")}
              </p>
              <a
                href="https://www.instagram.com/lorelei_boutique/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors text-base font-medium"
              >
                @lorelei_boutique
              </a>
            </div>

            <p className="text-gray-700 font-light text-sm">
              {footerT("thankYou")}
            </p>

            <p className="text-gray-400 text-xs">{footerT("copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
