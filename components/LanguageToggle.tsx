"use client";

import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageToggle({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Handle different pathname formats
    let newPathname: string;

    if (pathname.startsWith(`/${currentLocale}/`)) {
      // Path like /en/products -> /sq/products
      newPathname = pathname.replace(`/${currentLocale}/`, `/${newLocale}/`);
    } else if (pathname === `/${currentLocale}`) {
      // Path like /en -> /sq
      newPathname = `/${newLocale}`;
    } else if (pathname.startsWith(`/${currentLocale}`)) {
      // Fallback for any other format
      newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    } else {
      // If pathname doesn't start with locale, just prepend new locale
      newPathname = `/${newLocale}${pathname}`;
    }

    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchLocale("en")}
        type="button"
        className={`px-2 py-1 text-sm cursor-pointer transition-opacity ${
          currentLocale === "en"
            ? "font-bold opacity-100"
            : "opacity-60 hover:opacity-100"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("sq")}
        type="button"
        className={`px-2 py-1 text-sm cursor-pointer transition-opacity ${
          currentLocale === "sq"
            ? "font-bold opacity-100"
            : "opacity-60 hover:opacity-100"
        }`}
        aria-label="Switch to Albanian"
      >
        AL
      </button>
    </div>
  );
}
