"use client";

import { useState, useRef, useEffect } from "react";

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

const inputCls =
  "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-700 transition-colors";
const labelCls = "block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2";

export default function HeroPanel({ adminPassword }: { adminPassword: string }) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings", {
      headers: { "x-admin-password": adminPassword },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.heroImageUrl) {
          setCurrentUrl(d.heroImageUrl);
          setUrlInput(d.heroImageUrl);
        }
      })
      .catch(() => {});
  }, [adminPassword]);

  const save = async (imageUrl: string) => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword, heroImageUrl: imageUrl }),
      });
      if (!res.ok) throw new Error("Save failed");
      setCurrentUrl(imageUrl);
      setUrlInput(imageUrl);
      setStatus({ type: "success", msg: "Hero image updated. Redeploy or hard-refresh to see changes." });
    } catch {
      setStatus({ type: "error", msg: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const url = await uploadToCloudinary(file);
      await save(url);
    } catch (err) {
      setStatus({ type: "error", msg: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleUrlSave = () => {
    if (!urlInput.trim()) return;
    save(urlInput.trim());
  };

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h2 className="text-sm font-light tracking-widest uppercase text-gray-700 mb-1">Hero Background</h2>
        <p className="text-xs text-gray-400 tracking-wide">
          Upload a new photo or paste a direct image URL. Changes go live on next page load.
        </p>
      </div>

      {/* Current preview */}
      {currentUrl && (
        <div>
          <p className={labelCls}>Current Image</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt="Hero preview"
            className="w-full h-48 object-cover border border-gray-100"
          />
        </div>
      )}

      {/* Upload from device */}
      <div>
        <p className={labelCls}>Upload from device</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || saving}
          className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:tracking-widest file:uppercase file:bg-gray-900 file:text-white hover:file:bg-black file:cursor-pointer disabled:opacity-40"
        />
        {uploading && (
          <p className="text-[11px] text-gray-400 mt-2 tracking-wide">Uploading…</p>
        )}
      </div>

      {/* Or paste a URL */}
      <div>
        <p className={labelCls}>Or paste image URL</p>
        <div className="flex gap-3 items-end">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            disabled={saving || uploading}
            className={inputCls + " flex-1"}
          />
          <button
            onClick={handleUrlSave}
            disabled={!urlInput.trim() || saving || uploading}
            className="pb-2.5 text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-30"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {status && (
        <p className={`text-[11px] tracking-wide ${status.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {status.msg}
        </p>
      )}
    </div>
  );
}
