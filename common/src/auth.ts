import { z } from "zod";


export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(12),
  username: z.string().min(3).max(15),
  name: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(12),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(200).optional(),
  // Accept both regular URLs and base64 data URLs (for local image uploads)
  avatar: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;