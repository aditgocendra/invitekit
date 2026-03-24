"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AudioLines, Pause, Play } from "lucide-react";

interface DialogAudioProps {
  onAudioSelect?: (audio: string) => void;
}

interface AudioFile {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
}

export default function DialogAudioSelect({ onAudioSelect }: DialogAudioProps) {
  const [opened, setOpened] = useState(false);

  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [audioSelect, setAudioSelect] = useState<AudioFile | null>(null);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/event/audio");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setAudioFiles(result.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Fetch audio error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchAudio();
  }, [fetchAudio]);

  //   Media Player
  // **SINGLE AUDIO REF** - hanya 1 audio yang active
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");

  // **SIMPLE & STABLE play/pause**
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audioSelect) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Audio play failed:", err);
        }
      });

      setIsPlaying(true);
    }
  }, [isPlaying, audioSelect]);

  // **Update src saat audioSelect berubah**
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSelect) return;

    // Pause current audio
    audio.pause();
    audio.currentTime = 0;

    // Update src
    const newSrc = `https://s3.nevaobjects.id/invitekit-bucket/${audioSelect.path}`;
    if (currentSrc !== newSrc) {
      setCurrentSrc(newSrc);
      audio.src = newSrc;
    }

    setIsPlaying(false);
  }, [audioSelect, currentSrc]);

  return (
    <Dialog
      open={opened}
      onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <Button
          className='w-full'
          type='button'>
          {/* <AudioThumbnailsIcon /> */}
          Audio Background
        </Button>
      </DialogTrigger>

      <DialogContent
        className='sm:max-w-[725px] max-h-[90vh]'
        showCloseButton={false}>
        <DialogTitle>Select Audio</DialogTitle>

        {isLoading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {audioFiles.length > 0 ? (
          <div className='flex flex-col gap-2.5'>
            {audioFiles.map((audio, index) => (
              <Button
                key={index}
                size={"xl"}
                variant={"outline"}
                className='flex justify-start gap-4'
                onClick={() => setAudioSelect(audio)}>
                <AudioLines />
                <span>{audio.name}</span>
              </Button>
            ))}

            {audioSelect && (
              <>
                <div className='bg-primary/90 backdrop-blur-sm rounded-2xl p-6 mt-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-4'>
                      <div className='p-3 bg-white/20 rounded-xl'>
                        <AudioLines size={28} />
                      </div>
                      <div>
                        <p className='text-xl font-bold text-white'>
                          {audioSelect.name}
                        </p>
                      </div>
                    </div>

                    <Button
                      size='lg'
                      onClick={togglePlayPause}
                      className='h-12 px-6 bg-white/20 hover:bg-white/30'>
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </Button>
                  </div>

                  {/* **SINGLE PERSISTENT AUDIO** */}
                  <audio
                    ref={audioRef}
                    src={`https://s3.nevaobjects.id/invitekit-bucket/${audioSelect.path}`}
                    preload='metadata'
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div>No Audio</div>
        )}

        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => {
              setOpened(false);
            }}>
            Close
          </Button>
          <Button
            onClick={() => {
              if (onAudioSelect && audioSelect) {
                onAudioSelect(audioSelect.path);
              }
              setOpened(false);
            }}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
