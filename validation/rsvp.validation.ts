import z from "zod";

export const RsvpFormSchema = z.object({
  invitationId: z.string(),
  attendance: z.boolean().default(false),
  message: z.string().optional(),
});
