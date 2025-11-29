"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BrandsListProps {
  locale: string;
}

// Brand logo mapping - add your logo URLs here
const brandLogos: Record<string, string> = {
  Adidas:
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437033/Adidas_Logo_sy6wuz.svg",
  "H&M":
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764436726/H_M-Logo.svg_vlgmfc.png",
  Loavies:
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437053/loavies_ntdkjm.png",
  "Traffic People":
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437064/traffic_people_1200x1200_zonzyy.webp",
  Body: "",
  Lascana:
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437635/Lascana_Logo_300x150_tfutiy.png",
  MyProtein:
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437728/images_gyvwbk.png",
  Morgan:
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437693/Logo_morgan_de_toi_site_web_zyfkt1.jpg",
  WalG: "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437728/images_gyvwbk.png",
  "NA-KD":
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437880/na-kd-vector-logo_yfp9rl.png",
  "Tally Weijl":
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437812/TALLY_WEiJL_Logo.svg_mwochb.png",
  Coast:
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437816/ios-icon-4P246SHV_c5iwzq.png",
  "Karen Millen":
    "https://res.cloudinary.com/dj6ono36y/image/upload/v1764437175/Karen_millen_fashion_logo_enlkay.png",
};

export default function BrandsList({ locale }: BrandsListProps) {
  const t = useTranslations("brands");
  const router = useRouter();
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const data = await res.json();
          setBrands(data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="text-gray-400 text-sm tracking-wider uppercase font-light">
          {t("noBrands")}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
        {brands.map((brand) => (
          <Link
            key={brand}
            href={`/${locale}#products`}
            onClick={() => {
              // Store brand filter in sessionStorage to apply when navigating to products
              sessionStorage.setItem("selectedBrand", brand);
              // Scroll to products section
              setTimeout(() => {
                const productsSection = document.getElementById("products");
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: "smooth" });
                }
              }, 100);
            }}
            className="group relative bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden brand-card"
          >
            {/* Logo Container */}
            <div className="aspect-square flex items-center justify-center p-8 bg-white">
              {brandLogos[brand] ? (
                <img
                  src={brandLogos[brand]}
                  alt={brand}
                  className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                /* Fallback: Brand name in elegant typography */
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-light tracking-tight text-gray-800 group-hover:text-black transition-colors">
                    {brand}
                  </h3>
                </div>
              )}
            </div>

            {/* Bottom Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs text-center text-gray-600 uppercase tracking-widest font-light">
                {t("viewProducts")}
              </p>
            </div>

            {/* Hover Overlay Effect */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .brand-card {
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .brand-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        /* Grayscale to color transition for luxury feel */
        .brand-card img {
          transition: filter 0.4s ease;
        }
      `}</style>
    </>
  );
}
