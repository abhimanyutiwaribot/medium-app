import type { PrismaDB } from "../types/prisma";

export async function getArticle(
  prisma: PrismaDB,
  articleId: string
) {

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      authorId: true,
      published: true,
      published_At: true,
      current_version: true,
      createdAt: true,
    },
  });

  if (!article) {
    throw new Error("Article not found");
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
    throw new Error("Article version missing");
  }

  return {
    id: article.id,
    authorId: article.authorId,
    published: article.published,
    publishedAt: article.published_At, 
    currentVersion: article.current_version,
    title: version.title,
    content: version.content,
    wordCount: version.wordCount,
    updatedAt: version.createdAt,
  };
}
