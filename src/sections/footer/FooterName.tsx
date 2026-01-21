"use client";

import React from "react";

type FooterNameProps = {
  name: string;
  footerRef: React.RefObject<HTMLElement | null>;
};

export default function FooterName({ name, footerRef }: FooterNameProps) {
  const nameRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!nameRef.current) return;
      const rect = nameRef.current.getBoundingClientRect();
      // Calculate position relative to the name element
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    footer.addEventListener("mousemove", handleMouseMove);
    footer.addEventListener("mouseenter", handleMouseEnter);
    footer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      footer.removeEventListener("mousemove", handleMouseMove);
      footer.removeEventListener("mouseenter", handleMouseEnter);
      footer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [footerRef]);

  // Create the text content - repeated enough to fill the screen
  const textContent = `${name}   -   ${name}   -   ${name}   -   ${name}   -   ${name}   -   `;

  return (
    <div
      ref={nameRef}
      className={`footer-name-wrapper absolute bottom-0 left-0 right-0 pb-4 sm:pb-8 ${
        isHovering ? "is-hovering" : ""
      }`}
      style={
        {
          "--mouse-x": `${mousePosition.x}%`,
          "--mouse-y": `${mousePosition.y}%`,
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
