import { getTranslations } from "next-intl/server";
import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";
import RecentlyViewed from "@/components/RecentlyViewed";
import ReviewsSection from "@/components/ReviewsSection";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  await params;

  const footerT = await getTranslations("footer");

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Hero />

      {/* ── Products ─────────────────────────────────────────────────── */}
      <section id="products" className="bg-white">
        <ProductGrid />
      </section>

      <RecentlyViewed />

      {/* ── Client reviews ───────────────────────────────────────────── */}
      <ReviewsSection />

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100">
        {/* Brand + payment */}
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 text-center">
          <h2 className="text-sm font-light tracking-[0.2em] uppercase text-gray-700 mb-3">
            {footerT("brandName")}
          </h2>
          <p className="text-xs text-gray-400 font-light leading-relaxed max-w-sm mx-auto mb-10">
            {footerT("brandDescription")}
          </p>
          <div className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 border border-gray-100 px-4 py-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {footerT("paymentTitle")}
          </div>
        </div>

        {/* FAQ */}
        <div className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
            <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 text-center mb-12">
              {footerT("faqTitle")}
            </p>
            <div className="grid sm:grid-cols-2 gap-x-16 gap-y-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="border-t border-gray-100 pt-6">
                  <h4 className="text-xs font-medium text-gray-800 mb-2">{footerT(`faq${n}Question`)}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{footerT(`faq${n}Answer`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 font-light">{footerT("thankYou")}</p>
            <a
              href="https://www.instagram.com/lorelei_boutique/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @lorelei_boutique
            </a>
            <p className="text-[10px] text-gray-300">{footerT("copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
