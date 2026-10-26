"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Dither from "@/components/Dither";
import type { HobbyCard } from "@/data/hobbies/types";

type ExpandedHobbyModalProps = {
  card: HobbyCard;
  cardIndex: number;
  totalCards: number;
  onClose: () => void;
};

function ExpandedHobbyModal({ card, onClose }: ExpandedHobbyModalProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex="0"]'
      ) ?? []).filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) return;
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} data-lenis-prevent aria-hidden="true" className="fixed inset-0 z-50 overflow-hidden">
        <Image src={card.image} alt="" fill className="object-cover scale-110 blur-3xl" sizes="384px" quality={25} />
        <div className="absolute inset-0 bg-[#0d0b08]/70" />
        <div className="absolute inset-0 opacity-[0.16] pointer-events-none">
          <Dither
            enableOnMobile
            waveColor={[165 / 100, 158 / 100, 141 / 100]}
            disableAnimation={false}
            enableMouseInteraction={false}
            colorNum={2}
            waveAmplitude={0.002}
            waveFrequency={1.5}
            waveSpeed={0.05}
          />
        </div>
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-lenis-prevent
          className="relative isolate w-full max-w-3xl max-h-[88svh] overflow-y-auto overscroll-contain rounded-xl bg-[#0d0b08]/95 font-sans text-[#d4cdc4] shadow-[0_24px_80px_rgba(0,0,0,0.3)] pointer-events-auto [scrollbar-width:thin] [scrollbar-color:#56514b_transparent]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-xl">
            <Image src={card.image} alt="" fill className="object-cover opacity-[0.14]" sizes="(max-width: 768px) 100vw, 768px" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b08]/55 via-[#0d0b08]/82 to-[#0d0b08]/96" />
          </div>

          <div className="sticky top-0 z-20 flex h-16 justify-end px-3 pt-3 sm:px-4 sm:pt-4 pointer-events-none">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close hobby details"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#121210] text-[#f4eee3] transition-colors hover:bg-[#292824] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6c3a8] pointer-events-auto"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="px-6 pb-8 sm:px-12 sm:pb-12">
            <h2 id={titleId} className="pr-4 font-display text-4xl uppercase leading-none tracking-[-0.02em] text-[#f4eee3] sm:text-6xl">{card.title}</h2>
            <p className="mt-6 text-sm leading-7 text-[#d4cdc4]/75 sm:text-base">{card.expandedText}</p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 text-[#e6c3a8]" aria-label="Favorites and interests">
              {card.items.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              {card.stats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <dt className="text-xs leading-5 text-[#d4cdc4]/65">{stat.label}</dt>
                  <dd className="mt-1.5 text-sm font-medium leading-6 text-[#f4eee3]">{stat.value}</dd>
                </div>
              ))}
            </dl>

            {card.quote ? <blockquote className="mt-8 text-sm italic leading-6 text-[#e6c3a8]">{card.quote}</blockquote> : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpandedHobbyModal;
