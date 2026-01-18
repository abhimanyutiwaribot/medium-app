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

  const version = await prisma.articleVersion.findUnique({
    where: {
      articleId_version: {
        articleId,
        version: article.current_version,
      },
    },
  });

  if (!version) {
    throw new Error("Version not found");
  }

  return {
    articleId,
    current_version: article.current_version,
    title: version.title,
    content_markdown: version.content,
    content_json: version.content_json,
  };
}
