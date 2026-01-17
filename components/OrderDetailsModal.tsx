"use client";

import { useState } from "react";

const STATUS_OPTIONS = ["pending", "regjistruar", "OK"];

export default function OrderDetailsModal({ order, onClose }: any) {
  const [status, setStatus] = useState(order.notes || "pending");

  const saveStatus = async () => {
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({ notes: status }),
    });
    onClose();
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "regjistruar":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "OK":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get first image for product (support both single URL and JSON array)
  const getFirstImage = (imageUrl: string): string => {
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0] as string;
      }
    } catch {
      // If parsing fails, it's a single image URL
    }
    return imageUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl transform transition-all animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Order #{order.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Customer Details
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.address}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Order Items
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 max-h-64 overflow-y-auto">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={getFirstImage(item.product.imageUrl)}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "";
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 mb-1">
                          {item.product.name}
                        </p>
                        {item.product.brand && (
                          <p className="text-xs text-gray-500 mb-2">
                            {item.product.brand}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3">
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Qty:</span>{" "}
                            {item.quantity}
                          </span>
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Size:</span>{" "}
                            {item.size || "-"}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            ALL {item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide block">
                Order Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${getStatusColor(
                    status
                  )}`}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 flex-shrink-0 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={saveStatus}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white font-medium hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
