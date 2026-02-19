import { z } from "zod";

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Min 8 characters").max(12, "Max 12 characters"),
  username: z.string().min(3, "Min 3 characters").max(15, "Max 15 characters"),
  name: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Min 8 characters").max(12, "Max 12 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
