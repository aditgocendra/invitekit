"use client";

import { useLoading } from "@/hooks/use-loading";
import { Spinner } from "./ui/spinner";

export default function GlobalLoadingOverlay() {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <div className='fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-2'>
        <Spinner />
        <span className='text-sm text-gray-700'>
          {"Please wait a second...."}
        </span>
      </div>
    </div>
  );
}
