"use client";

import { useEffect, useState } from "react";
import type { JsonValue } from "@/types/json";
import type { DeepPartial, DraftConfigMessage } from "@/types/preview-frame";

// helper: unknown -> record
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

// ✅ type guard yang benar-benar menjamin ada "type" dan "payload"
function isDraftMessage(x: unknown): x is DraftConfigMessage<unknown> {
  return isRecord(x) && x["type"] === "DRAFT_CONFIG" && "payload" in x;
}

// shallow merge (cukup untuk field flat)
function mergeShallow<T extends Record<string, unknown>>(
  base: T,
  patch: DeepPartial<T>,
): T {
  return { ...base, ...patch };
}

type Props = {
  initialConfig: JsonValue;
  TemplateComponent: (props: { config: JsonValue }) => React.ReactNode;
};

export default function PreviewClient({
  initialConfig,
  TemplateComponent,
}: Props) {
  const [config, setConfig] = useState<JsonValue>(initialConfig);

  useEffect(() => {
    const onMessage = (e: MessageEvent<unknown>) => {
      // keamanan: wajib cek origin saat menerima postMessage [web:81]
      if (e.origin !== window.location.origin) return;

      // setelah ini, e.data bukan unknown lagi
      if (!isDraftMessage(e.data)) return;

      const payload = e.data.payload;

      setConfig((prev) => {
        // JsonValue bisa bukan object (string/number/null), jadi kita normalize
        const prevObj: Record<string, unknown> = isRecord(prev) ? prev : {};
        const patchObj: Record<string, unknown> = isRecord(payload)
          ? payload
          : {};

        return mergeShallow(prevObj, patchObj) as JsonValue;
      });
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <>{TemplateComponent({ config })}</>;
}
