import { z } from "zod";


export const createArticleSchema = z.object({
  title: z.string().min(1).max(150),
  content: z.string().min(10)
});

export const editArticleSchema = createArticleSchema;

export type CreateArticleInput = z.infer<typeof createArticleSchema>;