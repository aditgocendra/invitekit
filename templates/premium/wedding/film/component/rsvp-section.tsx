import { DialogRsvp } from "@/components/dialog/dialog-rsvp";
import { ChevronsDown } from "lucide-react";
import Image from "next/image";
import { RefObject, useEffect, useRef, useState } from "react";

const DEFAULT_IMAGES = [
  "template/wedding/premium/film/cover.webp",
  "template/wedding/premium/film/cover.webp",
  "template/wedding/premium/film/cover.webp",
];

export default function RsvpSection({
  ref,
  imageUrls,
  invitationId,
  scrollToView,
}: {
  ref: RefObject<HTMLDivElement | null>;
  scrollToView: (view: "view1" | "view2" | "view3" | "view4" | "view5") => void;
  invitationId?: string;
  imageUrls?: string[];
}) {
  // const image1 = images ? images[0] : DEFAULT_IMAGES[0];
  // const image2 = images && images.length > 1 ? images[1] : DEFAULT_IMAGES[1];

  const images: string[] = [...DEFAULT_IMAGES];

  if (imageUrls && imageUrls.length > 0) {
    imageUrls.map((url, index) => {
      images[index] = url;
    });
  }

  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // hanya sekali
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className='w-full min-h-screen'>
      <div className='relative h-screen'>
        {/* overlay background */}
        <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent' />

        <div className='absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-6'>
          <div className='relative p-1 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]'>
            {/* kiri atas */}
            <div
              className={`absolute top-4 left-1/2 -translate-x-1/3 bg-white p-1 rounded-lg rotate-3 transition-opacity duration-1000 ease-out
                ${isVisible ? "opacity-100" : "opacity-0"}
                transform -translate-y-5 `}>
              <Image
                src={`https://s3.nevaobjects.id/invitekit-bucket/${images[0]}`}
                width={200}
                height={200}
                className='object-cover rounded-sm'
                alt='RSVPWedding Minimal Template'
              />
            </div>

            {/* kanan bawah */}
            <div
              className={`absolute bottom-4 right-1/2 translate-x-1/3 bg-white p-1 rounded-lg -rotate-3 transition-opacity duration-1000 ease-out
                ${isVisible ? "opacity-100" : "opacity-0"}
                ${isVisible ? "delay-700" : ""}
                transform -translate-y-5 `}>
              <Image
                src={`https://s3.nevaobjects.id/invitekit-bucket/${images[1]}`}
                width={200}
                height={200}
                className='object-cover rounded-sm'
                alt='RSVPWedding Minimal Template'
              />
            </div>

            {/* card yang muncul saat terlihat */}
            <div
              ref={cardRef}
              className={`
                absolute top-12 right-1/2 translate-x-1/12 bg-white p-1 rounded-lg rotate-5
                transition-opacity duration-1000 ease-out
                ${isVisible ? "opacity-100" : "opacity-0"}
                ${isVisible ? "delay-1400" : ""}
                transform -translate-y-5 
              `}>
              <Image
                src={`https://s3.nevaobjects.id/invitekit-bucket/${images[2]}`}
                width={200}
                height={200}
                className='object-cover rounded-sm'
                alt='RSVPWedding Minimal Template'
              />
            </div>
          </div>

          <p
            className={`font-fredoka w-full text-sm sm:text-xl text-white text-center transition-opacity duration-1000 ease-out
              ${isVisible ? "opacity-100" : "opacity-0"}
              ${isVisible ? "delay-500" : ""}
              transform -translate-y-5 `}>
            Please help us prepare by confirming your attendance at our wedding
            through the form below and sending your good wishes
          </p>

          <DialogRsvp invitationId={invitationId} />
        </div>

        <button
          className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce '
          onClick={() => scrollToView("view5")}>
          <ChevronsDown
            size={32}
            className='text-white'
          />
        </button>
      </div>
    </section>
  );
}
