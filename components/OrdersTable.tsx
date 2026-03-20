"use client";

import { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";

type Order = {
  id: number;
  fullName: string;
  instagramUsername: string;
  totalPriceWithPostalFee: number;
  createdAt: string;
  notes?: string;
  items: any[];
};

const groupByMonth = (orders: Order[]): Record<string, Order[]> =>
  orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

function StatusDot({ notes }: { notes?: string }) {
  const s = notes?.toLowerCase() ?? "";
  if (s === "ok") return <span className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Completed</span>;
  if (s.includes("regjistruar")) return <span className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-sky-600"><span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block" />Registered</span>;
  if (s === "pending") return <span className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />Pending</span>;
  return <span className="text-[10px] tracking-widest uppercase text-gray-300">—</span>;
}

export default function OrdersTable({ orders }: { orders: any[] }) {
  const grouped = groupByMonth(orders);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  return (
    <>
      <div className="space-y-12">
        {Object.entries(grouped).map(([month, monthOrders]) => (
          <div key={month}>
            {/* Month header */}
            <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-gray-100">
              <h2 className="text-sm font-light tracking-widest uppercase text-gray-900">{month}</h2>
              <span className="text-[10px] tracking-widest uppercase text-gray-400">{monthOrders.length} {monthOrders.length === 1 ? "order" : "orders"}</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Customer", "Instagram", "Total", "Date", "Status"].map((h) => (
                      <th key={h} className="pb-3 text-left text-[9px] tracking-[0.25em] uppercase text-gray-400 font-normal pr-6 last:pr-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(monthOrders as any[]).map((order: any) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b border-gray-50 cursor-pointer hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="py-4 pr-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-medium flex-shrink-0">
                            {order.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-light text-gray-800">{order.fullName}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-6">
                        <span className="text-xs text-gray-500 font-light">@{order.instagramUsername}</span>
                      </td>
                      <td className="py-4 pr-6">
                        <span className="text-sm font-light text-gray-900">ALL {order.totalPriceWithPostalFee.toFixed(0)}</span>
                      </td>
                      <td className="py-4 pr-6">
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </td>
                      <td className="py-4">
                        <StatusDot notes={order.notes} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  );
}
