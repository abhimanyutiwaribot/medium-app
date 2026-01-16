import { PrismaDB } from "../types/prisma";

export async function getPublicFeed(
  prisma: PrismaDB,
  page: number,
  limit: number
) {
  const offset = (page - 1) * limit;

  const rows = await prisma.$queryRaw<
    {
      articleId: string;
      title: string;
      wordCount: number;
      publishedAt: Date;
      authorId: string;
      username: string;
      name: string | null;
    }[]
  >`
    SELECT
      a.id              AS "articleId",
      v.title           AS "title",
      v."wordCount"     AS "wordCount",
      a."published_At"  AS "publishedAt",
      u.id              AS "authorId",
      u.username        AS "username",
      u.name            AS "name"
    FROM "Article" a
    JOIN "ArticleVersion" v
      ON v."articleId" = a.id
     AND v.version = a."published_version"
    JOIN "UserModel" u
      ON u.id = a."authorId"
    WHERE a.published = true
    ORDER BY a."published_At" DESC
    LIMIT ${limit}
    OFFSET ${offset};
  `;

  return rows.map((row) => ({
    id: row.articleId,
    title: row.title,
    author: {
      id: row.authorId,
      username: row.username,
      name: row.name,
    },
    readingTime: Math.max(
      1,
      Math.ceil((row.wordCount ?? 0) / 200)
    ),
    published_At: row.publishedAt,
  }));
}
