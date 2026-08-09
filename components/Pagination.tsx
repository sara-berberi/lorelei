"use client";

/**
 * Pagination matching the rest of the site: flat, square, tracked-out
 * uppercase. Replaces the rounded/gradient/shadow treatment that looked
 * like it came from a different design system.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  labels,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels: { previous: string; next: string; page: string; of: string };
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let n = 1; n <= totalPages; n++) {
    const near = n >= currentPage - 1 && n <= currentPage + 1;
    if (n === 1 || n === totalPages || near) {
      pages.push(n);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const arrowCls =
    "px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase border transition-colors disabled:text-gray-300 disabled:border-gray-100 disabled:cursor-not-allowed text-gray-700 border-gray-200 hover:border-gray-900 hover:text-gray-900";

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 sm:mt-20 mb-12 pt-12 border-t border-gray-100"
    >
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={arrowCls}
        >
          <span className="hidden sm:inline">{labels.previous}</span>
          <span className="sm:hidden" aria-hidden>
            ←
          </span>
        </button>

        <div className="flex gap-1.5 mx-2">
          {pages.map((p, i) =>
            p === "…" ? (
              <span
                key={`gap-${i}`}
                className="w-9 h-9 flex items-center justify-center text-gray-300 text-xs"
              >
                ···
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={`w-9 h-9 text-xs font-light border transition-colors ${
                  p === currentPage
                    ? "bg-gray-900 text-white border-gray-900"
                    : "text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={arrowCls}
        >
          <span className="hidden sm:inline">{labels.next}</span>
          <span className="sm:hidden" aria-hidden>
            →
          </span>
        </button>
      </div>

      <p className="text-center mt-6 text-[10px] tracking-[0.2em] uppercase text-gray-400">
        {labels.page} {currentPage} {labels.of} {totalPages}
      </p>
    </nav>
  );
}
