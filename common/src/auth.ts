import { z } from "zod";


export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(12),
  username: z.string().min(3).max(8),
  name: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(12),
})

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;