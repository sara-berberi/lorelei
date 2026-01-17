"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
};

const ADMIN_CODE = "ADMIN123"; // 🔒 predefined code
const MAX_ATTEMPTS = 3;

export default function AdminAccessModal({ locale, isOpen, onClose }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (code === ADMIN_CODE) {
      // Correct code → navigate safely
      onClose();
      router.push(`/${locale}/admin`);
      setCode("");
      setError("");
      setAttempts(0);
    } else {
      // Wrong code → professional error handling
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setError("Access denied. This attempt has been logged.");
        setTimeout(() => {
          handleCancel();
        }, 2000);
      } else {
        setError(
          `Invalid access code. ${MAX_ATTEMPTS - newAttempts} attempt${
            MAX_ATTEMPTS - newAttempts !== 1 ? "s" : ""
          } remaining.`
        );
      }

      setCode("");
    }
  };

  const handleCancel = () => {
    onClose();
    setCode("");
    setError("");
    setAttempts(0);
    router.push(`/${locale}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[90%] max-w-sm p-6 shadow-2xl z-[101]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Restricted Access</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          This area is restricted to authorized personnel only.
        </p>

        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter authorization code"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          disabled={attempts >= MAX_ATTEMPTS}
          autoFocus
        />

        {error && (
          <div className="flex items-start gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={attempts >= MAX_ATTEMPTS}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={attempts >= MAX_ATTEMPTS || !code.trim()}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
