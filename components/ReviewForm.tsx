"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const MAX_MESSAGE = 600;

/**
 * Public review submission form. Submissions are held for admin approval,
 * so the success state says so explicitly rather than implying the review
 * is already live.
 */
export default function ReviewForm() {
  const t = useTranslations("reviews");

  const [clientName, setClientName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 4) {
      setError(t("errorShort"));
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? t("errorGeneric"));
        return;
      }
      setClientName("");
      setMessage("");
      setDone(true);
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center border border-gray-100 bg-white px-8 py-10">
        <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-light text-gray-900 mb-2">{t("thanksTitle")}</p>
        <p className="text-xs text-gray-500 font-light leading-relaxed">
          {t("thanksPending")}
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="text-center">
        <button
          onClick={() => setOpen(true)}
          className="px-8 py-3.5 border border-gray-300 text-[10px] tracking-[0.25em] uppercase text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          {t("writeReview")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto border border-gray-100 bg-white px-7 py-8 space-y-6"
    >
      <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 text-center">
        {t("writeReview")}
      </p>

      <div>
        <label htmlFor="review-name" className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">
          {t("yourName")}
        </label>
        <input
          id="review-name"
          type="text"
          value={clientName}
          maxLength={60}
          onChange={(e) => setClientName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="review-message" className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">
          {t("yourReview")} <span className="text-rose-400">*</span>
        </label>
        <textarea
          id="review-message"
          rows={4}
          value={message}
          maxLength={MAX_MESSAGE}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          className="w-full border border-gray-100 bg-white px-3 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-300 transition-colors resize-none font-light"
        />
        <p className="text-[10px] text-gray-300 mt-1.5 text-right">
          {message.length}/{MAX_MESSAGE}
        </p>
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] w-px h-px overflow-hidden">
        <label htmlFor="review-website">Website</label>
        <input
          id="review-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {error && <p className="text-[11px] text-rose-500 tracking-wide">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-[#1a0a20] text-white py-3.5 text-[10px] tracking-[0.25em] uppercase font-light hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          {submitting ? t("sending") : t("submitReview")}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(""); }}
          className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-900 transition-colors"
        >
          {t("cancel")}
        </button>
      </div>

      <p className="text-[10px] text-gray-400 leading-relaxed text-center">
        {t("moderationNote")}
      </p>
    </form>
  );
}
