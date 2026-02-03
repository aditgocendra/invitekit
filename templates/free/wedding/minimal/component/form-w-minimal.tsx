"use client";

import { useEffect, useRef } from "react";
import CalendarTime from "@/components/calendar-time";
import { Button } from "@/components/ui/button";
import { FieldInput, FieldTextArea } from "@/components/ui/field";
import type { JsonValue } from "@/types/json";

import { TemplateWeddingMinimalFormSchema } from "@/validation/template.validation";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Resolver } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { DeepPartial } from "@/types/preview-frame";
import { redirect } from "next/navigation";
import { useLoading } from "@/hooks/use-loading";

type MinimalWType = z.infer<typeof TemplateWeddingMinimalFormSchema>;
type MinimalWDraft = DeepPartial<MinimalWType>;

export default function FormWeddingMinimal({
  templateKey,
  config,
  eventId,
}: {
  templateKey: string;
  config?: JsonValue;
  eventId?: string;
}) {
  const { withLoading } = useLoading();
  const parsed = TemplateWeddingMinimalFormSchema.safeParse(config);

  const defaultValues: MinimalWType | undefined = config
    ? parsed.success
      ? parsed.data
      : TemplateWeddingMinimalFormSchema.parse({})
    : undefined;

  const form = useForm<MinimalWType>({
    defaultValues,
    resolver: zodResolver(
      TemplateWeddingMinimalFormSchema,
    ) as Resolver<MinimalWType>,
  });

  // ✅ gunakan useWatch agar kompatibel dengan React Compiler (hindari watch())
  const values = useWatch<MinimalWType>({
    control: form.control,
  });

  // realtime draft -> CustomEvent (debounce setTimeout)
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // values bisa undefined di render awal
    if (!values) return;

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const draft: MinimalWDraft = values;
      window.dispatchEvent(
        new CustomEvent<MinimalWDraft>("INVITEKIT_FORM_DRAFT", {
          detail: draft,
        }),
      );
    }, 200);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [values]);

  const onSubmitHandler = async (data: MinimalWType) => {
    const body = { templateKey, values: data };

    await withLoading(async () => {
      const response = await fetch(
        `/api/event${eventId ? `?id=${eventId}` : ""}`,
        {
          method: eventId ? "PUT" : "POST",
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) return;

      if (!eventId) {
        const result = await response.json();
        redirect(`/dashboard/wedding/decoration?id=${result.data.id}`);
      }
    });
  };

  return (
    <form
      className='space-y-4'
      onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div className='flex gap-2'>
        <FieldInput
          label='Groom Name'
          placeholder='Ex : Yono'
          {...form.register("groomName")}
        />
        <FieldInput
          label='Bride Name'
          placeholder='Ex : Yani'
          {...form.register("brideName")}
        />
      </div>

      <CalendarTime
        control={form.control}
        name='resepsiTime'
        label='Resepsi Time'
      />

      <FieldTextArea
        label='Quote'
        placeholder='Quotes'
        {...form.register("quote")}
        errorMessage={form.formState.errors.quote?.message}
      />

      <FieldInput
        label='Place'
        placeholder='Place'
        {...form.register("place")}
      />

      <FieldTextArea
        label='Address'
        placeholder='Address Place'
        {...form.register("address")}
        errorMessage={form.formState.errors.address?.message}
      />

      <Button
        className='w-full'
        type='submit'>
        Save
      </Button>
    </form>
  );
}
