"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
};

const ADMIN_CODE = "ADMIN123"; // 🔒 predefined code

export default function AdminAccessModal({ locale, isOpen, onClose }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (code === ADMIN_CODE) {
      onClose();
      router.push(`/${locale}/admin`);
    } else {
      setError("You don't have access here");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-[90%] max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Admin Access</h2>

        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          placeholder="Enter admin code"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-black"
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
