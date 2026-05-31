import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
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
        {/* 404 */}
        <span className="mb-4 text-7xl font-extrabold tracking-tight text-emerald-400 sm:text-8xl">
          404
        </span>

        {/* Heading */}
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরানো হয়েছে, পরিবর্তন করা হয়েছে অথবা
          বর্তমানে উপলব্ধ নেই।
        </p>

        {/* Button */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          হোম পেজে ফিরে যান
        </Link>

        {/* Footer */}
        <div className="mt-10 text-sm font-medium text-emerald-200/80">
          © 2026 • All Rights Reserved
        </div>
      </div>
    </main>
  );
}
