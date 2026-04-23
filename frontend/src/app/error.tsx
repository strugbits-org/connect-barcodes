"use client";

import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl font-black text-gray-100 mb-4">500</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-500 mb-8">{error?.message || "An unexpected error occurred."}</p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn-primary"><RefreshCw size={16} /> Try Again</button>
          <Link href="/" className="btn-secondary"><Home size={16} /> Go Home</Link>
        </div>
      </div>
    </div>
  );
}
