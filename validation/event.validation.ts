import z from "zod";

export const InvitationEventFormSchema = z.object({
  guests: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        phoneNumber: z.string().min(1, "Phone number is required").max(14),
      }),
    )
    .min(1), // Optional: enforce at least one guest
});
