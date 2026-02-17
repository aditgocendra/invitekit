"use client";

import { useRef, useState } from "react";
import { JsonValue } from "@/types/json";
import Cover from "./component/cover";
import HeroSection from "./component/hero-section";
import SessionSection from "./component/session-section";
import RsvpSection from "./component/rsvp-section";
import ThanksSection from "./component/thank-you-section";
import { WeddingBasicMinimalFormSchema } from "@/validation/template.validation";
import z from "zod";
import { format } from "date-fns";

const DEFAULT_CONFIG = {
  coverImage: "/assets/templates/basic/wedding/minimal/bg-cover.webp",
};

type BasicWeddingMinimalType = z.infer<typeof WeddingBasicMinimalFormSchema>;

export default function BasicWeddingMinimalTemplate({
  invitationId,
  guestName,
  config,
}: {
  invitationId?: string;
  guestName?: string;
  config: JsonValue;
}) {
  const parsed = WeddingBasicMinimalFormSchema.safeParse(config);

  // ✅ Fallback ke object kosong jika config invalid/undefined
  const values: Partial<BasicWeddingMinimalType> = parsed.success
    ? parsed.data
    : config && typeof config === "object" && !Array.isArray(config)
      ? (config as Partial<BasicWeddingMinimalType>)
      : {}; // ✅ default ke {} jika config null/undefined/invalid

  const [isScrollEnabled, setIsScrollEnabled] = useState(false);

  const view1Ref = useRef<HTMLDivElement | null>(null);
  const view2Ref = useRef<HTMLDivElement | null>(null);
  const view3Ref = useRef<HTMLDivElement | null>(null);
  const view4Ref = useRef<HTMLDivElement | null>(null);
  const view5Ref = useRef<HTMLDivElement | null>(null);

  const scrollToView = (
    view: "view1" | "view2" | "view3" | "view4" | "view5",
  ) => {
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

  const onOpen = () => {
    scrollToView("view2");
  };

  return (
    <div className='bg-background flex flex-col items-center transition-all duration-300 min-h-0 fixed inset-0 overflow-y-auto'>
      <Cover
        coverImage={DEFAULT_CONFIG.coverImage}
        groomName={values.groomName}
        brideName={values.brideName}
        guestName={guestName}
        onOpen={onOpen}
      />

      <HeroSection
        ref={view2Ref}
        groomName={values.groomName}
        brideName={values.brideName}
        parentGroomName={values.parentGroomName}
        parentBrideName={values.parentBrideName}
        akadDate={format(
          values.akad ? values.akad.time : new Date(),
          "dd.MM.yy",
        )}
        scrollToView={scrollToView}
      />

      <SessionSection
        ref={view3Ref}
        scrollToView={scrollToView}
        akad={values.akad}
        reception={values.reception}
      />

      <RsvpSection
        ref={view4Ref}
        images={values.gallery}
        invitationId={invitationId}
        scrollToView={scrollToView}
      />

      <ThanksSection
        ref={view5Ref}
        message={values.thanksMessage}
      />
    </div>
  );
}
