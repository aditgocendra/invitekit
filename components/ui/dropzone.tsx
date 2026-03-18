import ReactDropzone, { DropzoneOptions } from "react-dropzone";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { AudioLines, ImageDown } from "lucide-react";

interface DropzoneProps extends DropzoneOptions {
  className?: string;
  fileType?: "image" | "audio";
}

const ACCEPTED_IMAGES = {
  "image/*": [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".ico",
    ".tif",
    ".tiff",
  ],
};

const ACCEPTED_AUDIO = {
  "audio/*": [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"],
};

export default function Dropzone({
  className,
  fileType = "image",
  ...props
}: DropzoneProps) {
  if (fileType === "image") {
    props.accept = ACCEPTED_IMAGES;
  } else if (fileType === "audio") {
    props.accept = ACCEPTED_AUDIO;
  }

  return (
    <ReactDropzone
      // accept={ACCEPTED_FILES}
      {...props}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className={cn(
            "bg-gray-50 rounded-md shadow-sm border-2 border-dashed cursor-pointer flex items-center justify-center",
            className,
          )}>
          <Input {...getInputProps()} />
          <div>
            {fileType === "image" ? (
              <ImageDown
                size={32}
                className='text-gray-500'
              />
            ) : (
              <AudioLines
                size={32}
                className='text-gray-500'
              />
            )}
          </div>
        </div>
      )}
    </ReactDropzone>
  );
}
