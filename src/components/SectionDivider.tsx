"use client";

export default function SectionDivider() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 md:h-32">
      {/* Soft Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/90" />

      {/* Premium Curve */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="absolute bottom-0 h-20 w-full md:h-28"
        fill="none"
      >
        <path
          d="M0,120 C240,220 480,0 720,80 C960,160 1200,220 1440,120 L1440,220 L0,220 Z"
          fill="rgba(255,255,255,0.92)"
        />
      </svg>
    </div>
  );
}
