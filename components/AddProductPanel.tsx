"use client";

import { useState, useRef } from "react";

const CATEGORIES = [
  { value: "", label: "No category" },
  { value: "activewear", label: "Activewear" },
  { value: "sets", label: "Sets" },
  { value: "dresses", label: "Dresses" },
  { value: "coatsPuffers", label: "Coats & Puffers" },
  { value: "nightwear", label: "Nightwear" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

interface ImageEntry {
  id: string;
  type: "url" | "file";
  url: string;
  file?: File;
  uploading?: boolean;
  error?: string;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "lorelei_products");

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

function uid() {
  return Math.random().toString(36).slice(2);
}

// Shared styles
const inputCls =
  "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-700 transition-colors";

const labelCls =
  "block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2";

export default function AddProductPanel({
  adminPassword,
  onProductAdded,
}: {
  adminPassword: string;
  onProductAdded?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isOnSale, setIsOnSale] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [newUrlInput, setNewUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleSize = (size: string) =>
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

  const addImageUrl = () => {
    const url = newUrlInput.trim();
    if (!url) return;
    setImages((prev) => [...prev, { id: uid(), type: "url", url }]);
    setNewUrlInput("");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (fileInputRef.current) fileInputRef.current.value = "";

    const newEntries: ImageEntry[] = files.map((file) => ({
      id: uid(),
      type: "file",
      url: URL.createObjectURL(file),
      file,
      uploading: true,
    }));

    setImages((prev) => [...prev, ...newEntries]);

    for (const entry of newEntries) {
      try {
        const cloudUrl = await uploadToCloudinary(entry.file!);
        setImages((prev) =>
          prev.map((img) =>
            img.id === entry.id
              ? { ...img, url: cloudUrl, uploading: false, file: undefined }
              : img
          )
        );
      } catch (err: any) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === entry.id
              ? { ...img, uploading: false, error: err.message }
              : img
          )
        );
      }
    }
  };

  const removeImage = (id: string) =>
    setImages((prev) => prev.filter((img) => img.id !== id));

  const isUploading = images.some((img) => img.uploading);
  const hasUploadErrors = images.some((img) => img.error);

  const handleSubmit = async () => {
    setSubmitError("");

    if (!name.trim()) { setSubmitError("Product name is required."); return; }
    if (!price || isNaN(parseFloat(price))) { setSubmitError("A valid price is required."); return; }
    if (images.length === 0) { setSubmitError("Add at least one image."); return; }
    if (isUploading) { setSubmitError("Please wait for all images to finish uploading."); return; }
    if (hasUploadErrors) { setSubmitError("Some images failed to upload. Remove them and try again."); return; }

    const readyUrls = images.map((img) => img.url);
    const imageUrl = readyUrls.length === 1 ? readyUrls[0] : JSON.stringify(readyUrls);

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: adminPassword,
          name: name.trim(),
          description: description.trim() || null,
          price,
          salePrice: salePrice || null,
          isOnSale,
          isSoldOut,
          category: category || null,
          brand: brand.trim() || null,
          sizes: JSON.stringify(sizes),
          imageUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setSubmitError(err.error ?? "Failed to create product.");
        return;
      }

      setName(""); setDescription(""); setPrice(""); setSalePrice("");
      setIsOnSale(false); setIsSoldOut(false); setCategory(""); setBrand("");
      setSizes([]); setImages([]); setNewUrlInput("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      onProductAdded?.();
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="space-y-10">

        {/* ── Identity ─────────────────────────────────────────────────── */}
        <section className="space-y-7">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">Identity</p>
          <div>
            <label className={labelCls}>Product Name <span className="text-rose-400">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Floral Midi Dress"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Zara"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputCls} cursor-pointer`}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional…"
              className="w-full border border-gray-100 bg-white px-3 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-300 transition-colors resize-none font-light"
            />
          </div>
        </section>

        <div className="h-px bg-gray-100" />

        {/* ── Pricing ──────────────────────────────────────────────────── */}
        <section className="space-y-7">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">Pricing</p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className={labelCls}>Price (ALL) <span className="text-rose-400">*</span></label>
              <input
                type="number" min="0" step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Sale Price (ALL)</label>
              <input
                type="number" min="0" step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="—"
                className={inputCls}
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-8">
            {[
              { label: "On Sale", val: isOnSale, set: setIsOnSale },
              { label: "Sold Out", val: isSoldOut, set: setIsSoldOut },
            ].map(({ label, val, set }) => (
              <label key={label} className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => set(!val)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${val ? "bg-gray-900" : "bg-gray-200"}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${val ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-gray-600 font-light">{label}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="h-px bg-gray-100" />

        {/* ── Sizes ────────────────────────────────────────────────────── */}
        <section className="space-y-5">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">Sizes</p>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((size) => {
              const active = sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3.5 py-1.5 text-[11px] tracking-widest uppercase transition-all border ${
                    active
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-500"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {sizes.length > 0 && (
            <p className="text-[10px] text-gray-400 tracking-widest">
              {sizes.join("  ·  ")}
            </p>
          )}
        </section>

        <div className="h-px bg-gray-100" />

        {/* ── Photos ───────────────────────────────────────────────────── */}
        <section className="space-y-5">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">
            Photos <span className="text-rose-400">*</span>
          </p>

          {/* Image previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-2">
              {images.map((img, index) => (
                <div key={img.id} className="relative aspect-square overflow-hidden bg-gray-50 group">
                  <img
                    src={img.url}
                    alt={`Photo ${index + 1}`}
                    className={`w-full h-full object-cover transition-opacity ${img.uploading ? "opacity-40" : "opacity-100"}`}
                  />
                  {img.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 border border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                    </div>
                  )}
                  {img.error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                      <p className="text-[9px] text-red-400 text-center px-1">Failed</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 w-5 h-5 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-2.5 h-2.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* URL input */}
          <div className="flex gap-3 items-end">
            <input
              type="text"
              value={newUrlInput}
              onChange={(e) => setNewUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(); } }}
              placeholder="Paste image URL…"
              className="flex-1 border-0 border-b border-gray-200 bg-transparent px-0 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-700 transition-colors"
            />
            <button
              type="button"
              onClick={addImageUrl}
              disabled={!newUrlInput.trim()}
              className="text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 disabled:text-gray-300 transition-colors pb-2"
            >
              Add
            </button>
          </div>

          {/* File upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload-input"
            />
            <label
              htmlFor="photo-upload-input"
              className="flex items-center justify-center gap-3 w-full border border-dashed border-gray-200 py-6 cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 transition-all"
            >
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[11px] tracking-widest uppercase text-gray-400">
                Upload from device
              </span>
            </label>
            {(!CLOUD_NAME || !UPLOAD_PRESET) && (
              <p className="text-[10px] text-amber-500 mt-2 tracking-wide">
                Cloudinary not configured — file uploads unavailable.
              </p>
            )}
          </div>
        </section>

        <div className="h-px bg-gray-100" />

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <section className="space-y-4">
          {submitError && (
            <p className="text-[11px] text-rose-500 tracking-wide">{submitError}</p>
          )}
          {success && (
            <p className="text-[11px] text-emerald-600 tracking-wide">
              Product published successfully.
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting || isUploading}
            className="px-10 py-3 bg-gray-900 text-white text-[10px] tracking-[0.2em] uppercase font-light hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Publishing…" : "Publish Product"}
          </button>
        </section>

      </div>
    </div>
  );
}
