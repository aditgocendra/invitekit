"use client";

import { JsonValue } from "@/types/json";
import dynamic from "next/dynamic";

// Dynamic import PreviewClient DI DALAM Client Component (✅ Allowed)
const PreviewClient = dynamic(() => import("./client-preview/PreviewClient"), {
  ssr: false,
  loading: () => (
    <div className='flex min-h-screen w-full items-center justify-center bg-linear-to-br from-pink-50 via-white to-indigo-50 p-8'>
      <div className='flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl'>
        <div className='h-12 w-12 animate-spin rounded-2xl bg-linear-to-r from-pink-400 to-purple-500 shadow-lg'></div>
        <p className='text-lg font-medium text-gray-700'>
          Load Invitation Preview...
        </p>
      </div>
    </div>
  ),
});

type Props = {
  initialConfig: JsonValue;
  TemplateComponent: (props: { config: JsonValue }) => React.ReactNode;
};

export default function ClientPreviewWrapper({
  initialConfig,
  TemplateComponent,
}: Props) {
  return (
    <PreviewClient
      initialConfig={initialConfig}
      TemplateComponent={TemplateComponent}
    />
  );
}
