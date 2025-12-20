import {
  AlarmClock,
  CheckIcon,
  ClipboardList,
  HandCoins,
  TriangleAlert,
  Van,
  XIcon,
} from "lucide-react";
import { RefObject, useEffect, useState } from "react";

const PROBLEMS = [
  {
    icon: HandCoins,
    title: "Expensive printing costs",
    description:
      "Printing traditional invitations can cost Rp. 1-3 million for 200 guests.",
    cost: "Rp 10.000/invitation",
  },
  {
    icon: AlarmClock,
    title: "Long & Complicated Process",
    description: "Design, printing and distribution takes 2-3 weeks.",
    cost: "2-3 weeks",
  },
  {
    icon: Van,
    title: "Difficult Distribution",
    description:
      "Have to send one by one, risk of getting lost or arriving late.",
    cost: "Rp. 500,000 + shipping",
  },
  {
    icon: ClipboardList,
    title: "Manual RSVP",
    description:
      "Record guest confirmations one by one via telephone or WhatsApp.",
    cost: "Hours of time",
  },
];

export default function ProblemSection({
  ref,
}: {
  ref: RefObject<HTMLDivElement | null>;
}) {
  const [guestCount, setGuestCount] = useState(200);
  const [traditionalCost, setTraditionalCost] = useState(0);
  const [digitalCost, setDigitalCost] = useState(0);

  const formatNumber = (num: number): string => {
    return num.toLocaleString("id-ID");
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setGuestCount(Math.max(50, Math.min(1000, value)));
  };

  useEffect(() => {
    setTraditionalCost(guestCount * 10000);
    setDigitalCost(guestCount * 1000);
  }, [guestCount]);

  return (
    <section
      ref={ref}
      className={`py-16 lg:py-24 bg-muted `}>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto mb-12 lg:mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-warning/10 rounded-full text-sm font-body font-medium text-warning mb-4'>
            <TriangleAlert size={16} />
            <span>Traditional Invitation Issues</span>
          </div>

          <h2 className='font-headline text-3xl lg:text-5xl font-bold text-foreground mb-4'>
            Print Those Invitations Expensive & Troublesome
          </h2>

          <p className='text-lg text-text-secondary font-body'>
            The average couple spends millions of rupiah and weeks just on
            invitations.
          </p>
        </div>

        {/* Problems Grid */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16'>
          {PROBLEMS.map((problem, index) => (
            <div
              key={index}
              className='bg-card rounded-xl p-6 shadow-card hover:shadow-cta transition-default border border-border'>
              <div className='w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4'>
                <problem.icon size={24} />
              </div>

              <h3 className='font-headline text-xl font-bold text-foreground mb-2'>
                {problem.title}
              </h3>

              <p className='text-sm text-text-secondary font-body mb-3'>
                {problem.description}
              </p>

              <div className='text-warning font-body font-semibold text-sm'>
                {problem.cost}
              </div>
            </div>
          ))}
        </div>

        {/* Cost Calculator */}
        <div className='max-w-4xl mx-auto bg-card rounded-2xl p-6 lg:p-8 shadow-cta border border-border'>
          <h3 className='font-headline text-2xl font-bold text-foreground mb-6 text-center'>
            Calculate Your Savings
          </h3>

          {/* Guest Count Input */}
          <div className='mb-8'>
            <label className='block text-sm font-body font-medium text-foreground mb-2'>
              Number of Invited Guests
            </label>
            <input
              type='number'
              defaultValue={200}
              onChange={handleGuestCountChange}
              min='50'
              max='1000'
              className='w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary focus:outline-none font-body text-lg'
            />
            <div className='mt-2 text-sm text-text-secondary font-body'>
              Slide or type the number of guests (50-1000)
            </div>
          </div>

          {/* Comparison */}
          <div className='grid md:grid-cols-2 gap-6'>
            {/* Traditional Cost */}
            <div className='bg-warning/5 rounded-xl p-6 border-2 border-warning/20'>
              <div className='flex items-center gap-2 mb-4'>
                <XIcon
                  size={20}
                  className='text-warning'
                />

                <h4 className='font-headline text-lg font-bold text-foreground'>
                  Printed Invitations
                </h4>
              </div>

              <div className='space-y-3 mb-4'>
                <div className='flex justify-between text-sm font-body'>
                  <span className='text-text-secondary'>
                    {`Print ${200} Pcs`}
                  </span>
                  <span className='font-semibold'>
                    Rp {formatNumber(guestCount * 10000)}
                  </span>
                </div>
                <div className='flex justify-between text-sm font-body'>
                  <span className='text-text-secondary'>Design</span>
                  <span className='font-semibold'>Rp 500.000</span>
                </div>
                <div className='flex justify-between text-sm font-body'>
                  <span className='text-text-secondary'>Distribution</span>
                  <span className='font-semibold'>Rp 300.000</span>
                </div>
              </div>

              <div className='pt-4 border-t border-warning/20'>
                <div className='flex justify-between items-center'>
                  <span className='font-body font-semibold text-foreground'>
                    Total
                  </span>
                  <span className='font-headline text-2xl font-bold text-warning'>
                    Rp {formatNumber(traditionalCost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Digital Cost */}
            <div className='bg-success/5 rounded-xl p-6 border-2 border-success/20'>
              <div className='flex items-center gap-2 mb-4'>
                <CheckIcon
                  size={20}
                  className='text-success'
                />
                <h4 className='font-headline text-lg font-bold text-foreground'>
                  InviteKit Digital
                </h4>
              </div>

              <div className='space-y-3 mb-4'>
                <div className='flex justify-between text-sm font-body'>
                  <span className='text-text-secondary'>Premium Package</span>
                  <span className='font-semibold'>
                    Rp {formatNumber(digitalCost)}
                  </span>
                </div>
                <div className='flex justify-between text-sm font-body'>
                  <span className='text-text-secondary'>Unlimited Guest</span>
                  <span className='font-semibold text-success'>Free</span>
                </div>
                <div className='flex justify-between text-sm font-body'>
                  <span className='text-text-secondary'>Tracking RSVP</span>
                  <span className='font-semibold text-success'>Free</span>
                </div>
              </div>

              <div className='pt-4 border-t border-success/20'>
                <div className='flex justify-between items-center'>
                  <span className='font-body font-semibold text-foreground'>
                    Total
                  </span>
                  <span className='font-headline text-2xl font-bold text-success'>
                    Rp {formatNumber(digitalCost)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className='mt-6 bg-primary/10 rounded-xl p-6 text-center'>
            <div className='text-sm font-body text-text-secondary mb-2'>
              You Save
            </div>
            <div className='font-headline text-3xl lg:text-4xl font-bold text-primary mb-2'>
              Rp {formatNumber(traditionalCost - digitalCost)}
            </div>
            <div className='text-sm font-body text-text-secondary'>
              Or{" "}
              {Math.round(
                ((traditionalCost - digitalCost) / traditionalCost) * 100
              )}
              % cheaper!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
