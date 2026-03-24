import { RefObject } from "react";
import { CrossfadeCarouselSession } from "./carousel";

export default function SessionSection({
  ref,
  // scrollToView,
  akad,
  reception,
}: {
  ref: RefObject<HTMLDivElement | null>;
  scrollToView: (view: "view1" | "view2" | "view3" | "view4" | "view5") => void;
  akad?: {
    time: Date;
    place: string;
    latlong: string;

    address: string;
    image?: string;
  };
  reception?: {
    time: Date;
    place: string;
    latlong: string;
    address: string;
    image?: string;
  };
}) {
  const defaultImages = [
    {
      img: "template/wedding/premium/film/cover.webp",
      alt: "Premium Wedding Film Template",
      title: "Akad",
    },
    {
      img: "template/wedding/premium/film/test3.webp",
      alt: "Premium Wedding Film Template",
      title: "Wedding Reception",
    },
  ];

  if (akad?.image) {
    defaultImages[0] = {
      ...defaultImages[0], // Preserve alt/title
      img: akad.image,
    };
  }
  if (reception?.image) {
    defaultImages[1] = {
      ...defaultImages[1], // Preserve alt/title
      img: reception.image,
    };
  }

  return (
    <section
      ref={ref}
      className='w-full min-h-screen relative'>
      <CrossfadeCarouselSession
        items={defaultImages}
        duration={10000}
        akad={akad}
        reception={reception}
      />
    </section>
  );
}
