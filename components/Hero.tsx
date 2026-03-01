import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/dj6ono36y/video/upload/v1772361204/Heading_pldqks.mp4" // put your video in /public/videos
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Optional Dark Overlay (improves text readability) */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 text-center text-white">
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-8 bg-white/50"></div>
          <div className="mx-3 w-1 h-1 rounded-full bg-white/70"></div>
          <div className="h-px w-8 bg-white/50"></div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 leading-tight tracking-wide">
          {t("title")}
        </h1>

        <p className="text-base sm:text-lg md:text-xl font-light tracking-wide mb-10 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>

        <a
          href="#products"
          className="inline-flex items-center justify-center px-8 py-3 text-sm tracking-widest uppercase font-medium bg-white text-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
        >
          {t("cta")}
        </a>

        <div className="flex items-center justify-center mt-12">
          <div className="h-px w-8 bg-white/50"></div>
          <div className="mx-3 w-1 h-1 rounded-full bg-white/70"></div>
          <div className="h-px w-8 bg-white/50"></div>
        </div>
      </div>
    </section>
  );
}
