"use client";

import { useEffect, useRef, useState } from "react";
import CalendarTime from "@/components/calendar-time";
import { Button } from "@/components/ui/button";
import { FieldInput, FieldTextArea } from "@/components/ui/field";
import type { JsonValue } from "@/types/json";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { DeepPartial } from "@/types/preview-frame";
import { redirect } from "next/navigation";
import { useLoading } from "@/hooks/use-loading";
import DialogPickerLocation from "@/components/dialog/dialog-picker-location";
import { WeddingPremiumFilmFormSchema } from "@/validation/template.validation";
import DialogGallery from "@/components/dialog/dialog-gallery";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import DialogAudioSelect from "@/components/dialog/dialog-audio-select";

type PremiumFilmlWType = z.infer<typeof WeddingPremiumFilmFormSchema>;
type PremiumFilmWDraft = DeepPartial<PremiumFilmlWType>;

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export default function FormWeddingPremiumFilm({
  templateKey,
  config,
  eventId,
}: {
  templateKey: string;
  config?: JsonValue;
  eventId?: string;
}) {
  const { withLoading } = useLoading();
  const parsed = WeddingPremiumFilmFormSchema.safeParse(config);

  const defaultValues: PremiumFilmlWType | undefined = config
    ? parsed.success
      ? parsed.data
      : WeddingPremiumFilmFormSchema.parse({})
    : undefined;

  const form = useForm<PremiumFilmlWType>({
    defaultValues,
    resolver: zodResolver(
      WeddingPremiumFilmFormSchema,
    ) as Resolver<PremiumFilmlWType>,
  });

  const [coverImages, setCoverImages] = useState<Array<string>>(
    defaultValues?.coverImages ? defaultValues.coverImages : [],
  );

  const [rsvpImages, setRsvpImages] = useState<Array<string>>(
    defaultValues?.rsvpImages ? defaultValues.rsvpImages : [],
  );

  const [thanksImages, setThanksImages] = useState<Array<string>>(
    defaultValues?.thanksImages ? defaultValues.thanksImages : [],
  );

  // ✅ gunakan useWatch agar kompatibel dengan React Compiler (hindari watch())
  const values = useWatch<PremiumFilmlWType>({
    control: form.control,
  });

  // realtime draft -> CustomEvent (debounce setTimeout)
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!values) return;

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const draft: PremiumFilmWDraft = {
        ...values,
        coverImages,
        rsvpImages,
        thanksImages,
        stories: values.stories as PremiumFilmWDraft["stories"],
        giftCard1: values.giftCard1 as PremiumFilmWDraft["giftCard1"],
        giftCard2: values.giftCard2 as PremiumFilmWDraft["giftCard2"],
      };
      window.dispatchEvent(
        new CustomEvent<PremiumFilmWDraft>("INVITEKIT_FORM_DRAFT", {
          detail: draft,
        }),
      );
    }, 200);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [values, coverImages, rsvpImages, thanksImages]);

  const onSubmitHandler = async (data: PremiumFilmlWType) => {
    const payload = {
      ...data,
      coverImages,
      rsvpImages,
      thanksImages,
      stories: data.stories as PremiumFilmlWType["stories"],
    };

    const formData = new FormData();
    // Append templateKey
    formData.append("templateKey", templateKey);
    // Append form values sebagai JSON string
    formData.append("values", JSON.stringify(payload));

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

  const onRemoveCoverImage = (index: number) => {
    if (coverImages && coverImages.length === 1) {
      setCoverImages([]);
    } else {
      setCoverImages(coverImages.filter((_, i) => i !== index));
    }
  };

  const onRemoveRsvpImage = (index: number) => {
    if (rsvpImages && rsvpImages.length === 1) {
      setCoverImages([]);
    } else {
      setCoverImages(rsvpImages.filter((_, i) => i !== index));
    }
  };

  const onRemoveThanksImage = (index: number) => {
    if (thanksImages && thanksImages.length === 1) {
      setCoverImages([]);
    } else {
      setCoverImages(thanksImages.filter((_, i) => i !== index));
    }
  };

  return (
    <form
      className='space-y-4'
      onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
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
      </div>

      {/* Gallery Setup */}
      {eventId && (
        <DialogGallery
          eventId={eventId}
          activeState='upload'
          images={defaultValues?.gallery || []}
        />
      )}

      {/* Audio Background */}
      {eventId && (
        <div className='flex flex-col'>
          <DialogAudioSelect
            onAudioSelect={(audio) => {
              form.setValue("audioBackground", audio);
            }}
          />
        </div>
      )}

      {/* Section */}
      <div className='flex flex-col gap-4'>
        <span className='text-sm font-semibold'>Section</span>

        {/* Cover Images */}
        {eventId && (
          <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>Cover</span>
              <span className='text-xs'>(1920 x 1080 Recommended)</span>
            </div>

            {coverImages.length > 0 &&
              coverImages.map((image, index) => (
                <div
                  key={index}
                  className='relative w-full h-28 rounded-md border overflow-hidden'>
                  <Image
                    src={`https://s3.nevaobjects.id/invitekit-bucket/${image}`}
                    width={120}
                    height={80}
                    className='object-cover w-full h-full rounded-md'
                    alt='asdasd'
                  />

                  <Button
                    variant={"destructive"}
                    className='absolute top-2 right-2'
                    type='button'
                    size={"icon"}
                    onClick={() => onRemoveCoverImage(index)}>
                    <TrashIcon />
                  </Button>
                </div>
              ))}
            <DialogGallery
              activeState='images'
              eventId={eventId || ""}
              images={defaultValues?.gallery || []}
              onImageSelect={(images: string[]) => {
                const limitedImages = images.slice(0, 3);
                setCoverImages(limitedImages);
              }}
            />
          </div>
        )}

        {/* Hero Images */}
        {eventId && (
          <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>Heroes</span>
              <span className='text-xs'>(1920 x 1080 Recommended)</span>
            </div>

            {values.stories &&
              values.stories.map((val, index) => (
                <div
                  key={index}
                  className='flex flex-col gap-2.5'>
                  <div className='relative w-full h-28 rounded-md border overflow-hidden'>
                    <Image
                      src={`https://s3.nevaobjects.id/invitekit-bucket/${val.img}`}
                      fill
                      className='object-cover w-full h-full rounded-md'
                      alt='asdasd'
                    />

                    <Button
                      variant={"destructive"}
                      className='absolute top-2 right-2'
                      type='button'
                      size={"icon"}
                      onClick={() => {
                        const currentStories = (values.stories || []) as Array<{
                          img: string;
                          title: string;
                          desc: string;
                        }>;
                        const newStories = currentStories.filter(
                          (_, i) => i !== index,
                        );

                        form.setValue("stories", newStories, {
                          shouldDirty: true,
                        });
                      }}>
                      <TrashIcon />
                    </Button>
                  </div>

                  <FieldInput
                    label='Title'
                    placeholder='Title'
                    {...form.register(`stories.${index}.title`)}
                  />

                  <FieldTextArea
                    label='Description'
                    placeholder='Description'
                    {...form.register(`stories.${index}.desc`)}
                  />
                </div>
              ))}

            <DialogGallery
              activeState='images'
              eventId={eventId || ""}
              images={defaultValues?.gallery || []}
              onImageSelect={(images: string[]) => {
                images.map((image, index) => {
                  form.setValue(`stories.${index}.img`, image, {
                    shouldDirty: true,
                  });
                  form.setValue(`stories.${index}.title`, "This Title", {
                    shouldDirty: true,
                  });
                  form.setValue(`stories.${index}.desc`, "This Description", {
                    shouldDirty: true,
                  });
                });
              }}
            />
          </div>
        )}

        {/* Session */}
        <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold'>Akad &amp; Reception</span>
            <span className='text-xs'>(1920 x 1080 Recommended)</span>
          </div>
          {/* AKAD */}
          <div className='flex flex-col gap-4 border rounded-lg p-2.5'>
            <CalendarTime
              control={form.control}
              name='akad.time'
              label='Akad Time'
            />

            {eventId && (
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-semibold'>Background Image</span>
                {form.getValues("akad.image") ? (
                  <Image
                    src={`https://s3.nevaobjects.id/invitekit-bucket/${form.getValues(
                      "akad.image",
                    )}`}
                    width={120}
                    height={80}
                    className='object-cover w-full h-full rounded-md'
                    alt='asdasd'
                  />
                ) : (
                  <DialogGallery
                    activeState='images'
                    eventId={eventId || ""}
                    images={defaultValues?.gallery || []}
                    onImageSelect={(images: string[]) => {
                      form.setValue("akad.image", images[0]);
                    }}
                  />
                )}
              </div>
            )}

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
            <CalendarTime
              control={form.control}
              name='reception.time'
              label='Reception Time'
            />

            {eventId && (
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-semibold'>Background Image</span>
                {form.getValues("reception.image") ? (
                  <Image
                    src={`https://s3.nevaobjects.id/invitekit-bucket/${form.getValues(
                      "reception.image",
                    )}`}
                    width={120}
                    height={80}
                    className='object-cover w-full h-full rounded-md'
                    alt='asdasd'
                  />
                ) : (
                  <DialogGallery
                    activeState='images'
                    eventId={eventId || ""}
                    images={defaultValues?.gallery || []}
                    onImageSelect={(images: string[]) => {
                      form.setValue("reception.image", images[0]);
                    }}
                  />
                )}
              </div>
            )}

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
        </div>

        {/* RSVP */}
        {eventId && (
          <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>Rsvp Images</span>
              <span className='text-xs'>(Ratio 1:1 Recommended)</span>
            </div>

            <div className='flex gap-2.5 flex-wrap'>
              {rsvpImages.length > 0 &&
                rsvpImages.map((image, index) => (
                  <div
                    key={index}
                    className='relative w-24 h-24 aspect-square rounded-md border overflow-hidden'>
                    <Image
                      src={`https://s3.nevaobjects.id/invitekit-bucket/${image}`}
                      width={96}
                      height={96}
                      className='object-cover w-full h-full rounded-md'
                      alt='RSVP Image'
                    />

                    <Button
                      variant={"destructive"}
                      className='absolute top-2 right-2'
                      type='button'
                      size={"icon"}
                      onClick={() => onRemoveRsvpImage(index)}>
                      <TrashIcon />
                    </Button>
                  </div>
                ))}
            </div>
            <DialogGallery
              activeState='images'
              eventId={eventId || ""}
              images={defaultValues?.gallery || []}
              onImageSelect={(images: string[]) => {
                const limitedImages = images.slice(0, 3);
                setRsvpImages(limitedImages);
              }}
            />
          </div>
        )}

        {/* Gift Card */}
        {eventId && (
          <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>Gift Cards</span>
            </div>

            <div className='flex flex-col gap-2'>
              <span className='text-sm font-semibold'>Background Section</span>
              {form.getValues("giftCardBg") ? (
                <Image
                  src={`https://s3.nevaobjects.id/invitekit-bucket/${form.getValues(
                    "giftCardBg",
                  )}`}
                  width={120}
                  height={80}
                  className='object-cover w-full h-full rounded-md'
                  alt='asdasd'
                />
              ) : (
                <DialogGallery
                  activeState='images'
                  eventId={eventId || ""}
                  images={defaultValues?.gallery || []}
                  onImageSelect={(images: string[]) => {
                    form.setValue("giftCardBg", images[0]);
                  }}
                />
              )}
            </div>

            {/* Gift Card 1 */}
            <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
              <span className='text-sm font-semibold'>Gift Card 1</span>
              <FieldInput
                label='Bank Name'
                placeholder='Ex : Seabank'
                {...form.register("giftCard1.bankName")}
                errorMessage={
                  form.formState.errors.giftCard1?.bankName?.message
                }
              />

              <FieldInput
                label='Card Number'
                placeholder='Ex : 4231xxxxxxxxxxxx'
                type='number'
                {...form.register("giftCard1.number")}
                errorMessage={form.formState.errors.giftCard1?.number?.message}
              />

              <FieldInput
                label='Holder Name'
                placeholder='Ex : Yono'
                {...form.register("giftCard1.holder")}
                errorMessage={form.formState.errors.giftCard1?.holder?.message}
              />
            </div>

            {/* Gift Card 2 */}
            <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
              <span className='text-sm font-semibold'>Gift Card 2</span>
              <FieldInput
                label='Bank Name'
                placeholder='Ex : Seabank'
                {...form.register("giftCard2.bankName")}
                errorMessage={
                  form.formState.errors.giftCard2?.bankName?.message
                }
              />

              <FieldInput
                label='Card Number'
                placeholder='Ex : 4231xxxxxxxxxxxx'
                type='number'
                {...form.register("giftCard2.number")}
                errorMessage={form.formState.errors.giftCard2?.number?.message}
              />

              <FieldInput
                label='Holder Name'
                placeholder='Ex : Yono'
                {...form.register("giftCard2.holder")}
                errorMessage={form.formState.errors.giftCard2?.holder?.message}
              />
            </div>
          </div>
        )}

        {/* Thanks Section */}
        {eventId && (
          <div className='flex flex-col gap-2.5 border rounded-lg p-2.5'>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>Thanks Section</span>
              <span className='text-xs'>(Ratio 1:1 Recommended)</span>
            </div>

            <FieldTextArea
              label='Thanks Message'
              placeholder='Thanks message here....'
              errorMessage={form.formState.errors.thanksMessage?.message}
              {...form.register("thanksMessage")}
            />

            <div className='flex gap-2.5 flex-wrap'>
              {thanksImages.length > 0 &&
                thanksImages.map((image, index) => (
                  <div
                    key={index}
                    className='relative w-24 h-24 aspect-square rounded-md border overflow-hidden'>
                    <Image
                      src={`https://s3.nevaobjects.id/invitekit-bucket/${image}`}
                      width={96}
                      height={96}
                      className='object-cover w-full h-full rounded-md'
                      alt='Thanks Image'
                    />

                    <Button
                      variant={"destructive"}
                      className='absolute top-2 right-2'
                      type='button'
                      size={"icon"}
                      onClick={() => onRemoveThanksImage(index)}>
                      <TrashIcon />
                    </Button>
                  </div>
                ))}
            </div>
            <DialogGallery
              activeState='images'
              eventId={eventId || ""}
              images={defaultValues?.gallery || []}
              onImageSelect={(images: string[]) => {
                const limitedImages = images.slice(0, 8);
                setThanksImages(limitedImages);
              }}
            />
          </div>
        )}
      </div>

      <Button
        className='w-full'
        type='submit'>
        Save
      </Button>
    </form>
  );
}
