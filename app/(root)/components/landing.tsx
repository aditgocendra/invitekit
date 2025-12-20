"use client";

import { useRef } from "react";
import HeaderNavbar from "./header-nav";
import HeroSection from "./hero-section";
import ProblemSection from "./problem-section";
import SolutionSection from "./solution-section";
import PriceSection from "./price-section";
import FAQSection from "./faq-section";
import FooterSection from "./footer-section";

export default function Landing() {
  const view1Ref = useRef<HTMLDivElement | null>(null);
  const view2Ref = useRef<HTMLDivElement | null>(null);
  const view3Ref = useRef<HTMLDivElement | null>(null);
  const view4Ref = useRef<HTMLDivElement | null>(null);
  const view5Ref = useRef<HTMLDivElement | null>(null);

  const scrollToView = (
    view: "view1" | "view2" | "view3" | "view4" | "view5"
  ) => {
    if (view === "view1" && view1Ref.current) {
      view1Ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
    if (view === "view2" && view2Ref.current) {
      view2Ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
    if (view === "view3" && view3Ref.current) {
      view3Ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
    if (view === "view4" && view4Ref.current) {
      view4Ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
    if (view === "view5" && view5Ref.current) {
      view5Ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header*/}
      <HeaderNavbar scrollToView={scrollToView} />

      {/* Main */}
      <main>
        <HeroSection ref={view1Ref} />
        <ProblemSection ref={view2Ref} />
        <SolutionSection ref={view3Ref} />
        <PriceSection ref={view4Ref} />
        <FAQSection ref={view5Ref} />
        <FooterSection />
      </main>
    </div>
  );
}
