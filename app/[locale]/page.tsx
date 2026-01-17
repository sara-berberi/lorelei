import { getTranslations } from "next-intl/server";
import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";

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
  const brandStatement = await getTranslations("brandStatement");
  const affordableFashion = await getTranslations("affordableFashion");
  const fastShipping = await getTranslations("fastShipping");
  const returnsAllowed = await getTranslations("returnsAllowed");
  const trustSection = await getTranslations("trustSection");
  const testimonials = await getTranslations("testimonials");
  const newsletter = await getTranslations("newsletter");
  const christmasCollection = await getTranslations("christmasCollection");

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Hero />

      {/* Subtle Brand Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-block">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-6"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
            {brandStatement("title")}
          </h2>
          <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            {brandStatement("description")}
          </p>
          <div className="inline-block">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mt-6"></div>
          </div>
        </div>
      </section>

      <section id="products" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Product grid */}
          <ProductGrid />
        </div>
      </section>

      {/* Premium Trust Indicators */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-6"></div>
            </div>
            <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              {trustSection("title")}
            </h3>
            <p className="text-gray-300 text-lg font-light max-w-2xl mx-auto">
              {trustSection("subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Affordable Fashion */}
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 h-full">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-white"
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
                </div>
                <h4 className="text-lg font-semibold uppercase tracking-wider mb-3 text-center">
                  {affordableFashion("title")}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed text-center font-light">
                  {affordableFashion("description")}
                </p>
              </div>
            </div>

            {/* Fast Shipping */}
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 h-full">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-white"
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
                </div>
                <h4 className="text-lg font-semibold uppercase tracking-wider mb-3 text-center">
                  {fastShipping("title")}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed text-center font-light">
                  {fastShipping("description")}
                </p>
              </div>
            </div>

            {/* Returns Allowed */}
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 h-full">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-white"
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
                </div>
                <h4 className="text-lg font-semibold uppercase tracking-wider mb-3 text-center">
                  {returnsAllowed("title")}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed text-center font-light">
                  {returnsAllowed("description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-6"></div>
            </div>
            <h3 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900 mb-4">
              {testimonials("title")}
            </h3>
            <p className="text-gray-600 text-lg font-light">
              {testimonials("subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="group">
              <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 border border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-pink-500 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed">
                  &ldquo;{testimonials("testimonial1.text")}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {testimonials("testimonial1.name").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonials("testimonial1.name")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonials("testimonial1.label")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group">
              <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 border border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-pink-500 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed">
                  &ldquo;{testimonials("testimonial2.text")}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {testimonials("testimonial2.name").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonials("testimonial2.name")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonials("testimonial2.label")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group">
              <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 border border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-pink-500 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed">
                  &ldquo;{testimonials("testimonial3.text")}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {testimonials("testimonial3.name").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonials("testimonial3.name")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonials("testimonial3.label")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-pink-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-block mb-6">
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
              </div>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                {newsletter("title")}
              </h3>
              <p className="text-gray-300 text-lg font-light mb-8 max-w-2xl mx-auto">
                {newsletter("subtitle")}
              </p>

              <form className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  placeholder={newsletter("placeholder")}
                  className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  {newsletter("button")}
                </button>
              </form>

              <p className="text-gray-400 text-sm mt-4">
                {newsletter("privacy")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Elevated Footer Section */}
      <footer className="py-16 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand Description */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-block mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">
              {footerT("brandName")}
            </h2>
            <p className="text-gray-600 leading-relaxed font-light">
              {footerT("brandDescription")}
            </p>
          </div>

          {/* Payment Notice */}
          <div className="text-center mb-14 py-8 border-y border-gray-200 bg-gradient-to-r from-transparent via-gray-50 to-transparent rounded-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg
                className="w-6 h-6 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <p className="text-gray-800 text-base font-medium">
                {footerT("paymentTitle")}
              </p>
            </div>
            <p className="text-gray-500 text-sm font-light">
              {footerT("paymentSubtitle")}
            </p>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="text-center mb-10">
              <div className="inline-block mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
              </div>
              <h3 className="text-2xl font-light tracking-tight text-gray-800">
                {footerT("faqTitle")}
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="group space-y-3 p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300">
                <h4 className="text-base font-semibold text-gray-800 flex items-start gap-2">
                  <span className="text-pink-500 mt-1 flex-shrink-0">•</span>
                  <span>{footerT("faq1Question")}</span>
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">
                  {footerT("faq1Answer")}
                </p>
              </div>

              <div className="group space-y-3 p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300">
                <h4 className="text-base font-semibold text-gray-800 flex items-start gap-2">
                  <span className="text-pink-500 mt-1 flex-shrink-0">•</span>
                  <span>{footerT("faq2Question")}</span>
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">
                  {footerT("faq2Answer")}
                </p>
              </div>

              <div className="group space-y-3 p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300">
                <h4 className="text-base font-semibold text-gray-800 flex items-start gap-2">
                  <span className="text-pink-500 mt-1 flex-shrink-0">•</span>
                  <span>{footerT("faq3Question")}</span>
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">
                  {footerT("faq3Answer")}
                </p>
              </div>

              <div className="group space-y-3 p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300">
                <h4 className="text-base font-semibold text-gray-800 flex items-start gap-2">
                  <span className="text-pink-500 mt-1 flex-shrink-0">•</span>
                  <span>{footerT("faq4Question")}</span>
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">
                  {footerT("faq4Answer")}
                </p>
              </div>

              <div className="group space-y-3 p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300">
                <h4 className="text-base font-semibold text-gray-800 flex items-start gap-2">
                  <span className="text-pink-500 mt-1 flex-shrink-0">•</span>
                  <span>{footerT("faq5Question")}</span>
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">
                  {footerT("faq5Answer")}
                </p>
              </div>

              <div className="group space-y-3 p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300">
                <h4 className="text-base font-semibold text-gray-800 flex items-start gap-2">
                  <span className="text-pink-500 mt-1 flex-shrink-0">•</span>
                  <span>{footerT("faq6Question")}</span>
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">
                  {footerT("faq6Answer")}
                </p>
              </div>
            </div>
          </div>

          {/* Social & Closing */}
          <div className="text-center space-y-6 pt-8 border-t border-gray-200">
            <div>
              <p className="text-gray-600 text-sm mb-3 font-light">
                {footerT("socialTitle")}
              </p>
              <a
                href="https://www.instagram.com/lorelei_boutique/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors text-base font-medium group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
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
