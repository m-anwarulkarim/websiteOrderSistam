// src/components/shared/WebsiteWorkingNotice.tsx
"use client";
import Link from "next/link";
import { ArrowLeft, Home, Wrench } from "lucide-react";

export default function WebsiteWorkingNotice() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Wrench className="h-8 w-8" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          আমরা এই ওয়েবসাইটে কাজ করছি
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          আপনাদের জন্য আরও সুন্দর, দ্রুত এবং আধুনিক অভিজ্ঞতা তৈরি করতে আমাদের
          টিম বর্তমানে ওয়েবসাইটটি আপডেট করছে। খুব শিগগিরই সম্পূর্ণ নতুন রূপে
          ফিরে আসছি।
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            হোমে ফিরে যান
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            আগের পেজে যান
          </button>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-xs text-muted-foreground">
          ধন্যবাদ আমাদের সাথে থাকার জন্য 💚
        </p>
      </div>
    </section>
  );
}
