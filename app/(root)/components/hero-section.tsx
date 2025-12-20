import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import Image from "next/image";
import { RefObject } from "react";

export default function HeroSection({
  ref,
}: {
  ref: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      ref={ref}
      className='relative min-h-screen flex items-center justify-center overflow-hidden from-background via-card to-accent/20'>
      {/* Background Pattern */}

      <div className='container mx-auto px-4 py-20 lg:py-32 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* Left Content */}
          <div className='text-center lg:text-left space-y-8'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full text-sm font-body font-medium text-accent-foreground'>
              <Sparkles
                name='SparklesIcon'
                size={16}
                className='text-primary'
              />
              <span>Save up to 90% off printed invitations</span>
            </div>

            <h1 className='font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight'>
              Create a Stunning Digital Invitation{" "}
              <span className='text-primary'>In Minutes</span>
            </h1>

            <p className='text-lg lg:text-xl text-text-secondary font-body leading-relaxed max-w-2xl mx-auto lg:mx-0'>
              Create beautiful digital invitation, share them instantly via
              WhatsApp, and easily track RSVPs. No printing hassle, no expensive
              costs.
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
              <Button size='xxl'>Start Free Now</Button>

              <Button
                size='xxl'
                variant='outline'>
                View Example
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className='relative'>
            <div className='relative rounded-2xl overflow-hidden shadow-cta'>
              <Image
                src={"/assets/character-art.webp"}
                width={1024}
                height={1024}
                alt='Elegant invitation displayed on smartphone with floral decorations and rings on marble surface'
                className='w-full h-auto'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'>
        <ChevronDown
          name='ChevronDownIcon'
          size={32}
          className='text-primary'
        />
      </div>
    </section>
  );
}
