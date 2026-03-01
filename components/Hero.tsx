import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative min-h-[60vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Background Video (Bright, No Overlay) */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/dj6ono36y/video/upload/v1772361204/Heading_pldqks.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Content Container */}
      <div className="relative z-10 w-full flex justify-center px-6">
        {/* Glass Blur Card */}
        <div className="max-w-3xl text-center py-12 px-8 sm:px-12 bg-white/60 backdrop-blur-md rounded-xl shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-8 bg-gray-400"></div>
            <div className="mx-3 w-1 h-1 rounded-full bg-gray-500"></div>
            <div className="h-px w-8 bg-gray-400"></div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 leading-tight tracking-wide">
            {t("title")}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-light tracking-wide mb-10 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          <a
            href="#products"
            className="inline-flex items-center justify-center px-8 py-3 text-sm tracking-widest uppercase font-medium text-white bg-gray-900 hover:bg-gray-700 transition-all duration-300 ease-in-out"
          >
            {t("cta")}
          </a>

          <div className="flex items-center justify-center mt-12">
            <div className="h-px w-8 bg-gray-400"></div>
            <div className="mx-3 w-1 h-1 rounded-full bg-gray-500"></div>
            <div className="h-px w-8 bg-gray-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
