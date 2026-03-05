import z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
];

export const SingleImageSchema = z
  .instanceof(File)
  .refine((file) => file.size !== 0, "Image is required")
  .refine(
    (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png formats are supported.",
  )
  .refine((file) => file.size < MAX_FILE_SIZE, "Max image size is 1MB.");

export const MultipleImageSchema = z
  .custom<FileList>()
  .transform((fileList) => Array.from(fileList))
  .refine((files) => files.length > 0, {
    message: "Image is required",
  })
  .refine(
    (files) =>
      files.every((file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)),
    {
      message: "Only .jpg, .jpeg, .png formats are supported.",
    },
  )
  .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
    message: "Max image size is 1MB.",
  });
