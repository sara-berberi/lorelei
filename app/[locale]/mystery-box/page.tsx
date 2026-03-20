import { getTranslations } from "next-intl/server";
import MysteryBoxGrid from "@/components/MysteryBoxGrid";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function MysteryBoxPage() {
  const mysteryBox = await getTranslations("mysteryBox");

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ── Hero / Promo ─────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-6">
                {mysteryBox("title")}
              </p>
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-6 leading-snug">
                {mysteryBox("subtitle")}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-8 font-light">
                {mysteryBox("description")}
              </p>
              <div className="flex gap-6 text-[10px] tracking-[0.25em] uppercase text-gray-400">
                <span>{mysteryBox("small")}</span>
                <span className="text-gray-200">·</span>
                <span>{mysteryBox("medium")}</span>
                <span className="text-gray-200">·</span>
                <span>{mysteryBox("big")}</span>
              </div>
            </div>

            {/* Video */}
            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
              <video
                className="w-full h-full object-cover"
                src="https://res.cloudinary.com/dj6ono36y/video/upload/v1772362407/Will_you_be_my_Valentine_aoky77.mp4"
                autoPlay loop muted playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Mystery Box Products ──────────────────────────────────────── */}
      <section className="bg-white">
        <MysteryBoxGrid />
      </section>

    </div>
  );
}
