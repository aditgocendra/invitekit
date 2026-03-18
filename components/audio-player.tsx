"use client";

import { RefObject } from "react";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";

export default function AudioPlayer({
  src,
  audioRef,
  onPlayPause,
  isPlaying,
  autoPlay = true,
}: {
  src: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  onPlayPause: () => void;
  isPlaying: boolean;
  autoPlay?: boolean;
}) {
  return (
    <div className='flex items-center gap-4'>
      <audio
        ref={audioRef}
        autoPlay={autoPlay}>
        <source
          src={src}
          type='audio/mpeg'
        />
      </audio>

      <Button
        onClick={onPlayPause}
        className='rounded-full w-15 h-15 bg-white/30 backdrop-blur-sm'>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </div>
  );
}
