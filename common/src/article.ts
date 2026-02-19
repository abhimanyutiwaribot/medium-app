import { z } from "zod";

/**
 * Editor.js raw output schema (kept flexible on purpose)
 * We validate shape lightly to avoid breaking on plugin updates.
 */
export const editorJsSchema = z.object({
  time: z.number().optional(),
  blocks: z.array(z.any()),
  version: z.string().optional(),
});

export const createArticleSchema = z.object({
  title: z.string().min(1).max(150),

  content_markdown: z.string().min(10),

  content_json: editorJsSchema,
});

export const editArticleSchema = createArticleSchema;

export const commentSchema = z.object({
  content: z.string().min(1).max(500),
});

export const clapSchema = z.object({
  count: z.number().int().min(1).max(50).optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type EditArticleInput = z.infer<typeof editArticleSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type ClapInput = z.infer<typeof clapSchema>;