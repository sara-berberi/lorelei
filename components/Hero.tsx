import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center bg-white">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-white"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 text-center">
        {/* Minimal decorative element */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-8 bg-gray-300"></div>
          <div className="mx-3 w-1 h-1 rounded-full bg-gray-400"></div>
          <div className="h-px w-8 bg-gray-300"></div>
        </div>

        {/* Main Heading - Clean and Refined */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 leading-tight tracking-wide">
          {t("title")}
        </h1>

        {/* Subtitle - Understated */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light tracking-wide mb-10 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>

        {/* Elegant CTA Button */}
        <a
          href="#products"
          className="inline-flex items-center justify-center px-8 py-3 text-sm tracking-widest uppercase font-medium text-gray-900 bg-white border border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 ease-in-out"
        >
          {t("cta")}
        </a>

        {/* Bottom decorative element */}
        <div className="flex items-center justify-center mt-12">
          <div className="h-px w-8 bg-gray-300"></div>
          <div className="mx-3 w-1 h-1 rounded-full bg-gray-400"></div>
          <div className="h-px w-8 bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
}
