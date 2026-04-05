import GridTemplate from "@/components/grid-template";
import { CheckCircleIcon } from "lucide-react";

export default function Example() {
  return (
    <section className={`py-16 lg:py-24 px-12 bg-background`}>
      {/* Section Header */}
      <div className='text-center max-w-3xl mx-auto mb-12 lg:mb-16'>
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full text-sm font-body font-medium text-success mb-4'>
          <CheckCircleIcon size={16} />
          <span>Example</span>
        </div>

        <h2 className='font-headline text-3xl lg:text-5xl font-bold text-foreground mb-4'>
          Digital Invitation <span className='text-primary'> Theme</span>
        </h2>

        <p className='text-lg text-text-secondary font-body'>
          Please choose one and create a stunning invitation
        </p>
      </div>
      <GridTemplate action='preview' />
    </section>
  );
}
