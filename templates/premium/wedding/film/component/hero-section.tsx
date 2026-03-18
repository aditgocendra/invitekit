import { RefObject } from "react";
import { CrossfadeCarouselHero } from "./carousel";

const DEFAULT_IMAGES = [
  {
    img: "template/wedding/premium/film/cover.webp",
    title: "Premium Wedding Film Template",
    alt: "Premium Wedding Film Template",
  },
  {
    img: "template/wedding/premium/film/test2.webp",
    title: "Premium Wedding Film Template",
    alt: "Premium Wedding Film Template",
  },
  {
    img: "template/wedding/premium/film/test3.webp",
    title: "Premium Wedding Film Template",
    alt: "Premium Wedding Film Template",
  },
];
export default function HeroSection({
  ref,
  stories,
  guestName,
}: {
  ref: RefObject<HTMLDivElement | null>;
  stories?: {
    img: string;
    title: string;
    desc: string;
  }[];
  guestName?: string;
}) {
  const carouselItems: Array<{ img: string; title: string; alt: string }> = [
    ...DEFAULT_IMAGES,
  ];

  if (stories && stories.length > 0) {
    stories.map((val, index) => {
      carouselItems[index] = {
        img: val.img,
        title: val.title,
        alt: val.desc,
      };
    });
  }
  return (
    <section
      ref={ref}
      className='w-full min-h-screen relative'>
      <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent' />

      <CrossfadeCarouselHero
        duration={10000}
        items={carouselItems}
        guestName={guestName}
      />
    </section>
  );
}
