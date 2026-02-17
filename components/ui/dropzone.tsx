import ReactDropzone, { DropzoneOptions } from "react-dropzone";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { ImageDown } from "lucide-react";

interface DropzoneProps extends DropzoneOptions {
  className?: string;
}

const ACCEPTED_FILES = {
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

export default function Dropzone({ className, ...props }: DropzoneProps) {
  return (
    <ReactDropzone
      accept={ACCEPTED_FILES}
      {...props}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className={cn(
            "bg-gray-50 rounded-md shadow-sm border-2 border-dashed cursor-pointer flex items-center justify-center",
            className
          )}>
          <Input {...getInputProps()} />
          <div>
            <ImageDown
              size={32}
              className='text-gray-500'
            />
          </div>
        </div>
      )}
    </ReactDropzone>
  );
}
