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
  const affordableFashion = await getTranslations("affordableFashion");
  const fastShipping = await getTranslations("fastShipping");
  const returnsAllowed = await getTranslations("returnsAllowed");
  const christmasCollection = await getTranslations("christmasCollection");

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Hero />

      {/* Christmas & NYE Collection Banner */}
      <section className="relative w-full bg-gradient-to-br from-red-900 via-red-800 to-black overflow-hidden">
        {/* Sparkle decorations */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-8 left-12 w-1 h-1 bg-yellow-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-6 right-6 w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-12 right-16 w-1 h-1 bg-yellow-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-8 right-10 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>

        {/* Gold shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-600/10 to-transparent opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-white space-y-6 z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {christmasCollection("title")}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-100 leading-relaxed">
                {christmasCollection("description")}
              </p>
              <p className="text-sm sm:text-base text-yellow-200 italic font-light">
                {christmasCollection("tagline")}
              </p>
              <a
                href="#products"
                className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {christmasCollection("button")}
              </a>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://res.cloudinary.com/dj6ono36y/image/upload/v1765025542/bb3a254f-4387-492b-9890-0eb65c653cf9.png" // <-- your image link here
                alt="Festive Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-red-900/40 to-black/60 flex items-center justify-center">
                <div className="text-center text-white/80 space-y-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Product grid */}
          <ProductGrid />
        </div>
      </section>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Affordable Fashion */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              {affordableFashion("title")}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {affordableFashion("description")}
            </p>
          </div>

          {/* Fast Shipping */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              {fastShipping("title")}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {fastShipping("description")}
            </p>
          </div>

          {/* Returns Allowed */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              {returnsAllowed("title")}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {returnsAllowed("description")}
            </p>
          </div>
        </div>
      </div>

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
