"use client";

import { useEffect, useState, useCallback } from "react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  sizes: string | null;
  category: string | null;
  brand: string | null;
  isSoldOut: boolean;
  isOnSale: boolean;
  stock: number | null;
  deletedAt: string | null;
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size", "32", "34", "36", "38", "40", "42", "44", "46"];

interface EditState {
  price: string;
  salePrice: string;
  isOnSale: boolean;
  isSoldOut: boolean;
  description: string;
  sizes: string[];
  images: string[];
  stock: string;
}

function parseImages(imageUrl: string): string[] {
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [imageUrl];
}

function parseSizes(sizes: string | null): string[] {
  if (!sizes) return [];
  try {
    const parsed = JSON.parse(sizes);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

// ── Shared input styles ────────────────────────────────────────────────────
const inputCls =
  "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-700 transition-colors";

const labelCls =
  "block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2";

export default function AdminProductsPanel({
  adminPassword,
}: {
  adminPassword: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [activeRes, deletedRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/products?deleted=true"),
      ]);
      const active: Product[] = activeRes.ok ? await activeRes.json() : [];
      const deleted: Product[] = deletedRes.ok ? await deletedRes.json() : [];
      setProducts([...active, ...deleted]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const activeProducts = products.filter((p) => !p.deletedAt);
  const deletedProducts = products.filter((p) => !!p.deletedAt);

  const filtered = activeProducts.filter((p) =>
    [p.name, p.brand ?? "", p.category ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredDeleted = deletedProducts.filter((p) =>
    [p.name, p.brand ?? "", p.category ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditState({
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() ?? "",
      isOnSale: product.isOnSale,
      isSoldOut: product.isSoldOut,
      description: product.description ?? "",
      sizes: parseSizes(product.sizes),
      images: parseImages(product.imageUrl),
      stock: product.stock?.toString() ?? "",
    });
    setSaveError("");
    setNewImageUrl("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditState(null);
    setSaveError("");
    setNewImageUrl("");
  };

  const toggleSize = (size: string) =>
    setEditState((prev) => {
      if (!prev) return prev;
      const has = prev.sizes.includes(size);
      return { ...prev, sizes: has ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size] };
    });

  const addImage = () => {
    const url = newImageUrl.trim();
    if (!url || !editState) return;
    setEditState((prev) => prev ? { ...prev, images: [...prev.images, url] } : prev);
    setNewImageUrl("");
  };

  const removeImage = (index: number) =>
    setEditState((prev) =>
      prev ? { ...prev, images: prev.images.filter((_, i) => i !== index) } : prev
    );

  const handleSave = async (productId: number) => {
    if (!editState) return;
    setSaving(true);
    setSaveError("");

    const imageUrl =
      editState.images.length === 1 ? editState.images[0] : JSON.stringify(editState.images);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: adminPassword,
          price: parseFloat(editState.price) || 0,
          salePrice: editState.salePrice ? parseFloat(editState.salePrice) : null,
          isOnSale: editState.isOnSale,
          isSoldOut: editState.isSoldOut,
          description: editState.description || null,
          sizes: JSON.stringify(editState.sizes),
          imageUrl,
          stock: editState.stock ? parseInt(editState.stock) : null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error ?? "Failed to save");
        return;
      }

      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...updated, deletedAt: p.deletedAt } : p))
      );
      setEditingId(null);
      setEditState(null);
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Move this product to the deleted archive?")) return;
    setDeletingId(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
        if (editingId === productId) cancelEdit();
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestore = async (productId: number) => {
    setRestoringId(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      }
    } finally {
      setRestoringId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-5 h-5 border border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Search + count */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 border-0 border-b border-gray-200 bg-transparent px-0 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-700 transition-colors"
          />
        </div>
        <p className="text-[11px] tracking-widest uppercase text-gray-400">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      {/* ── Active products ─────────────────────────────────────────────── */}
      <div className="space-y-px">
        {filtered.map((product) => {
          const isEditing = editingId === product.id;
          const images = parseImages(product.imageUrl);
          const sizes = parseSizes(product.sizes);

          return (
            <div key={product.id} className="bg-white border border-gray-100">
              {/* Row */}
              <div className="flex items-center gap-5 px-5 py-4">
                {/* Thumbnail */}
                <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-gray-50">
                  <img
                    src={images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 tracking-wide">
                    {[product.brand, product.category].filter(Boolean).join(" · ")}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-700">
                      ALL {product.price.toFixed(0)}
                    </span>
                    {product.isOnSale && product.salePrice && (
                      <span className="text-xs text-rose-500">
                        → ALL {product.salePrice.toFixed(0)}
                      </span>
                    )}
                    {product.isSoldOut && (
                      <span className="text-[10px] tracking-widest uppercase text-gray-400 border border-gray-200 px-2 py-0.5">
                        Sold Out
                      </span>
                    )}
                    {product.isOnSale && (
                      <span className="text-[10px] tracking-widest uppercase text-rose-400 border border-rose-200 px-2 py-0.5">
                        Sale
                      </span>
                    )}
                  </div>
                  {sizes.length > 0 && (
                    <p className="text-[10px] text-gray-300 mt-1 tracking-wider">
                      {sizes.join("  ·  ")}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => (isEditing ? cancelEdit() : startEdit(product))}
                    className={`text-[10px] tracking-[0.18em] uppercase transition-colors ${
                      isEditing
                        ? "text-gray-400 hover:text-gray-700"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                  <div className="w-px h-3 bg-gray-200" />
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    title="Archive product"
                    className="text-gray-300 hover:text-rose-400 transition-colors disabled:opacity-40"
                  >
                    {deletingId === product.id ? (
                      <div className="w-3.5 h-3.5 border border-gray-300 border-t-rose-400 rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* ── Edit panel ─────────────────────────────────────────── */}
              {isEditing && editState && (
                <div className="border-t border-gray-100 px-5 py-8 bg-[#FAFAF9] space-y-8">

                  {/* Status toggles */}
                  <div className="flex gap-8">
                    {[
                      { label: "Sold Out", key: "isSoldOut" as const },
                      { label: "On Sale", key: "isOnSale" as const },
                    ].map(({ label, key }) => (
                      <label key={key} className="flex items-center gap-2.5 cursor-pointer select-none group">
                        <div
                          onClick={() =>
                            setEditState((prev) => prev ? { ...prev, [key]: !prev[key] } : prev)
                          }
                          className={`w-8 h-4 rounded-full transition-colors relative ${
                            editState[key] ? "bg-gray-900" : "bg-gray-200"
                          }`}
                        >
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                            editState[key] ? "translate-x-4" : "translate-x-0.5"
                          }`} />
                        </div>
                        <span className="text-xs text-gray-600 font-light">{label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className={labelCls}>Price (ALL)</label>
                      <input
                        type="number" min="0" step="0.01"
                        value={editState.price}
                        onChange={(e) => setEditState((p) => p ? { ...p, price: e.target.value } : p)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Sale Price (ALL)</label>
                      <input
                        type="number" min="0" step="0.01"
                        value={editState.salePrice}
                        onChange={(e) => setEditState((p) => p ? { ...p, salePrice: e.target.value } : p)}
                        placeholder="—"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className={labelCls}>Stock (pieces left)</label>
                    <input
                      type="number" min="0" step="1"
                      value={editState.stock}
                      onChange={(e) => setEditState((p) => p ? { ...p, stock: e.target.value } : p)}
                      placeholder="Leave empty if unlimited"
                      className={inputCls}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={3}
                      value={editState.description}
                      onChange={(e) => setEditState((p) => p ? { ...p, description: e.target.value } : p)}
                      className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 transition-colors resize-none font-light"
                    />
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className={labelCls}>Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_SIZES.map((size) => {
                        const active = editState.sizes.includes(size);
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
                  </div>

                  {/* Photos */}
                  <div>
                    <label className={labelCls}>Photos</label>
                    <div className="space-y-2 mb-3">
                      {editState.images.map((url, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-gray-100">
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          </div>
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                              const v = e.target.value;
                              setEditState((p) => {
                                if (!p) return p;
                                const imgs = [...p.images];
                                imgs[index] = v;
                                return { ...p, images: imgs };
                              });
                            }}
                            className="flex-1 border-0 border-b border-gray-200 bg-transparent px-0 py-1.5 text-[11px] font-mono text-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            disabled={editState.images.length <= 1}
                            className="text-gray-300 hover:text-rose-400 disabled:opacity-20 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-3">
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                        placeholder="Paste image URL…"
                        className="flex-1 border-0 border-b border-gray-200 bg-transparent px-0 py-1.5 text-sm text-gray-600 placeholder-gray-300 focus:outline-none focus:border-gray-600 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        disabled={!newImageUrl.trim()}
                        className="text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 disabled:text-gray-300 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {saveError && (
                    <p className="text-[11px] text-rose-500">{saveError}</p>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleSave(product.id)}
                      disabled={saving}
                      className="px-8 py-2.5 bg-gray-900 text-white text-[10px] tracking-[0.2em] uppercase font-light hover:bg-black disabled:bg-gray-300 transition-colors"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Deleted archive ──────────────────────────────────────────────── */}
      {deletedProducts.length > 0 && (
        <div className="mt-14">
          <button
            onClick={() => setShowDeleted((v) => !v)}
            className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-700 transition-colors mb-6"
          >
            <svg
              className={`w-3 h-3 transition-transform ${showDeleted ? "rotate-90" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Archived ({filteredDeleted.length})
          </button>

          {showDeleted && (
            <div className="space-y-px">
              {filteredDeleted.map((product) => {
                const images = parseImages(product.imageUrl);
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-5 px-5 py-4 bg-white border border-gray-100 opacity-50"
                  >
                    <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-gray-50 grayscale">
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light text-gray-500 line-through truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {[product.brand, product.category].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRestore(product.id)}
                      disabled={restoringId === product.id}
                      className="text-[10px] tracking-[0.18em] uppercase text-gray-400 hover:text-gray-800 transition-colors disabled:opacity-40 flex-shrink-0"
                    >
                      {restoringId === product.id ? (
                        <div className="w-3.5 h-3.5 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : (
                        "Restore"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
