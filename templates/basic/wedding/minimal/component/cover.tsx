import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Cover({
  coverImage,
  groomName,
  brideName,
  guestName,
  onOpen,
}: {
  coverImage: string;
  groomName?: string;
  brideName?: string;
  guestName?: string;
  onOpen: () => void;
}) {
  return (
    <div className='relative w-full max-w-xl lg:max-w-2xl'>
      <Image
        src={coverImage}
        width={900}
        height={1600}
        className='h-screen w-full object-cover'
        // priority
        alt='Basic Wedding Minimal Template'
      />

      <div className='absolute top-1/9 translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center text-yellow-500'>
        <p className='font-the-nautigal text-8xl '>{groomName || "Groom"}</p>
        <p className='font-the-nautigal text-6xl'>&</p>
        <p className='font-the-nautigal text-8xl'>{brideName || "Bride"}</p>
      </div>

      <div className='absolute bottom-1/9 translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center'>
        <p className='font-fredoka text-lg'>Kepada Yth.</p>
        <p className='font-fredoka text-lg'>Bapak/Ibu/Saudara</p>

        <p className='font-lobster text-4xl mt-2 mb-4'>
          {guestName || "Guest & Name"}
        </p>

        <Button
          size='xl'
          className='text-xl'
          onClick={onOpen}>
          Open Invitation
        </Button>
      </div>
    </div>
  );
}
