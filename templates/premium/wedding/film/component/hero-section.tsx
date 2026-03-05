import { RefObject } from "react";
import { CrossfadeCarouselHero } from "./carousel";

export default function HeroSection({
  ref,
  scrollToView,
  // groomName,
  // brideName,
  // parentGroomName,
  // parentBrideName,
  // akadDate,
}: {
  ref: RefObject<HTMLDivElement | null>;
  scrollToView: (view: "view1" | "view2" | "view3" | "view4" | "view5") => void;
  // groomName: string | undefined;
  // brideName: string | undefined;
  // parentGroomName: string | undefined;
  // parentBrideName: string | undefined;
  // akadDate: string | undefined;
}) {
  return (
    <section
      ref={ref}
      className='w-full min-h-screen relative'>
      <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent' />

      <CrossfadeCarouselHero
        duration={10000}
        items={[
          {
            img: "/assets/templates/premium/wedding/film/cover.webp",
            alt: "Premium Wedding Film Template",
            title: "Premium Wedding Film Template",
          },
          {
            img: "/assets/templates/premium/wedding/film/test3.webp",
            alt: "Premium Wedding Film Template",
            title: "Premium Wedding Film Template",
          },

          {
            img: "/assets/templates/premium/wedding/film/test2.webp",
            alt: "Premium Wedding Film Template",
            title: "Premium Wedding Film Template",
          },
        ]}
      />
    </section>
  );
}
