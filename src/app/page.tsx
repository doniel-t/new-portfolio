"use client";

import { HeroSection, AboutSection, HobbiesSection, FooterSection } from "@/sections";
import Navbar from "@/components/Navbar";
import TechStack from "@/components/TechStack";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />

      <TechStack />

      {/* <WorkSection /> */}

      <HobbiesSection />
      <FooterSection />
    </>
  );
}
