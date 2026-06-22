"use client";

import { HeroSection, AboutSection, HobbiesSection, FooterSection } from "@/sections";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HobbiesSection />
      <FooterSection />
    </>
  );
}
