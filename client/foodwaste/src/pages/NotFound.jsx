import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h1 className="text-6xl font-bold text-emerald-700 mb-4">
        404
      </h1>

      <p className="text-xl text-gray-600 mb-6">
        Page Not Found
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-emerald-700 text-white px-6 py-3 rounded-xl"
      >
        Go Home
      </button>
    </div>
  );
}