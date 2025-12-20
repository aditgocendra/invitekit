import {
  BatteryIcon,
  CheckCircleIcon,
  EarthIcon,
  EyeIcon,
  MonitorSmartphoneIcon,
  PencilIcon,
  ShareIcon,
  SignalIcon,
  SwatchBookIcon,
  WifiIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import { RefObject, useState } from "react";

interface SolutionSectionProps {
  className?: string;
  ref: RefObject<HTMLDivElement | null>;
}

export default function SolutionSection({
  className = "",
  ref,
}: SolutionSectionProps) {
  const [activeTab, setActiveTab] = useState<"wedding" | "circumcision">(
    "wedding"
  );

  const features = [
    {
      icon: ZapIcon,
      title: "Minutes Count",
      description:
        "Choose a template, fill in the event details, and the invitation is ready to be shared.",
    },

    {
      icon: MonitorSmartphoneIcon,
      title: "Share Instantly",
      description: "Send via WhatsApp, Instagram, or direct link.",
    },
    {
      icon: EarthIcon,
      title: "Environmentally Friendly",
      description: "No paper, no waste, help save trees",
    },
  ];

  return (
    <section
      ref={ref}
      className={`py-16 lg:py-24 bg-background ${className}`}>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto mb-12 lg:mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full text-sm font-body font-medium text-success mb-4'>
            <CheckCircleIcon size={16} />
            <span>Modern Solution</span>
          </div>

          <h2 className='font-headline text-3xl lg:text-5xl font-bold text-foreground mb-4'>
            Beautiful & Practical{" "}
            <span className='text-primary'>Digital Invitations</span>
          </h2>

          <p className='text-lg text-text-secondary font-body'>
            InviteKit makes creating invitations easy, fast, and cost-effective.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 lg:mb-16'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='bg-card rounded-xl p-6 shadow-card hover:shadow-cta transition-default border border-border group'>
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-default'>
                <feature.icon
                  size={24}
                  className='text-primary'
                />
              </div>

              <h3 className='font-headline text-xl font-bold text-foreground mb-2'>
                {feature.title}
              </h3>

              <p className='text-sm text-text-secondary font-body'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Preview */}
        <div className='max-w-6xl mx-auto bg-card rounded-2xl p-6 lg:p-8 shadow-cta border border-border'>
          <h3 className='font-headline text-2xl lg:text-3xl font-bold text-foreground mb-6 text-center'>
            How It Works
          </h3>

          {/* Tab Selector */}
          <div className='flex justify-center gap-4 mb-8'>
            <button
              onClick={() => setActiveTab("wedding")}
              className={`px-6 py-3 rounded-lg font-body font-semibold transition-default ${
                activeTab === "wedding"
                  ? "bg-primary text-primary-foreground shadow-cta"
                  : "bg-muted text-text-secondary hover:bg-accent"
              }`}>
              Wedding Invitation
            </button>
            <button
              onClick={() => setActiveTab("circumcision")}
              className={`px-6 py-3 rounded-lg font-body font-semibold transition-default ${
                activeTab === "circumcision"
                  ? "bg-primary text-primary-foreground shadow-cta"
                  : "bg-muted text-text-secondary hover:bg-accent"
              }`}>
              Circumcision Invitation
            </button>
          </div>

          {/* Preview Content */}
          <div className='grid lg:grid-cols-2 gap-8 items-center'>
            {/* Left - Mobile Mockup */}
            <div className='relative'>
              <div className='relative mx-auto max-w-[300px]'>
                {/* Phone Frame */}
                <div className='relative bg-foreground rounded-[2.5rem] p-3 shadow-cta'>
                  <div className='bg-background rounded-4xl overflow-hidden'>
                    {/* Status Bar */}
                    <div className='bg-card px-6 py-2 flex items-center justify-between text-xs'>
                      <span className='font-body'>9:41</span>
                      <div className='flex items-center gap-1'>
                        <SignalIcon size={12} />

                        <WifiIcon size={12} />

                        <BatteryIcon size={12} />
                      </div>
                    </div>

                    {/* Invitation Preview */}
                    <div className='aspect-9/16 overflow-y-auto'>
                      {activeTab === "wedding" ? (
                        <div className='p-6 text-center bg-linear-to-b from-accent/20 to-background'>
                          <div className='mb-4'>
                            <Image
                              src='/assets/art-engage.webp'
                              alt='Elegant floral wedding invitation design with gold accents and romantic typography'
                              width={192}
                              height={192}
                              className='w-full h-48 object-cover rounded-lg'
                            />
                          </div>
                          <div className='font-accent text-2xl text-primary mb-2'>
                            The Wedding of
                          </div>
                          <div className='font-headline text-3xl font-bold text-foreground mb-4'>
                            Yono & Bear
                          </div>
                          <div className='flex flex-col text-sm text-text-secondary font-body mb-4'>
                            Sabtu, 15 Januari 2025
                            <span>13:00 WIB</span>
                          </div>
                          <button className='w-full py-3 bg-primary text-primary-foreground rounded-lg font-body font-semibold'>
                            Confirm Attendance
                          </button>
                        </div>
                      ) : (
                        <div className='p-6 text-center bg-linear-to-b from-secondary/10 to-background'>
                          <div className='mb-4'>
                            <Image
                              src='/assets/art-circum.webp'
                              alt='Elegant floral wedding invitation design with gold accents and romantic typography'
                              width={192}
                              height={192}
                              className='w-full h-48 object-cover rounded-lg'
                            />
                          </div>
                          <div className='font-accent text-2xl text-primary mb-2'>
                            Circumcision Thanks
                          </div>
                          <div className='font-headline text-3xl font-bold text-foreground mb-4'>
                            El Bahliel
                          </div>
                          <div className='flex flex-col text-sm text-text-secondary font-body mb-4'>
                            Minggu, 20 Februari 2025
                            <span>13:00 WIB</span>
                          </div>
                          <button className='w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-body font-semibold'>
                            Confirm Attendance
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className='absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl' />
                <div className='absolute -bottom-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl' />
              </div>
            </div>

            {/* Right - Features List */}
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                  <SwatchBookIcon
                    size={20}
                    className='text-primary'
                  />
                </div>
                <div>
                  <h4 className='font-headline text-lg font-bold text-foreground mb-1'>
                    Select Favorite Template
                  </h4>
                  <p className='text-sm text-text-secondary font-body'>
                    Ready to wear professional designs for weddings and
                    circumcisions.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                  <PencilIcon
                    size={20}
                    className='text-primary'
                  />
                </div>
                <div>
                  <h4 className='font-headline text-lg font-bold text-foreground mb-1'>
                    Detailed Customization
                  </h4>
                  <p className='text-sm text-text-secondary font-body'>
                    Change the name, date, location and message as you wish.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                  <EyeIcon
                    size={20}
                    className='text-primary'
                  />
                </div>
                <div>
                  <h4 className='font-headline text-lg font-bold text-foreground mb-1'>
                    Real time Preview
                  </h4>
                  <p className='text-sm text-text-secondary font-body'>
                    See the final result directly on your phone screen before
                    sharing.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                  <ShareIcon
                    size={20}
                    className='text-primary'
                  />
                </div>
                <div>
                  <h4 className='font-headline text-lg font-bold text-foreground mb-1'>
                    Instant Share
                  </h4>
                  <p className='text-sm text-text-secondary font-body'>
                    Send to all guests via WhatsApp with one click
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
