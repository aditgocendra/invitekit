"use client";

import { useEffect, useRef, useState } from "react";
import CalendarTime from "@/components/calendar-time";
import { Button } from "@/components/ui/button";
import { FieldInput, FieldTextArea } from "@/components/ui/field";
import type { JsonValue } from "@/types/json";

import { WeddingBasicMinimalFormSchema } from "@/validation/template.validation";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Resolver } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { DeepPartial } from "@/types/preview-frame";
import { redirect } from "next/navigation";
import { useLoading } from "@/hooks/use-loading";
import Dropzone from "@/components/ui/dropzone";
import DialogPickerLocation from "@/components/dialog/dialog-picker-location";
import Image from "next/image";
import { BadgeMinus } from "lucide-react";

type BasicMinimalWType = z.infer<typeof WeddingBasicMinimalFormSchema>;
type BasicMinimalWDraft = DeepPartial<BasicMinimalWType>;

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export default function FormWeddingBasicMinimal({
  templateKey,
  thumb,
  config,
  eventId,
}: {
  templateKey: string;
  thumb: string;
  config?: JsonValue;
  eventId?: string;
}) {
  const { withLoading } = useLoading();
  const parsed = WeddingBasicMinimalFormSchema.safeParse(config);

  const defaultValues: BasicMinimalWType | undefined = config
    ? parsed.success
      ? parsed.data
      : WeddingBasicMinimalFormSchema.parse({})
    : undefined;

  const form = useForm<BasicMinimalWType>({
    defaultValues,
    resolver: zodResolver(
      WeddingBasicMinimalFormSchema,
    ) as Resolver<BasicMinimalWType>,
  });

  const [images, setImages] = useState<Array<File | string>>(
    defaultValues?.gallery ? defaultValues.gallery : [],
  );

  const [imageDeleted, setImageDeleted] = useState<Array<string>>([]);

  // ✅ gunakan useWatch agar kompatibel dengan React Compiler (hindari watch())
  const values = useWatch<BasicMinimalWType>({
    control: form.control,
  });

  // realtime draft -> CustomEvent (debounce setTimeout)
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!values) return;

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const galleryUrls = images.map((img) =>
        typeof img === "string" ? img : URL.createObjectURL(img),
      );

      const draft: BasicMinimalWDraft = {
        ...values,
        gallery: galleryUrls,
      };
      window.dispatchEvent(
        new CustomEvent<BasicMinimalWDraft>("INVITEKIT_FORM_DRAFT", {
          detail: draft,
        }),
      );
    }, 200);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [values, images]);

  const onSubmitHandler = async (data: BasicMinimalWType) => {
    const formData = new FormData();

    // Append images (dari state atau input file terpisah)
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    if (imageDeleted) {
      imageDeleted.map((path) => formData.append("imageDeleted", path));
    }

    // Append templateKey
    formData.append("templateKey", templateKey);

    // Append thumb
    formData.append("thumb", thumb);

    // Append form values sebagai JSON string
    formData.append("values", JSON.stringify(data));

    await withLoading(async () => {
      const response = await fetch(
        `/api/event${eventId ? `?id=${eventId}` : ""}`,
        {
          method: eventId ? "PUT" : "POST",
          body: formData,
        },
      );

      if (!response.ok) return;

      if (!eventId) {
        const result = await response.json();
        redirect(`/dashboard/wedding/decoration?id=${result.data.id}`);
      }
    });
  };

  const handleReceptionLocationSelect = (location: LocationData) => {
    form.setValue("reception.latlong", `${location.lat},${location.lng}`);
    form.setValue("reception.address", location.address);
  };

  const handleAkadLocationSelect = (location: LocationData) => {
    form.setValue("akad.latlong", `${location.lat},${location.lng}`);
    form.setValue("akad.address", location.address);
  };

  const onRemoveImage = (index: number) => {
    if (images && images.length === 1) {
      setImages([]);
    } else {
      setImages(images.filter((_, i) => i !== index));
    }

    if (typeof images[index] === "string") {
      setImageDeleted([...imageDeleted, images[index]]);
    }
  };

  return (
    <form
      className='space-y-4'
      onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
        <span className='text-sm font-semibold'>Groom & Bride</span>
        <div className='flex gap-2'>
          <FieldInput
            label='Groom Name'
            placeholder='Ex : Yono'
            {...form.register("groomName")}
            errorMessage={form.formState.errors.groomName?.message}
          />
          <FieldInput
            label='Bride Name'
            placeholder='Ex : Yani'
            {...form.register("brideName")}
            errorMessage={form.formState.errors.brideName?.message}
          />
        </div>

        <div className='flex gap-2'>
          <FieldInput
            label='Parent Groom Name'
            placeholder='Ex : Yani & Yoni'
            {...form.register("parentGroomName")}
            errorMessage={form.formState.errors.parentGroomName?.message}
          />
          <FieldInput
            label='Parent Bride Name'
            placeholder='Ex : Yani & Yoni'
            {...form.register("parentBrideName")}
            errorMessage={form.formState.errors.parentBrideName?.message}
          />
        </div>
      </div>

      {/* AKAD */}
      <div className='flex flex-col gap-4 border rounded-lg p-2.5'>
        <span className='text-sm font-semibold'>Akad</span>
        <CalendarTime
          control={form.control}
          name='akad.time'
          label='Akad Time'
        />

        <DialogPickerLocation
          onLocationSelect={handleAkadLocationSelect}
          triggerLabel='Setup Akad Location'
        />

        <div
          className={`${form.getValues("akad.address") ? "flex flex-col gap-4" : "hidden"}`}>
          <FieldInput
            label='Place'
            placeholder='Place'
            {...form.register("akad.place")}
          />

          <FieldTextArea
            label='Address'
            placeholder='Address Place'
            {...form.register("akad.address")}
          />
        </div>
      </div>

      {/* RECEPTION */}
      <div className='flex flex-col gap-4 border rounded-lg p-2.5'>
        <span className='text-sm font-semibold'>Reception</span>
        <CalendarTime
          control={form.control}
          name='reception.time'
          label='Reception Time'
        />

        <DialogPickerLocation
          onLocationSelect={handleReceptionLocationSelect}
          triggerLabel='Setup Reception Location'
        />

        <div
          className={`${form.getValues("reception.address") ? "flex flex-col gap-4" : "hidden"}`}>
          <FieldInput
            label='Place'
            placeholder='Place'
            {...form.register("reception.place")}
          />

          <FieldTextArea
            label='Address'
            placeholder='Address Place'
            {...form.register("reception.address")}
          />
        </div>
      </div>

      <div className='border rounded-lg p-2.5 flex flex-col gap-2.5'>
        <span className='text-sm font-semibold'>RSVP Image (Optional)</span>
        <div className='flex gap-2 flex-wrap'>
          {images &&
            images.map((image, index) => (
              <div
                key={index}
                className='relative group'>
                <Image
                  src={
                    typeof image === "string"
                      ? `https://s3.nevaobjects.id/invitekit-bucket/${image}`
                      : URL.createObjectURL(image)
                  }
                  width={96}
                  height={96}
                  alt='icon'
                  className='object-cover border border-slate-200 rounded-md cursor-pointer '
                />
                <Button
                  variant={"ghost"}
                  className='absolute bottom-0 right-0 hidden group-hover:flex'
                  onClick={() => onRemoveImage(index)}>
                  <BadgeMinus />
                </Button>
              </div>
            ))}

          <Dropzone
            multiple={true}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles.length > 2) return;

              setImages((prevImages) => {
                // ✅ Validasi dengan state terbaru
                if (prevImages.length + acceptedFiles.length > 2) {
                  return prevImages;
                }
                return [...prevImages, ...acceptedFiles];
              });
            }}
            className='w-24 h-24'
          />
        </div>
      </div>

      <FieldTextArea
        label='Thanks Message'
        placeholder='Thanks Message'
        {...form.register("thanksMessage")}
      />

      <Button
        className='w-full'
        type='submit'>
        Save
      </Button>

      {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
    </form>
  );
}
