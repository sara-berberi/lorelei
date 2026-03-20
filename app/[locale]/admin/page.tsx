"use client";

import { useState, useEffect } from "react";
import OrdersTable from "@/components/OrdersTable";
import AdminProductsPanel from "@/components/AdminProductsPanel";
import AddProductPanel from "@/components/AddProductPanel";

type Tab = "orders" | "products" | "add";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const MAX_ATTEMPTS = 3;
  const isLoggedIn = !!password;

  useEffect(() => {
    if (!isLoggedIn) return;
    setOrdersLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      });
  }, [isLoggedIn]);

  const handleLogin = async () => {
    if (!inputPassword.trim() || attempts >= MAX_ATTEMPTS) return;
    setVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: inputPassword }),
      });

      if (res.ok) {
        setPassword(inputPassword);
        setInputPassword("");
        setAttempts(0);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setError("Access denied. Too many failed attempts.");
        } else {
          setError(
            `Invalid password. ${MAX_ATTEMPTS - newAttempts} attempt${
              MAX_ATTEMPTS - newAttempts !== 1 ? "s" : ""
            } remaining.`
          );
        }
        setInputPassword("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Wordmark */}
          <p className="text-center text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-10">
            Lorelei Boutique
          </p>

          {/* Card */}
          <div className="bg-white border border-gray-100 p-10 shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
            <h1 className="text-xl font-light tracking-tight text-gray-900 text-center mb-1">
              Private Access
            </h1>
            <p className="text-xs text-gray-400 text-center tracking-wide mb-8">
              Authorised personnel only
            </p>

            <div className="space-y-3">
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Password"
                disabled={attempts >= MAX_ATTEMPTS || verifying}
                autoFocus
                className="w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-800 transition-colors"
              />

              {error && (
                <p className="text-[11px] text-red-500 tracking-wide pt-1">
                  {error}
                </p>
              )}

              <button
                onClick={handleLogin}
                disabled={!inputPassword.trim() || attempts >= MAX_ATTEMPTS || verifying}
                className="w-full mt-2 py-3 bg-[#1a1a1a] text-white text-xs tracking-[0.15em] uppercase font-light hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {verifying ? "Verifying…" : "Enter"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  const TABS: { key: Tab; label: string }[] = [
    { key: "orders", label: "Orders" },
    { key: "products", label: "Products" },
    { key: "add", label: "New Product" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400">
            Admin
          </p>
          <button
            onClick={() => { setPassword(""); setAttempts(0); }}
            className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Tab navigation */}
        <div className="flex items-end gap-8 border-b border-gray-200 mb-10">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-3 text-xs tracking-[0.2em] uppercase transition-colors ${
                tab === key
                  ? "text-gray-900 border-b border-gray-900 -mb-px"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "orders" && (
          ordersLoading ? (
            <Spinner />
          ) : (
            <OrdersTable orders={orders} />
          )
        )}
        {tab === "products" && <AdminProductsPanel adminPassword={password} />}
        {tab === "add" && (
          <AddProductPanel
            adminPassword={password}
            onProductAdded={() => setTab("products")}
          />
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-24">
      <div className="w-5 h-5 border border-gray-300 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );
}
