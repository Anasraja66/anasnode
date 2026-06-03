import { z } from "zod";

export const contactSchema = z.object({
  phone: z.string().min(5, "Phone number is too short").max(20),
  firstName: z.string().max(80).optional().default(""),
  lastName: z.string().max(80).optional().default(""),
  email: z.string().email("Invalid email format").max(200).optional().or(z.literal("")),
  gender: z.string().max(40).optional().default(""),
  name: z.string().max(120).optional(),
  tags: z.array(z.string()).optional().default([]),
  customFields: z.record(z.any()).optional().default({}),
});

export type ContactInput = z.infer<typeof contactSchema>;
