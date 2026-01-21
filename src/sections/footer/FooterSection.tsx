"use client";

import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";
import PixelDivider from "@/components/PixelDivider";
import ContactForm from "@/components/ContactForm";
import { useIsMobile } from "@/hooks/useIsMobile";
import FooterDecorations from "./FooterDecorations";
import FooterName from "./FooterName";

export default function FooterSection() {
  const isMobile = useIsMobile();
  const footerRef = React.useRef<HTMLElement>(null);

  return (
    <footer ref={footerRef} id="contact" className="relative w-full bg-[#0d0b08] overflow-hidden">
      {/* PixelDivider at very top of footer - white, going down */}
      <div className="absolute top-0 left-0 right-0 h-40 z-10 overflow-hidden pointer-events-none" aria-hidden>
        <PixelDivider
          color="#ffffff"
          pixelSize={isMobile ? 8 : 16}
          durationSec={6}
          rise="200%"
          streamsPerCol={3}
          direction="down"
        />
      </div>

      {/* Floating geometric shapes - decorative */}
      <FooterDecorations />

      {/* Main content */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-8 py-20 sm:py-28">
        {/* Top section - Contact Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          {/* Contact Form Section */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-px bg-white/30" />
              <span className="font-mono text-xs tracking-widest text-white/40 uppercase">Get in touch</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl tracking-tight text-white mb-8">Contact</h2>

            <ContactForm />
          </div>

          {/* Info Section - Links + Social */}
          <div className="space-y-12">
            {/* Quick Navigation */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rotate-45 bg-white/20" />
                <span className="font-mono text-xs tracking-widest text-white/40 uppercase">Navigate</span>
              </div>
              <nav className="flex flex-col gap-3">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300"
                >
                  <div className="w-4 h-px bg-white/20 group-hover:bg-white/50 group-hover:w-6 transition-all duration-300" />
                  <span className="font-mono text-sm">Home</span>
                </a>
                <a
                  href="#work"
                  className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300"
                >
                  <div className="w-4 h-px bg-white/20 group-hover:bg-white/50 group-hover:w-6 transition-all duration-300" />
                  <span className="font-mono text-sm">About</span>
                </a>
                <a
                  href="#hobbies"
                  className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300"
                >
                  <div className="w-4 h-px bg-white/20 group-hover:bg-white/50 group-hover:w-6 transition-all duration-300" />
                  <span className="font-mono text-sm">Hobbies</span>
                </a>
                <a
                  href="#contact"
                  className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300"
                >
                  <div className="w-4 h-px bg-white/20 group-hover:bg-white/50 group-hover:w-6 transition-all duration-300" />
                  <span className="font-mono text-sm">Contact</span>
                </a>
              </nav>
            </div>

            {/* Social Links */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rotate-45 bg-white/20" />
                <span className="font-mono text-xs tracking-widest text-white/40 uppercase">Connect</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://linkedin.com/in/danieltheil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/50 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/50 transition-colors" />
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://github.com/danieltheil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all duration-300"
                  aria-label="GitHub"
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/50 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/50 transition-colors" />
                  <Github size={18} />
                </a>
                <a
                  href="mailto:daniel.theil.g@gmail.com"
                  className="group relative w-12 h-12 flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all duration-300"
                  aria-label="Email"
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/50 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/50 transition-colors" />
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 pt-4">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
              </div>
              <span className="font-mono text-xs tracking-wider text-white/40 uppercase">Available for work</span>
            </div>
          </div>
        </div>

        {/* Impressum Section */}
        <div className="relative">
          {/* Impressum Content */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 rotate-45 border border-white/30" />
              <span className="font-mono text-xs tracking-widest text-white/40 uppercase">Legal</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-2xl text-white mb-4">Impressum</h3>
                <div className="text-white/50 space-y-2 font-mono text-sm">
                  <p className="text-white/70">Daniel Theil</p>
                  <p>Sonnenstra&#223;e 24</p>
                  <p>85080 Gaimersheim</p>
                  <p>Germany</p>
                </div>
              </div>

              <div>
                <h3 className="font-display text-2xl text-white mb-4">Contact</h3>
                <div className="text-white/50 space-y-2 font-mono text-sm">
                  <p>
                    <span className="text-white/30 mr-2">Email:</span>
                    <a href="mailto:daniel.theil.g@gmail.com" className="hover:text-white transition-colors">
                      daniel.theil.g@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="font-mono text-xs text-white/30">
              &#169; {new Date().getFullYear()} Daniel Theil. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-white/20" />
              </div>
              <span className="font-mono text-xs text-white/20">Built with Next.js</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width grainy name */}
      <FooterName name="DANIEL THEIL" footerRef={footerRef} />
    </footer>
  );
}
