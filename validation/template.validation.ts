import z from "zod";

export const TemplateWeddingMinimalFormSchema = z.object({
  groomName: z.string().min(1).max(24),
  brideName: z.string().min(1).max(24),
  quote: z.string().min(1).max(256),
  resepsiTime: z.coerce.date(),
  place: z.string().min(1).max(100),
  address: z.string().min(1).max(256),
});

const EventLocationSchema = z.object({
  time: z.coerce.date(),
  place: z.string().trim().min(1).max(100),
  address: z.string().trim().min(1).max(256),
  latlong: z.string().trim().min(1).max(256),
});

export const WeddingBasicMinimalFormSchema = z.object({
  groomName: z.string().min(1).max(24),
  parentGroomName: z.string().min(1).max(36),
  brideName: z.string().min(1).max(24),
  parentBrideName: z.string().min(1).max(36),
  akad: EventLocationSchema,
  reception: EventLocationSchema,
  gallery: z.array(z.string()).optional(),
  thanksMessage: z.string().min(1).max(256).optional(),
});
