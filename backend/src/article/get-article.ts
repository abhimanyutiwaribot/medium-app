import type { PrismaDB } from "../types/prisma";
import { articleOwnership } from "./article-ownership";

export async function getArticle(
  prisma: PrismaDB,
  articleId: string,
  userId: string
) {

  const article = await articleOwnership(
    prisma,
    articleId,
    userId
  )

  const version = await prisma.articleVersion.findUnique({
    where: {
      articleId_version: {
        articleId,
        version: article.current_version,
      },
    },
  });

  if (!version) {
    throw new Error("Article version missing");
  }

  return {
    id: article.id,
    authorId: article.authorId,
    published: article.published,
    publishedAt: article.published_At, 
    currentVersion: article.current_version,
    published_version: article.published_version,
    title: version.title,
    content: version.content,
    wordCount: version.wordCount,
    updatedAt: version.createdAt,
  };
}
