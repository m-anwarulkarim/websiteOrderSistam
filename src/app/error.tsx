"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-black px-4 py-10 text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #10b981 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-emerald-900/30 backdrop-blur-xl md:p-14">
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          System Notice
        </div>

        {/* Heading */}
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          আমরা বর্তমানে
          <span className="block text-emerald-400">ওয়েবসাইটে কাজ করছি</span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          সাময়িক একটি সমস্যার কারণে এই পেজটি লোড করা যায়নি।
          <br />
          অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>

        {/* Retry Button */}
        <button
          onClick={() => reset()}
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
        >
          <RefreshCcw className="h-4 w-4" />
          আবার চেষ্টা করুন
        </button>

        {/* Footer */}
        <div className="mt-10 text-sm font-medium text-emerald-200/80">
          © 2026 • All Rights Reserved
        </div>
      </div>
    </main>
  );
}
