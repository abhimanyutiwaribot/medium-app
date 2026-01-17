import { PrismaDB } from "../types/prisma";

export async function getDraftArticles(
  prisma: PrismaDB,
  userId: string,
) {
  const drafts = await prisma.$queryRaw<
    {
      id: string;
      title: string;
      current_version: number;
      updatedAt: Date;
    }[]
  >`
    SELECT 
      a.id,
      v.title,
      a.current_version,
      v."createdAt" AS "updatedAt"
    FROM "Article" a
    JOIN "ArticleVersion" v ON v."articleId" = a.id AND v.version = a.current_version
    WHERE a."authorId" = ${userId}
      AND a.published = false
  `;

  return { drafts };
}   