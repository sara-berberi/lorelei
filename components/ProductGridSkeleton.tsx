/**
 * Placeholder cards shown while products load. Matching the real card's
 * 3/4 aspect ratio keeps the page height stable, so content doesn't jump
 * when the data arrives.
 */
export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="product-grid"
      aria-hidden
      style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] bg-gray-100 animate-shimmer" />
          <div className="mt-3 space-y-2">
            <div className="h-2 w-1/3 bg-gray-100 animate-shimmer" />
            <div className="h-2.5 w-4/5 bg-gray-100 animate-shimmer" />
            <div className="h-2.5 w-1/4 bg-gray-100 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
