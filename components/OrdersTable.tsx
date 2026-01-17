"use client";

import { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
type Order = {
  id: number;
  fullName: string;
  instagramUsername: string;
  totalPriceWithPostalFee: number;
  createdAt: string;
  items: any[];
};

export default function OrdersTable({ orders }: { orders: any[] }) {
  const grouped = groupByMonth(orders);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const getRowClass = (order: any) => {
    const status = order.notes?.toLowerCase() ?? "";

    if (status === "ok") {
      return "bg-green-100 hover:bg-green-200";
    }

    if (status.includes("regjistruar")) {
      return "bg-blue-100 hover:bg-blue-200";
    }

    if (status === "pending") {
      return "bg-orange-100 hover:bg-orange-200";
    }

    return "hover:bg-gray-50";
  };

  return (
    <>
      {Object.entries(grouped).map(([month, orders]) => (
        <div key={month} className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{month}</h2>

          <table className="w-full bg-white border rounded-md">
            <thead>
              <tr className="text-left text-sm bg-gray-100">
                <th className="p-3">Customer</th>
                <th className="p-3">Instagram</th>
                <th className="p-3">Total</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-pointer border-t ${getRowClass(order)}`}
                >
                  <td className="p-3">{order.fullName}</td>
                  <td className="p-3">@{order.instagramUsername}</td>
                  <td className="p-3">
                    ALL {order.totalPriceWithPostalFee.toFixed(2)}
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}

const groupByMonth = (orders: Order[]): Record<string, Order[]> => {
  return orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[month]) acc[month] = [];
    acc[month].push(order);

    return acc;
  }, {} as Record<string, Order[]>);
};
