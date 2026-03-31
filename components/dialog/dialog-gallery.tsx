"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { BadgeMinus, CheckIcon, GalleryThumbnailsIcon } from "lucide-react";
import Dropzone from "../ui/dropzone";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useLoading } from "@/hooks/use-loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DialogGalleryProps {
  eventId: string;
  images: Array<string>;
  onImageSelect?: (image: string[]) => void;
  activeState: "upload" | "images";
}

export default function DialogGallery({
  eventId,
  images,
  activeState,
  onImageSelect,
}: DialogGalleryProps) {
  const { withLoading } = useLoading();
  const { refresh } = useRouter();

  const [opened, setOpened] = useState(false);

  // Image Upload
  const [imagesUpload, setImageUpload] = useState<Array<File>>([]);

  const onRemoveImage = (index: number) => {
    if (imagesUpload && imagesUpload.length === 1) {
      setImageUpload([]);
    } else {
      setImageUpload(imagesUpload.filter((_, i) => i !== index));
    }
  };

  const uploadImage = async () => {
    if (imagesUpload.length <= 0) return;
    const formData = new FormData();

    imagesUpload.forEach((image) => {
      formData.append("images", image);
    });

    formData.append("eventId", eventId);

    await withLoading(async () => {
      const response = await fetch("/api/event/gallery", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      toast("Upload Image", {
        description: result.message,
        duration: 3000,
        position: "top-center",
        richColors: true,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      if (!response.ok) return;
      refresh();
      setImageUpload([]);
    });
  };

  // Image list

  const [imageSelected, setImageSelected] = useState<string[]>([]);

  const deleteImage = async () => {
    await withLoading(async () => {
      const response = await fetch(`/api/event/gallery?eventId=${eventId}`, {
        method: "DELETE",
        body: JSON.stringify({ imageSelected }),
      });

      if (!response.ok) return;
      refresh();
      setImageSelected([]);
    });
  };

  return (
    <Dialog
      open={opened}
      onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <Button
          className='w-full'
          type='button'>
          <GalleryThumbnailsIcon />
          Gallery
        </Button>
      </DialogTrigger>

      <DialogContent
        className='sm:max-w-[725px] max-h-[90vh]'
        showCloseButton={false}>
        <DialogTitle>Gallery</DialogTitle>

        <Tabs
          defaultValue={activeState}
          className='w-full'>
          <TabsList className='w-full'>
            <TabsTrigger value='upload'>Upload</TabsTrigger>
            <TabsTrigger value='images'>Images</TabsTrigger>
          </TabsList>
          <TabsContent
            value='upload'
            className='space-y-2'>
            <div
              className={`border rounded-lg p-2.5 min-h-[250px] flex flex-col gap-4 items-center ${imagesUpload.length > 0 ? "justify-between" : "justify-center"}`}>
              <div className='flex gap-2 flex-wrap'>
                {imagesUpload &&
                  imagesUpload.map((image, index) => (
                    <div
                      key={index}
                      className='relative group'>
                      <Image
                        src={URL.createObjectURL(image)}
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
                    if (acceptedFiles.length > 10) return;

                    setImageUpload((prevImages) => {
                      // ✅ Validasi dengan state terbaru
                      if (prevImages.length + acceptedFiles.length > 10) {
                        return prevImages;
                      }
                      return [...prevImages, ...acceptedFiles];
                    });
                  }}
                  className='w-24 h-24'
                />
              </div>

              {imagesUpload.length > 0 && (
                <Button
                  type='button'
                  className='w-full'
                  onClick={() => uploadImage()}>
                  Upload
                </Button>
              )}
            </div>
            <div className='flex flex-col'>
              <span className='text-sm text-muted-foreground'>
                - Maximum image size 1MB.
              </span>
              <span className='text-sm text-muted-foreground'>
                - Maximum image upload 10.
              </span>
            </div>
          </TabsContent>

          {/* List Images */}
          <TabsContent
            value='images'
            className='space-y-2.5'>
            {imageSelected.length > 0 && (
              <div className='border rounded-lg p-2 flex justify-between items-center'>
                <span className='text-sm font-bold'>
                  {imageSelected.length} Selected
                </span>
                <div className='flex gap-2'>
                  {activeState === "images" && (
                    <Button
                      type='button'
                      size={"sm"}
                      onClick={() => {
                        if (onImageSelect) {
                          onImageSelect(imageSelected);
                        }
                      }}>
                      Select
                    </Button>
                  )}
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    type='button'
                    onClick={() => deleteImage()}>
                    Delete
                  </Button>
                </div>
              </div>
            )}

            <div className='border rounded-lg p-2.5 min-h-[250px]'>
              <div className='flex gap-2 flex-wrap'>
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <button
                      key={index}
                      className='w-24 h-24 relative group pointer-events-auto'
                      onClick={() => {
                        if (imageSelected.includes(image)) {
                          setImageSelected(
                            imageSelected.filter((i) => i !== image),
                          );
                        } else {
                          setImageSelected([...imageSelected, image]);
                        }
                      }}>
                      <Image
                        src={`https://s3.nevaobjects.id/invitekit-bucket/${image}`}
                        width={96}
                        height={96}
                        alt='icon'
                        className='object-cover border border-slate-200 rounded-lg'
                      />

                      {imageSelected.includes(image) && (
                        <div className='absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center'>
                          <CheckIcon
                            size={40}
                            className='text-white'
                          />
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <span>No Images</span>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => setOpened(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
