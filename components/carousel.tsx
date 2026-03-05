"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image, { StaticImageData } from "next/image";
import { Button } from "./ui/button";

interface CarouselItem {
  img: string | StaticImageData;
  alt: string;
  title?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  duration?: number;
}

export default function CrossfadeCarousel({
  items,
  duration = 5000,
}: CarouselProps) {
  const itemsRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const animateRef = useRef<((now: number) => void) | null>(null);
  const [active, setActive] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Setup animateRef.current (pure, no self-reference issue)
  useEffect(() => {
    animateRef.current = (now: number) => {
      const timeFraction = (now - startTimeRef.current) / duration!;
      if (timeFraction <= 1) {
        setProgress(timeFraction * 100);
        frameRef.current = requestAnimationFrame(animateRef.current!);
      } else {
        setProgress(0);
        setActive((prevActive) => (prevActive + 1) % items.length);
      }
    };
  }, [duration, items.length]);

  // Start RAF loop
  useEffect(() => {
    startTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(animateRef.current!);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const heightFix = useCallback(() => {
    if (itemsRef.current?.parentElement) {
      itemsRef.current.parentElement.style.height = `${itemsRef.current.clientHeight}px`;
    }
  }, []);

  useEffect(() => {
    heightFix();
  }, [heightFix]);

  const handleDotClick = useCallback((index: number) => {
    setActive(index);
    setProgress(0);
    startTimeRef.current = performance.now(); // Reset timer
    if (animateRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(animateRef.current);
    }
  }, []);

  return (
    <div className='w-full'>
      <div className='relative overflow-hidden rounded-xl shadow-lg'>
        {/* Gambar Area - Z-Index MAX 20 */}
        <div
          className='relative min-h-screen flex flex-col'
          ref={itemsRef}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                active === index
                  ? "opacity-100 scale-100 z-20" // Z-20 untuk gambar
                  : "opacity-0 scale-105 z-0"
              }`}
              onTransitionEnd={heightFix}>
              <Image
                className='w-full h-full object-cover'
                src={item.img}
                alt={item.alt}
                fill
                priority={index < 2}
              />
            </div>
          ))}
        </div>

        {/* Indicator - Z-Index 30 (paling atas) */}
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3 px-6 py-3 rounded-full '>
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}>
              <Image
                key={index}
                src={items[index].img}
                alt={items[index].alt}
                width={480}
                height={270}
              />
            </button>
            // <button
            //   key={index}
            //   className={`group relative w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 ${
            //     active === index
            //       ? "w-10 bg-white scale-125 shadow-xl shadow-white/50"
            //       : "bg-white/70 hover:bg-white hover:w-4 hover:scale-110 hover:shadow-lg"
            //   }`}
            //   onClick={() => handleDotClick(index)}
            //   aria-label={`Goto slide ${index + 1}`}>
            //   {/* Progress Bar */}
            //   {active === index && (
            //     <div
            //       className='absolute inset-0 bg-blue-400/90 rounded-full shadow-inner transition-all duration-1000 ease-linear'
            //       style={{ width: `${progress}%` }}
            //     />
            //   )}
            //   {/* Inner Ring untuk Depth */}
            //   <div className='absolute inset-0 bg-white/20 rounded-full group-hover:bg-white/40' />
            // </button>
          ))}
        </div>
      </div>
    </div>
  );
}
