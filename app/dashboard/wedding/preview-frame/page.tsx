"use client";

import { useEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

type DraftConfigMessage<TValues extends FieldValues> = Readonly<{
  type: "DRAFT_CONFIG";
  payload: TValues;
}>;

type Props<TValues extends FieldValues> = {
  form: UseFormReturn<TValues>;
  eventId: string;
  delayMs?: number;
};

export function PreviewFrameBridge<TValues extends FieldValues>({
  form,
  eventId,
  delayMs = 200,
}: Props<TValues>) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<number | null>(null);
  const latestValuesRef = useRef<TValues | null>(null);

  useEffect(() => {
    const sub = form.watch((values, meta) => {
      if (meta?.type !== "change") return;

      latestValuesRef.current = values as TValues;

      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        const latest = latestValuesRef.current;
        if (!latest) return;

        const msg: DraftConfigMessage<TValues> = { type: "DRAFT_CONFIG", payload: latest };
        iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin);
      }, delayMs);
    });

    return () => {
      sub.unsubscribe();
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [form, delayMs]);

  return <iframe ref={iframeRef} className="w-full h-full" src={`/preview?id=${eventId}`} />;
}
