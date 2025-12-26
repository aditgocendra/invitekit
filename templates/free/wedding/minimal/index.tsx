"use client";

import { FreeWeddingMinimalType } from "./type";
import HeroSection from "./component/hero-section";
import QuotesSection from "./component/quotes-section";
import SessionSection from "./component/session-section";
import { useRef, useState } from "react";

export default function FreeWeddingMinimalTemplate(
  data: FreeWeddingMinimalType
) {
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);

  const view1Ref = useRef<HTMLDivElement | null>(null);
  const view2Ref = useRef<HTMLDivElement | null>(null);
  const view3Ref = useRef<HTMLDivElement | null>(null);

  const scrollToView = (view: "view1" | "view2" | "view3") => {
    if (!isScrollEnabled) {
      setIsScrollEnabled(true);
    }
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
  };

  return (
    <div
      className={`bg-background flex min-h-screen flex-col items-center transition-all duration-300 ${
        isScrollEnabled
          ? "overflow-auto"
          : "overflow-hidden h-screen w-screen fixed inset-0"
      }`}>
      {/* Hero */}
      <HeroSection
        ref={view1Ref}
        scrollToView={scrollToView}
      />

      {/* Quotes */}
      <QuotesSection
        ref={view2Ref}
        scrollToView={scrollToView}
      />

      {/* Session */}
      <SessionSection
        ref={view3Ref}
        scrollToView={scrollToView}
      />
    </div>
  );
}
