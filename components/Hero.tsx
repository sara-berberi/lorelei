import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Luxurious gradient background with texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        {/* Subtle overlay pattern for texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(219, 39, 119, 0.08) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>

      {/* Elegant gradient orbs for depth */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/40 to-rose-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/40 to-pink-300/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-24 lg:py-32 text-center">
        {/* Decorative line above */}
        <div className="flex items-center justify-center mb-8 sm:mb-10">
          <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-rose-400"></div>
          <div className="mx-4 w-1.5 h-1.5 rounded-full bg-rose-400"></div>
          <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-rose-400"></div>
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-6 sm:mb-8 leading-tight tracking-wide">
          <span className="block mb-2 bg-gradient-to-r from-rose-700 via-pink-600 to-purple-700 bg-clip-text text-transparent">
            {t("title")}
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-700 tracking-wider mt-4">
            {t("subtitle")}
          </span>
        </h1>

        {/* Premium CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#products"
            className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 overflow-hidden font-medium tracking-wider transition-all duration-500 ease-out bg-gradient-to-r from-rose-600 to-pink-600 rounded-full shadow-lg hover:shadow-2xl"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative text-white text-sm sm:text-base uppercase tracking-widest">
              {t("cta")}
            </span>
          </a>
        </div>

        {/* Decorative line below */}
        <div className="flex items-center justify-center mt-12 sm:mt-16">
          <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-rose-400"></div>
          <div className="mx-4 w-1.5 h-1.5 rounded-full bg-rose-400"></div>
          <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-rose-400"></div>
        </div>
      </div>

      {/* Bottom fade overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
