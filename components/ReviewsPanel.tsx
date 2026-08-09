"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cloudinaryUrl } from "@/lib/images";

interface Review {
  id: number;
  clientName: string | null;
  message: string | null;
  imageUrl: string | null;
  isVisible: boolean;
  isApproved: boolean;
  sortOrder: number;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "lorelei_reviews");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "Upload failed");
  }
  const data = await res.json();
  return data.secure_url as string;
}

const inputCls =
  "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-700 transition-colors";

const labelCls =
  "block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2";

export default function ReviewsPanel({ adminPassword }: { adminPassword: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // New review form
  const [clientName, setClientName] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/reviews?password=${encodeURIComponent(adminPassword)}`
      );
      if (res.ok) setReviews(await res.json());
    } finally {
      setLoading(false);
    }
  }, [adminPassword]);

  useEffect(() => { load(); }, [load]);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";

    setUploading(true);
    setError("");
    try {
      setImageUrl(await uploadToCloudinary(file));
    } catch (err: any) {
      setError(err.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setClientName("");
    setMessage("");
    setImageUrl("");
    setError("");
  };

  const handleAdd = async () => {
    if (!message.trim() && !imageUrl) {
      setError("Add either a message or a photo.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: adminPassword,
          clientName,
          message,
          imageUrl,
          sortOrder: reviews.length,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error ?? "Failed to add review.");
        return;
      }
      resetForm();
      await load();
      flash("Review added.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const patchReview = async (review: Review, changes: Partial<Review>) => {
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: adminPassword, id: review.id, ...changes }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    }
  };

  const toggleVisible = (review: Review) =>
    patchReview(review, { isVisible: !review.isVisible });

  const approve = async (review: Review) => {
    await patchReview(review, { isApproved: true });
    flash("Review approved — it's now live.");
  };

  const handleDelete = async (review: Review) => {
    if (!confirm("Delete this review permanently?")) return;
    const res = await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: adminPassword, id: review.id }),
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      flash("Review deleted.");
    }
  };

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-5 h-5 border border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-12">
      {/* ── Add review ──────────────────────────────────────────────────── */}
      <section className="space-y-7">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">Add a review</p>

        <div>
          <label className={labelCls}>Client name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Leave empty for anonymous"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Message</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste the client's message…"
            disabled={!!imageUrl}
            className="w-full border border-gray-100 bg-white px-3 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-300 transition-colors resize-none font-light disabled:bg-gray-50 disabled:text-gray-300"
          />
          {imageUrl && (
            <p className="text-[10px] text-gray-400 mt-2 tracking-wide">
              A review is either a message or a photo — remove the photo to write a message.
            </p>
          )}
        </div>

        <div>
          <label className={labelCls}>Or a photo / screenshot</label>
          {imageUrl ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cloudinaryUrl(imageUrl, { width: 300, crop: "limit" })}
                alt="Review"
                className="max-h-48 w-auto border border-gray-100"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-1 right-1 w-6 h-6 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Remove photo"
              >
                <svg className="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
                id="review-upload"
                disabled={!!message.trim()}
              />
              <label
                htmlFor="review-upload"
                className={`flex items-center justify-center gap-3 w-full border border-dashed py-6 transition-all ${
                  message.trim()
                    ? "border-gray-100 cursor-not-allowed"
                    : "border-gray-200 cursor-pointer hover:border-gray-400 hover:bg-gray-50/50"
                }`}
              >
                <span className="text-[11px] tracking-widest uppercase text-gray-400">
                  {uploading ? "Uploading…" : message.trim() ? "Clear the message to add a photo" : "Upload screenshot"}
                </span>
              </label>
              {(!CLOUD_NAME || !UPLOAD_PRESET) && (
                <p className="text-[10px] text-amber-500 mt-2 tracking-wide">
                  Cloudinary not configured — uploads unavailable.
                </p>
              )}
            </>
          )}
        </div>

        {error && <p className="text-[11px] text-rose-500 tracking-wide">{error}</p>}
        {notice && <p className="text-[11px] text-emerald-600 tracking-wide">{notice}</p>}

        <button
          onClick={handleAdd}
          disabled={submitting || uploading}
          className="px-10 py-3 bg-gray-900 text-white text-[10px] tracking-[0.2em] uppercase font-light hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          {submitting ? "Adding…" : "Add Review"}
        </button>
      </section>

      <div className="h-px bg-gray-100" />

      {/* ── Existing reviews ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
          {pendingCount > 0 && (
            <span className="text-[9px] tracking-[0.15em] uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5">
              {pendingCount} awaiting approval
            </span>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-[11px] text-gray-400 font-light">
            No reviews yet. The section stays hidden on the homepage until you add one.
          </p>
        ) : (
          <div className="space-y-px">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`flex items-start gap-4 border bg-white px-4 py-3 ${
                  !review.isApproved
                    ? "border-amber-200 bg-amber-50/30"
                    : review.isVisible
                    ? "border-gray-100"
                    : "border-gray-100 opacity-50"
                }`}
              >
                {review.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cloudinaryUrl(review.imageUrl, { width: 120 })}
                    alt=""
                    loading="lazy"
                    className="w-12 h-12 object-cover bg-gray-50 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#e9e9eb] rounded-xl flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 font-light line-clamp-3">
                    {review.message || <span className="text-gray-400">Photo review</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-gray-400 tracking-wide">
                      {review.clientName || "Anonymous"}
                    </p>
                    {!review.isApproved && (
                      <span className="text-[9px] tracking-[0.15em] uppercase text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {!review.isApproved ? (
                    <button
                      onClick={() => approve(review)}
                      className="text-[10px] tracking-[0.18em] uppercase text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleVisible(review)}
                      className="text-[10px] tracking-[0.18em] uppercase text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {review.isVisible ? "Hide" : "Show"}
                    </button>
                  )}
                  <div className="w-px h-3 bg-gray-200" />
                  <button
                    onClick={() => handleDelete(review)}
                    className="text-gray-300 hover:text-rose-400 transition-colors"
                    aria-label="Delete review"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
