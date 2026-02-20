"use client";

import TechStack from "@/components/TechStack";
import { HeroSection, AboutSection, HobbiesSection, WorkSection, FooterSection } from "@/sections";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      
        <Navbar />
      
      
        <HeroSection />
      
      
        <AboutSection />
      
      
        <TechStack />
      
      
        <WorkSection />
      
      
        <HobbiesSection />
      
      
        <FooterSection />
      
    </>
  );
}
