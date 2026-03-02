import { PrismaDB } from "../types/prisma"
import { articleOwnership } from "./article-ownership";

export async function editArticle(
  prisma: PrismaDB,
  articleId: string,
  userId: string,
  title: string,
  content_markdown: string,
  content_json: any,
  autoSave: boolean = false
) {
  const article = await articleOwnership(
    prisma,
    articleId,
    userId
  );

  if (article.published) {
    throw new Error("Cannot edit a published article. Create a new draft instead.");
  }

  const wordCount = content_markdown.trim().split(/\s+/).length;
  const nextVersion = article.current_version + 1;

  return await prisma.$transaction(async (tx) => {
    // 1. Update the Article's draft content (always done)
    await tx.article.update({
      where: { id: articleId },
      data: {
        draft_title: title,
        draft_content_json: content_json,
        draft_content_markdown: content_markdown,
        // If it's a manual save, also increment the version
        ...(autoSave ? {} : { current_version: nextVersion })
      }
    });

    // 2. If it's a manual save, create a NEW version record (snapshot)
    if (!autoSave) {
      await tx.articleVersion.create({
        data: {
          articleId,
          version: nextVersion,
          title,
          content: content_markdown,
          content_json,
          wordCount,
        }
      });

      // Log the version creation event
      await tx.events.create({
        data: {
          userId: article.authorId,
          type: "ARTICLE_VERSION_CREATED",
          payload: {
            articleId,
            version: nextVersion
          }
        }
      });
    }

    return {
      articleId,
      version: autoSave ? article.current_version : nextVersion,
      updatedAt: new Date(),
      wordCount,
      isAutoSave: autoSave
    }
  });
}