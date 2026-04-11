import { auth } from "@/lib/auth";
import { getEventStatsByUserId } from "@/services/invitation/event.services";
import { MailOpenIcon, Mails } from "lucide-react";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const eventStats = await getEventStatsByUserId(session.user.id);

  const CARDS = [
    {
      title: "Invitation Active",
      value: eventStats.totalActive,
      icon: MailOpenIcon,
    },
    {
      title: "Total Invitation",
      value: eventStats.totalEvent,
      icon: Mails,
    },
  ];

  return (
    <div className='py-4'>
      <div className='grid  lg:grid-cols-2 gap-6 mb-12 lg:mb-16'>
        {CARDS.map((item, index) => (
          <div
            key={index}
            className='flex justify-between gap-4 bg-card rounded-xl p-6 shadow-card hover:shadow-cta transition-default border border-border group'>
            <div className='flex flex-col'>
              <span className='font-headline text-lg text-gray-600 font-semibold'>
                {item.title}
              </span>

              <h3 className=' text-xl font-bold text-foreground mb-2'>
                {item.value}
              </h3>
            </div>

            <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-default'>
              <item.icon
                size={24}
                className='text-primary'
              />
            </div>

            {/* <p className='text-sm text-text-secondary font-body'>
              {feature.description}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
}
