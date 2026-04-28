"use client";

import React from "react";

type FooterNameProps = {
  name: string;
  footerRef: React.RefObject<HTMLElement | null>;
};

export default function FooterName({ name, footerRef }: FooterNameProps) {
  const nameRef = React.useRef<HTMLDivElement>(null);
  const clientMousePos = React.useRef({ x: 0, y: 0 });
  const isHoveringRef = React.useRef(false);
  const rafIdRef = React.useRef(0);

  React.useEffect(() => {
    const footer = footerRef.current;
    const nameEl = nameRef.current;
    if (!footer || !nameEl) return;

    const writePosition = () => {
      rafIdRef.current = 0;
      const el = nameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = ((clientMousePos.current.x - rect.left) / rect.width) * 100;
      const y = ((clientMousePos.current.y - rect.top) / rect.height) * 100;
      el.style.setProperty("--mouse-x", `${x}%`);
      el.style.setProperty("--mouse-y", `${y}%`);
    };

    const schedule = () => {
      if (rafIdRef.current) return;
      rafIdRef.current = window.requestAnimationFrame(writePosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      clientMousePos.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const handleScroll = () => {
      if (isHoveringRef.current) schedule();
    };

    const handleMouseEnter = () => {
      isHoveringRef.current = true;
      nameEl.classList.add("is-hovering");
    };
    const handleMouseLeave = () => {
      isHoveringRef.current = false;
      nameEl.classList.remove("is-hovering");
    };

    footer.addEventListener("mousemove", handleMouseMove);
    footer.addEventListener("mouseenter", handleMouseEnter);
    footer.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      footer.removeEventListener("mousemove", handleMouseMove);
      footer.removeEventListener("mouseenter", handleMouseEnter);
      footer.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };
  }, [footerRef]);

  // Create the text content - repeated enough to fill the screen
  const textContent = `${name}   -   ${name}   -   ${name}   -   ${name}   -   ${name}   -   `;

  return (
    <div
      ref={nameRef}
      className="footer-name-wrapper absolute bottom-0 left-0 right-0 pb-4 sm:pb-8"
      style={
        {
          "--mouse-x": "-1000%",
          "--mouse-y": "-1000%",
        } as React.CSSProperties
      }
    >
      <div className="footer-name-container">
        <div className="footer-name-track">
          {/* Two identical text elements for seamless loop */}
          <div className="footer-name-text">{textContent}</div>
          <div className="footer-name-text">{textContent}</div>
        </div>
      </div>
    </div>
  );
}
