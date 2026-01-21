"use client";

export default function FooterDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Large diamond shape - top left */}
      <div className="absolute -top-20 -left-20 w-80 h-80 border border-white/[0.03] rotate-45" />
      <div className="absolute -top-16 -left-16 w-72 h-72 border border-white/[0.05] rotate-45" />

      {/* Concentric squares - top right */}
      <div className="absolute top-12 right-12 w-40 h-40 border border-white/[0.04]" />
      <div className="absolute top-16 right-16 w-32 h-32 border border-white/[0.06]" />
      <div className="absolute top-20 right-20 w-24 h-24 border border-white/[0.08]" />

      {/* Diagonal lines - crossing the footer */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/[0.04] to-transparent rotate-12 origin-top" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent -rotate-12 origin-top" />

      {/* Scattered small squares */}
      <div className="absolute top-1/4 left-1/3 w-4 h-4 border border-white/[0.08] rotate-45" />
      <div className="absolute top-1/3 right-1/4 w-6 h-6 border border-white/[0.06] rotate-12" />
      <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-white/[0.04]" />
      <div className="absolute top-2/3 right-1/5 w-5 h-5 border border-white/[0.05] -rotate-12" />

      {/* Large circle outline - bottom */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] border border-white/[0.02] rounded-full" />
      <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[520px] h-[520px] border border-white/[0.03] rounded-full" />

      {/* Hexagon-like shape - left side */}
      <svg className="absolute top-1/2 -left-10 w-40 h-40 opacity-[0.03]" viewBox="0 0 100 100" fill="none">
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" stroke="white" strokeWidth="1" />
      </svg>

      {/* Triangle - right side */}
      <svg className="absolute bottom-1/4 -right-8 w-32 h-32 opacity-[0.04]" viewBox="0 0 100 100" fill="none">
        <polygon points="50,10 90,90 10,90" stroke="white" strokeWidth="1" />
      </svg>

      {/* Dotted grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
