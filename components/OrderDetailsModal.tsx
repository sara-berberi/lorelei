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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Order #{order.id}</h2>

        <ul className="mb-4 space-y-2">
          {order.items.map((item: any) => (
            <li key={item.id} className="text-sm">
              {item.product.name} — Qty: {item.quantity} — Size:{" "}
              {item.size || "-"}
            </li>
          ))}
        </ul>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={saveStatus}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
