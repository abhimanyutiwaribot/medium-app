import { PrismaDB } from "../types/prisma";
import { articleOwnership } from "./article-ownership";

export async function getArticleDiff(
  prisma: PrismaDB,
  articleId: string,
  userId: string,
  from: number,
  to: number
) {

  const article = await articleOwnership(
    prisma,
    articleId,
    userId
  )

  if (!article) {
    return new Error("Article not found")
  }

  const versions = await prisma.articleVersion.findMany({
    where: {
      articleId,
      version: { in: [from, to] },
    },
  });

  if (versions.length !== 2) {
    throw new Error("Version not found")
  }

  return {
    from,
    to,
    fromContent: versions.find(v => v.version === from)?.content,
    toContent: versions.find(v => v.version === to)?.content,
  }
} 