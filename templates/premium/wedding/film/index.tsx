"use client";

import { useRef, useState } from "react";
import { JsonValue } from "@/types/json";

import { WeddingPremiumFilmFormSchema } from "@/validation/template.validation";

import Cover from "./component/cover";
import HeroSection from "./component/hero-section";
import SessionSection from "./component/session-section";
import RsvpSection from "./component/rsvp-section";
import GiftSection from "./component/gift-section";
import ThanksSection from "./component/thank-you-section";
import AudioPlayer from "@/components/audio-player";
import z from "zod";

const DEFAULT_AUDIO = "audio/pb_lobby.mp3";

type PremiumWeddingFilmType = z.infer<typeof WeddingPremiumFilmFormSchema>;

export default function PremiumWeddingFilmTemplate({
  invitationId,
  guestName,
  config,
}: {
  invitationId?: string;
  guestName?: string;
  config: JsonValue;
}) {
  const parsed = WeddingPremiumFilmFormSchema.safeParse(config);

  // ✅ Fallback ke object kosong jika config invalid/undefined
  const values: Partial<PremiumWeddingFilmType> = parsed.success
    ? parsed.data
    : config && typeof config === "object" && !Array.isArray(config)
      ? (config as Partial<PremiumWeddingFilmType>)
      : {}; // ✅ default ke {} jika config null/undefined/invalid

  const [isScrollEnabled, setIsScrollEnabled] = useState(false);

  const view1Ref = useRef<HTMLDivElement | null>(null);
  const view2Ref = useRef<HTMLDivElement | null>(null);
  const view3Ref = useRef<HTMLDivElement | null>(null);
  const view4Ref = useRef<HTMLDivElement | null>(null);
  const view5Ref = useRef<HTMLDivElement | null>(null);
  const view6Ref = useRef<HTMLDivElement | null>(null);

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

  // background mp3 music control
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  const currentAudioSrc = values.audioBackground
    ? `https://s3.nevaobjects.id/invitekit-bucket/${values.audioBackground}`
    : `https://s3.nevaobjects.id/invitekit-bucket/${DEFAULT_AUDIO}`;

  const tooglePlayPause = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (!isPlaying) {
      audio.src = currentAudioSrc;
      audio.load();
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const onOpen = () => {
    tooglePlayPause();
    scrollToView("view2");
    setShowAudio(true);
  };

  return (
    <div className='relative min-h-screen bg-[#0E1424] overflow-hidden'>
      <div className='flex flex-col items-center transition-all duration-300 min-h-screen overflow-y-auto'>
        <Cover
          onOpen={onOpen}
          groomName={values.groomName}
          brideName={values.brideName}
          imageUrls={values.coverImages}
        />
        <HeroSection
          ref={view2Ref}
          stories={values.stories}
          guestName={guestName}
        />
        <SessionSection
          ref={view3Ref}
          scrollToView={scrollToView}
          akad={values.akad}
          reception={values.reception}
        />
        <RsvpSection
          ref={view4Ref}
          scrollToView={scrollToView}
          imageUrls={values.rsvpImages}
          invitationId={invitationId}
        />
        <GiftSection
          ref={view5Ref}
          scrollToView={scrollToView}
          giftCard1={values.giftCard1}
          giftCard2={values.giftCard2}
          giftCardBg={values.giftCardBg}
        />
        <ThanksSection
          ref={view6Ref}
          images={values.thanksImages}
          message={values.thanksMessage}
        />
      </div>

      {/* AudioPlayer FIXED pojok kanan bawah */}
      {showAudio && (
        <div className='fixed bottom-8 right-8 z-50'>
          <AudioPlayer
            src={currentAudioSrc}
            audioRef={audioRef}
            onPlayPause={tooglePlayPause}
            isPlaying={isPlaying}
          />
        </div>
      )}
    </div>
  );
}
