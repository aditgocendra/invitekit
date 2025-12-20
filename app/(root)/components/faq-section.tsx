import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeQuestionMark, MessageCircleQuestionMark } from "lucide-react";
import { RefObject } from "react";

const FAQS = [
  {
    question: "Are digital invitations as elegant as printed invitations?",
    answer:
      "Absolutely! Our templates are designed by professional designers with visual quality equal to or even better than printed invitations. Plus, digital invitations can display animations, music, and videos that printed invitations simply cannot offer.",
  },
  {
    question: "What if my guests are not familiar with technology?",
    answer:
      "Our invitations are very easy to access. Guests only need to click the link you send via WhatsApp—no need to download an app or register. The interface is intuitive and can be opened on all types of smartphones.",
  },
  {
    question: "Can I edit the invitation after it has been shared?",
    answer:
      "Yes! This is one of the main advantages of digital invitations. You can change event details, the location, or other information at any time, and the changes will immediately be visible to all guests who have received the link.",
  },
  {
    question: "How long does it take to create an invitation?",
    answer:
      "On average, only 30 minutes! Choose a template (5 minutes), fill in the event details (15 minutes), then preview and finalize (10 minutes). This is much faster than printed invitations, which usually take 2–3 weeks.",
  },
  {
    question: "Is there a limit on the number of guests?",
    answer:
      "For the Premium plan, there is no limit on the number of guests. You can invite 50, 200, or even 1,000 guests for the same price. The Free plan is limited to a maximum of 50 guests.",
  },
  {
    question: "How do guests confirm their attendance (RSVP)?",
    answer:
      'Guests simply click the "Confirm Attendance" button in the invitation, then choose "Attending" or "Not Attending". Their confirmation goes directly into your dashboard in real time, complete with their names and the number of guests who will attend.',
  },
  {
    question: "Can the invitation be accessed without an internet connection?",
    answer:
      "The invitation requires an internet connection the first time it is opened. However, after it loads, most of the content will be cached in the browser so it can be accessed again with a minimal connection.",
  },
];

export default function FAQSection({
  ref,
}: {
  ref: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      ref={ref}
      className={`py-16 lg:py-24  bg-background `}>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto mb-12 lg:mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-warning/10 rounded-full text-sm font-body font-medium text-warning mb-4'>
            <BadgeQuestionMark size={16} />
            <span>General Questions</span>
          </div>

          <h2 className='font-headline text-3xl lg:text-5xl font-bold text-foreground mb-4'>
            Have Questions? We Answer
          </h2>

          <p className='text-lg text-text-secondary font-body'>
            Find answers to the most frequently asked questions
          </p>
        </div>

        {/* FAQ List */}
        <div className='max-w-5xl mx-auto space-y-4'>
          <Accordion
            type='single'
            collapsible
            className='w-full space-y-6'
            defaultValue='item-1'>
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className='border rounded-xl px-4 shadow-sm'>
                <AccordionTrigger className='font-heading text-lg font-bold'>
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className='flex flex-col gap-4 text-balance'>
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Card className='mt-12 w-full max-w-5xl mx-auto shadow-sm'>
          <CardHeader>
            <CardTitle className='flex flex-col gap-4 justify-center items-center'>
              <MessageCircleQuestionMark size={40} />
              <h3 className='text-xl font-bold'>Still Have Questions ? </h3>
            </CardTitle>
            <CardDescription className='flex justify-center'>
              Don&apos;t worry, we&apos;re here to help. Reach out to our
              support team and we&apos;ll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <Button className='min-h-12 min-w-52'>Chat with us</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
