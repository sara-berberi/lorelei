"use client";
import OrdersTable from "@/components/OrdersTable";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="p-6">Loading orders...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
