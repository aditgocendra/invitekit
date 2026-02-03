import z from "zod";

export const TemplateWeddingMinimalFormSchema = z.object({
  groomName: z.string().min(1).max(24),
  brideName: z.string().min(1).max(24),
  quote: z.string().min(1).max(256),
  resepsiTime: z.coerce.date(),
  place: z.string().min(1).max(100),
  address: z.string().min(1).max(256),
});
