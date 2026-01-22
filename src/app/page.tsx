"use client";

import { HeroSection, AboutSection, HobbiesSection, FooterSection } from "@/sections";
import TechStack from "@/components/TechStack";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TechStack />
      <HobbiesSection />
      <FooterSection />
    </>
  );
}
