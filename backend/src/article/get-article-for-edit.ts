import { PrismaDB } from "../types/prisma";
import { articleOwnership } from "./article-ownership";

export async function getArticleForEdit(
  prisma: PrismaDB,
  articleId: string,
  userId: string
) {
  const article = await articleOwnership(
    prisma,
    articleId,
    userId
  );

  if (article.published) {
    throw new Error("Cannot edit a published article");
  }

  // Fallback to the latest version record if draft fields are empty (e.g. legacy articles)
  let title = article.draft_title;
  let content_markdown = article.draft_content_markdown;
  let content_json = article.draft_content_json;

  if (!title && !content_json) {
    const version = await prisma.articleVersion.findUnique({
      where: {
        articleId_version: {
          articleId,
          version: article.current_version,
        },
      },
    });

    if (version) {
      title = version.title;
      content_markdown = version.content;
      content_json = version.content_json;
    }
  }

  return {
    articleId,
    current_version: article.current_version,
    title,
    content_markdown,
    content_json,
  };
}
