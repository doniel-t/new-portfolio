"use client";

import { HeroSection, AboutSection, HobbiesSection, FooterSection } from "@/sections";
import TechStack from "@/components/TechStack";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <TechStack />
      <HobbiesSection />
      <FooterSection />
    </>
  );
}
