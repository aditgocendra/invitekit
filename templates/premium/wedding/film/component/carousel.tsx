"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image, { StaticImageData } from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ListStart, StepForward } from "lucide-react";

interface CarouselItem {
  img: string | StaticImageData;
  alt: string;
  title?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  duration?: number;
}

export const CrossfadeCarouselCover = ({
  items,
  duration = 13000,
}: CarouselProps) => {
  const itemsRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [active, setActive] = useState<number>(0);

  // Auto-slide
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, duration);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, items.length]);

  // Progress bar - FIXED RAF
  useEffect(() => {
    let rafId: number;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / duration) * 100, 100);

      if (percent < 100) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [active, duration]);

  const heightFix = useCallback(() => {
    if (itemsRef.current?.parentElement) {
      itemsRef.current.parentElement.style.height = `${itemsRef.current.clientHeight}px`;
    }
  }, []);

  const handleDotClick = (index: number) => {
    setActive(index);
  };

  return (
    <div className='w-full'>
      <div className='relative overflow-hidden'>
        {/* Images */}
        <div
          className='relative min-h-screen'
          ref={itemsRef}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                active === index
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105 z-0"
              }`}
              onTransitionEnd={heightFix}>
              <Image
                fill
                className='w-full h-full object-cover animate-[zoomOutOnce_12s_ease-out_0.5s_forwards]'
                src={item.img}
                alt={item.alt}
                priority={index <= 1}
              />
            </div>
          ))}
        </div>

        {/* DOTS - NO BACKDROP BLUR, PURE COLORS */}
        {/* Thumbnail Indicators - GANTI dots */}
        <div className='absolute top-1/2 right-8 z-50  hidden sm:flex flex-col gap-4 transform -translate-y-1/2 w-[431px] h-auto max-w-[431px] max-h-[810px] mx-20'>
          {items.map((item, index) => (
            <button
              key={index}
              type='button'
              className={`relative w-full h-[243px] max-w-[431px] max-h-[243px] overflow-hidden transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-3xl hover:-translate-y-1`}
              onClick={() => handleDotClick(index)}
              aria-label={`Preview slide ${index + 1}`}>
              {/* Thumbnail Image */}
              <Image
                src={item.img}
                alt={item.alt}
                width={480}
                height={270}
                className={`object-cover w-full h-full transition-transform duration-500 hover:scale-105 opacity-0 ${index === 0 ? "animate-[fadeIn_1s_ease-out_1s_forwards]" : index === 1 ? "animate-[fadeIn_1s_ease-out_1.5s_forwards]" : "animate-[fadeIn_1s_ease-out_2s_forwards]"} transform-[translateY(20px)]`}
                priority={index <= 2}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CrossfadeCarouselHero = ({
  items,
  duration = 13000,
}: CarouselProps) => {
  const itemsRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [active, setActive] = useState<number>(0);

  // Auto-slide
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, duration);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, items.length]);

  // Progress bar - FIXED RAF
  useEffect(() => {
    let rafId: number;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / duration) * 100, 100);

      if (percent < 100) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [active, duration]);

  const heightFix = useCallback(() => {
    if (itemsRef.current?.parentElement) {
      itemsRef.current.parentElement.style.height = `${itemsRef.current.clientHeight}px`;
    }
  }, []);

  const handleDotClick = (index: number) => {
    setActive(index);
  };

  return (
    <div className='absolute inset-0 m-3 sm:m-6 gap-8 flex flex-col'>
      <div className='w-full h-[60%] relative'>
        {items.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out  ${
              active === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            onTransitionEnd={heightFix}>
            <Image
              fill
              className='w-full h-full object-cover rounded-2xl'
              src={item.img}
              alt={item.alt}
              priority={index <= 1}
            />

            <div className='absolute inset-0 m-4 sm:m-20'>
              <div className='max-w-[600px] flex flex-col justify-between h-full'>
                <div className='flex items-center gap-2.5'>
                  <Avatar className='size-6 sm:size-10 rounded-lg'>
                    <AvatarImage
                      src={"/assets/templates/premium/wedding/film/avatar.webp"}
                      alt={"avatar"}
                    />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>
                  <span className='text-sm sm:text-xl text-white'>
                    Hi, Sora & Dream
                  </span>
                </div>

                <div className='space-y-8'>
                  <h1
                    className={`font-alexandria font-semibold text-white text-xl sm:text-3xl transition-all duration-1000 ease-in-out  ${
                      active === index ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}>
                    Thank U, Next
                  </h1>

                  <p
                    className={`font-alexandria text-white text-justify text-sm sm:text-lg line-clamp-3 sm:line-clamp-4 transition-all duration-1000 ease-in-out  ${
                      active === index ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Velit, inventore cumque exercitationem ab, aspernatur
                    reiciendis voluptatum dolorum esse numquam eos fugit quaerat
                    ipsam. Vel eum magni necessitatibus id dolores quidem?
                  </p>

                  <div className='flex gap-4'>
                    <Button
                      className='text-black bg-white rounded-full font-semibold text-sm sm:text-md'
                      size='xl'
                      onClick={() =>
                        handleDotClick(
                          index + 1 !== items.length ? index + 1 : 0,
                        )
                      }>
                      <StepForward className='size-4 sm:size-5' />
                      Next
                    </Button>

                    <Button
                      className='rounded-full font-semibold text-sm sm:text-md'
                      size='xl'
                      onClick={() =>
                        handleDotClick(
                          index - 1 < 0 ? items.length - 1 : index - 1,
                        )
                      }>
                      <ListStart className='size-4 sm:size-5' />
                      Prev
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='space-y-4'>
        <h3 className='font-alexandria text-white text-lg sm:text-xl'>
          Top Stories
        </h3>

        <div className='flex gap-2 sm:gap-4 overflow-x-hidden'>
          {items.map((item, index) => (
            <button
              key={index}
              className='flex flex-col gap-2 sm:gap-4'
              onClick={() => handleDotClick(index)}>
              <div className='w-25 h-40 sm:w-40 sm:h-60 bg-zinc-500 rounded-2xl sm:rounded-xl relative'>
                <Image
                  src={item.img}
                  fill
                  className='object-cover rounded-2xl'
                  alt='Wedding Minimal Template'
                />
              </div>
              <div className='font-alexandria flex flex-col max-w-26 sm:max-w-40 pr-2'>
                <span className='text-white text-sm sm:text-lg text-start truncate'>
                  Thank U, Next
                </span>
                <span className='text-gray-400 text-xs sm:text-sm truncate'>
                  Golden Brown hahahaasdas
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
