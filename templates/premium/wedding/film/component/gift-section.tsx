import { Button } from "@/components/ui/button";
import { ChevronsDown, Link } from "lucide-react";
import Image from "next/image";
import { RefObject } from "react";

// const DEFAULT_IMAGES = [
//   "template/wedding/basic/rsvp-1.webp",
//   "template/wedding/basic/rsvp-2.webp",
// ];

export default function GiftSection({
  ref,
  scrollToView,
  giftCard1 = {
    bankName: "Seabank",
    number: 431212321232,
    holder: "John Doe",
  },
  giftCard2 = {
    bankName: "BCA",
    number: 123456723456,
    holder: "Doe John",
  },
  giftCardBg = "template/wedding/premium/film/cover.webp",
}: {
  ref: RefObject<HTMLDivElement | null>;
  scrollToView: (view: "view1" | "view2" | "view3" | "view4" | "view5") => void;
  giftCard1?: {
    bankName: string;
    number: number;
    holder: string;
  };
  giftCard2?: {
    bankName: string;
    number: number;
    holder: string;
  };
  giftCardBg?: string;
}) {
  // const cardRef = useRef<HTMLDivElement>(null);
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   const el = cardRef.current;
  //   if (!el) return;

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         setIsVisible(true);
  //         observer.disconnect(); // hanya sekali
  //       }
  //     },
  //     { threshold: 0.1 },
  //   );

  //   observer.observe(el);
  //   return () => observer.disconnect();
  // }, []);

  const formatCardNumber = (input: string | number, minLength = 10): string => {
    const numStr = String(input).replace(/\D/g, "");
    if (numStr.length >= minLength) {
      const first4 = numStr.slice(0, 4);
      const last4 = numStr.slice(-4);
      const stars = "*".repeat(Math.max(0, numStr.length - 8));
      return `${first4} ${stars} ${last4}`;
    }
    return numStr;
  };

  return (
    <section
      ref={ref}
      className='w-full min-h-screen'>
      <div className='relative h-screen'>
        {/* overlay background */}
        <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent' />

        <div className='absolute inset-0 grayscale-25'>
          <Image
            src={`https://s3.nevaobjects.id/invitekit-bucket/${giftCardBg}`}
            width={1920}
            height={1080}
            className='h-screen w-full object-cover '
            alt='Wedding Minimal Template'
          />
        </div>

        <div className='w-full p-4 absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-12'>
          <h1 className='font-alexandria font-semibold text-white text-5xl sm:text-6xl'>
            Sign Of Love
          </h1>

          <p
            className={`font-fredoka font-semibold w-full text-lg sm:text-xl text-white text-center  `}>
            Thank you for adding to the excitement of our wedding with your
            presence and beautiful gifts.
          </p>

          <div className='w-full flex flex-col justify-center items-center sm:flex-row gap-4 sm:gap-2'>
            <div className='relative bg-[#0E1424] w-full h-50 sm:w-[400px] sm:h-60 rounded-3xl'>
              <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent rounded-3xl' />

              <div className='absolute inset-0 text-white p-6 sm:p-8'>
                <div className='flex flex-col justify-between h-full'>
                  <div className='flex flex-col gap-2.5'>
                    <span className='font-semibold'>{giftCard1.bankName}</span>
                    <span className='flex gap-4 justify-between font-alexandria text-2xl sm:text-3xl'>
                      {formatCardNumber(giftCard1.number)}
                      <Button
                        variant={"secondary"}
                        size={"icon"}>
                        <Link />
                      </Button>
                    </span>
                  </div>

                  <div className='flex flex-col gap-1.5'>
                    <span className='text-xs sm:text-sm tracking-widest'>
                      CARDHOLDER
                    </span>
                    <span className='text-xs sm:text-sm font-semibold'>
                      {giftCard1.holder}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='relative bg-[#0E1424] w-full h-50 sm:w-[400px] sm:h-60 rounded-3xl'>
              <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent rounded-3xl' />
              <div className='absolute inset-0 text-white p-6 sm:p-8'>
                <div className='flex flex-col justify-between h-full'>
                  <div className='flex flex-col gap-2.5'>
                    <span className='font-semibold'>{giftCard2.bankName}</span>
                    <span className='flex gap-4 justify-between font-alexandria text-2xl sm:text-3xl'>
                      {formatCardNumber(giftCard2.number)}
                      <Button
                        variant={"secondary"}
                        size={"icon"}>
                        <Link />
                      </Button>
                    </span>
                  </div>

                  <div className='flex flex-col gap-1.5'>
                    <span className='text-xs sm:text-sm tracking-widest'>
                      CARDHOLDER
                    </span>
                    <span className='text-xs sm:text-sm'>
                      {giftCard2.holder}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
