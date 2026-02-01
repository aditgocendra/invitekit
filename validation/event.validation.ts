import z from "zod";

const EventFormSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().min(1).max(100),
  time: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  image: z.string().min(1).max(100),
});
