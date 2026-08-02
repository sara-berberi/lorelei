import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { cloudinaryUrl, buildSrcSet } from "@/lib/images";

interface Review {
  id: number;
  clientName: string | null;
  message: string | null;
  imageUrl: string | null;
}

/**
 * Returns null (not an empty array) when the reviews table isn't reachable —
 * that way a missing table hides the section entirely, while a reachable but
 * empty table still shows the heading.
 */
async function getReviews(): Promise<Review[] | null> {
  try {
    return await prisma.review.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: { id: true, clientName: true, message: true, imageUrl: true },
    });
  } catch {
    return null;
  }
}

export default async function ReviewsSection({
  /** The dedicated reviews page renders its own title, so it hides this one. */
  hideHeading = false,
}: {
  hideHeading?: boolean;
} = {}) {
  const t = await getTranslations("reviews");
  const reviews = await getReviews();

  // Table missing or unreachable — render nothing at all.
  if (reviews === null) return null;

  return (
    <section
      className={`py-24 ${
        hideHeading ? "bg-white" : "bg-[#FAF9F7] border-t border-gray-100"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {!hideHeading && (
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-4">
              {t("title")}
            </p>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900">
              {t("subtitle")}
            </h3>
          </div>
        )}

        {reviews.length === 0 && (
          <p className="text-center text-sm text-gray-400 font-light">
            {t("empty")}
          </p>
        )}

        {/* Masonry: CSS columns let bubbles and photos keep their natural
            heights and flow together like a wall of real messages. */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {reviews.map((review) => (
            <div key={review.id} className="break-inside-avoid mb-5">
              {review.imageUrl ? (
                <figure className="overflow-hidden bg-white border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cloudinaryUrl(review.imageUrl, { width: 600, crop: "limit" })}
                    srcSet={buildSrcSet(review.imageUrl, [300, 450, 600, 900])}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    alt={
                      review.clientName
                        ? `${t("reviewFrom")} ${review.clientName}`
                        : t("anonymousReview")
                    }
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto block"
                  />
                  {review.clientName && (
                    <figcaption className="px-4 py-3 text-[11px] tracking-wide text-gray-500 font-light border-t border-gray-50">
                      {review.clientName}
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div>
                  {/* iMessage-style bubble */}
                  <div className="relative bg-[#e9e9eb] text-gray-900 rounded-[1.25rem] px-4 py-3 inline-block max-w-full">
                    <p className="text-sm font-light leading-relaxed whitespace-pre-line break-words">
                      {review.message}
                    </p>
                    {/* Bubble tail */}
                    <span
                      aria-hidden
                      className="absolute -bottom-px -left-1 w-3 h-3 bg-[#e9e9eb]"
                      style={{
                        clipPath: "path('M12 12C6 12 2 8 0 0c0 6 0 12 0 12z')",
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 tracking-wide mt-2 ml-3 font-light">
                    {review.clientName || t("anonymous")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
