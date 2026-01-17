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

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type EditArticleInput = z.infer<typeof editArticleSchema>;