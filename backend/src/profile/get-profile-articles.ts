import { PrismaDB } from "../types/prisma";

export async function getProfileArticle(
  prisma: PrismaDB,
  userId: string
) {
  const [published, drafts] = await Promise.all([
    prisma.$queryRaw<
      { id: string; title: string; published_At: Date }[]
    >`
      SELECT 
        a.id,
        av.title,
        a."published_At"
      FROM "Article" a
      INNER JOIN "ArticleVersion" av 
        ON a.id = av."articleId" 
        AND a."published_version" = av.version
      WHERE a."authorId" = ${userId}
        AND a.published = true
      ORDER BY a."published_At" DESC
    `,

    prisma.$queryRaw<
      { id: string; title: string; updatedAt: Date }[]
    >`
      SELECT 
        a.id,
        av.title,
        a."createdAt" as "updatedAt"
      FROM "Article" a
      INNER JOIN "ArticleVersion" av 
        ON a.id = av."articleId" 
        AND a."current_version" = av.version
      WHERE a."authorId" = ${userId}
        AND a.published = false
      ORDER BY a."createdAt" DESC
    `
  ]);

  return {
    published: published.map(item => ({
      id: item.id,
      title: item.title,
      published_At: item.published_At
    })),
    drafts: drafts.map(item => ({
      id: item.id,
      title: item.title,
      updatedAt: item.updatedAt
    }))
  };
}