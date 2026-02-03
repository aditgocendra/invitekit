"use client";

import HeroSection from "./component/hero-section";
import QuotesSection from "./component/quotes-section";
import SessionSection from "./component/session-section";
import { useRef, useState } from "react";
import { JsonValue } from "@/types/json";
import { TemplateWeddingMinimalFormSchema } from "@/validation/template.validation";
import { FreeWeddingMinimalType } from "./type";

export default function FreeWeddingMinimalTemplate({
  config,
}: {
  config: JsonValue;
}) {
  const parsed = TemplateWeddingMinimalFormSchema.safeParse(config);

  // ✅ Fallback ke object kosong jika config invalid/undefined
  const values: Partial<FreeWeddingMinimalType> = parsed.success
    ? parsed.data
    : config && typeof config === "object" && !Array.isArray(config)
      ? (config as Partial<FreeWeddingMinimalType>)
      : {}; // ✅ default ke {} jika config null/undefined/invalid

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
    <div className='bg-background flex flex-col items-center transition-all duration-300 min-h-0 fixed inset-0 overflow-y-auto'>
      {/* Hero */}
      <HeroSection
        ref={view1Ref}
        scrollToView={scrollToView}
        groomName={values.groomName}
        brideName={values.brideName}
      />

      {/* Quotes */}
      <QuotesSection
        ref={view2Ref}
        scrollToView={scrollToView}
        quotes={values.quote}
      />

      {/* Session */}
      <SessionSection
        ref={view3Ref}
        scrollToView={scrollToView}
        groomName={values.groomName}
        brideName={values.brideName}
        place={values.place}
        address={values.address}
        resepsiTime={values.resepsiTime}
      />
    </div>
  );
}
