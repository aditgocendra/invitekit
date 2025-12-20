import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { CheckCircleIcon, CircleDollarSign } from "lucide-react";
import { RefObject } from "react";

const pricingPlans = [
  {
    title: "Free",
    description: "Get started with our free plan",
    price: 0,
    discount: null,
    isPopular: false,
    features: ["1 Active Invitation", "Free Templates", "50 Guests"],
  },
  {
    title: "Basic",
    description: "Unlock basic features",
    price: 100000,
    discount: 0.5,
    isPopular: false,
    features: [
      "5 Active Invitation",
      "Basic Templates",
      "200 Guests",
      "Instant Sharing",
      "RSVP Tracking",
      "No Watermark",
    ],
  },
  {
    title: "Premium",
    description: "Complete solution for your event",
    price: 299000,
    discount: 0.5,
    isPopular: true,
    features: [
      "10 Active Invitation",
      "Premium Templates",
      "500 Guests",
      "Instant Sharing",
      "RSVP Tracking",
      "Analytics Invitation",
      "No Watermark",
    ],
  },
  {
    title: "Enterprise",
    description: "For event organizers & wedding planners",
    price: 699000,
    discount: null,
    isPopular: false,
    features: [
      "Unlimited Active Invitation",
      "All Premium Templates",
      "Unlimited Guests",
      "Instant Sharing",
      "RSVP Tracking",
      "Analytics Invitation",
      "Bulk Creation",
      "No Watermark",
    ],
  },
];

export default function PriceSection({
  ref,
}: {
  ref: RefObject<HTMLDivElement | null>;
}) {
  const formatNumber = (num: number): string => {
    return num.toLocaleString("id-ID");
  };

  return (
    <section
      ref={ref}
      className={`min-h-screen py-16 lg:py-24 bg-muted `}>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto mb-12 lg:mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-warning/10 rounded-full text-sm font-medium text-warning mb-4'>
            <CircleDollarSign size={16} />
            <span>Transparent Price</span>
          </div>

          <h2 className='text-3xl lg:text-5xl font-bold text-foreground mb-4'>
            Choose a Package That Suits Your Needs
          </h2>

          <p className='text-lg '>
            We offer a range of pricing options to fit your budget and needs.
          </p>
        </div>

        {/* Section Content */}
        <div className='grid lg:grid-cols-4 gap-8 max-w-8xl mx-auto mb-12'>
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl shadow-card border-2 ${
                plan.isPopular ? "border-primary" : "border-border"
              }`}>
              {plan.isPopular && (
                <div className='absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold text-nowrap'>
                  Most Popular
                </div>
              )}

              <div className='px-8 pt-8 pb-4'>
                <div className='flex justify-between items-center mb-1'>
                  <h3 className='text-xl font-bold text-foreground'>
                    {plan.title}
                  </h3>
                  {plan.discount && (
                    <div className='bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs  font-semibold text-nowrap'>
                      Discount {plan.discount * 100}%
                    </div>
                  )}
                </div>

                <p className='text-sm mb-4'>{plan.description}</p>

                <div className='flex items-end gap-1 my-8'>
                  <h4 className='text-4xl font-bold text-foreground'>
                    Rp {formatNumber(plan.price * (1 - (plan.discount || 0)))}
                  </h4>
                  <p className='text-xs'>Per Month</p>
                </div>

                <Button className='w-full min-h-12'>Get Started</Button>
              </div>

              <Separator className='my-1 h-0.5 bg-secondary' />

              {/* Feature List */}
              <div className='px-8 pb-8 pt-4 '>
                {/* Head */}
                <div className='mb-6'>
                  <h4 className='text-lg font-bold text-foreground'>Feature</h4>
                  <p className='text-sm mb-4'>
                    Everything in our {plan.title} plan...
                  </p>
                </div>

                {/* List */}
                <div className='space-y-3'>
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className='flex gap-3 items-center'>
                      <CheckCircleIcon
                        size={14}
                        className='text-green-400'
                      />
                      <span className='text-sm'>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
