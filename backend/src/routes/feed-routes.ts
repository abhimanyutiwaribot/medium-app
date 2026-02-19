import { Hono } from "hono";
import { getPrismaClient } from "../lib/prisma";
import { getPublicFeed } from "../feed/get-feed";
import { optionalAuthMiddleware } from "../middleware/auth-middleware";

const feed = new Hono<{
  Bindings: {
    ACCELERATE_URL: string;
    JWT_SECRET_KEY: string;
  },
  Variables: {
    userId: string;
  }
}>();

feed.onError((err, c) => {
  console.error('Error', err);
  return c.json({
    error: "Internal Server Error"
  }, 500)
})


feed.get("/", async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);

  const page = Math.max(
    1,
    Number(c.req.query("page") || 1)
  );
  const limit = Math.min(
    Number(c.req.query("limit") ?? 10),
    20
  );

  const data = await getPublicFeed(
    prisma,
    page,
    limit
  )

  return c.json({
    page,
    limit,
    data
  })

})


feed.get("/article/:id", optionalAuthMiddleware, async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const articleId = c.req.param("id");

  // Optional auth to check if user clapped/bookmarked
  const userId = c.get("userId") || null;

  const rows = await prisma.$queryRaw<
    {
      title: string;
      content: string;
      version: number;
      theme: string | null;
      username: string;
      authorName: string | null;
      authorAvatar: string | null;
      published_At: string;
      clapsCount: number;
      isClapped: boolean;
      isBookmarked: boolean;
    }[]
  >`
    SELECT
      v.title,
      v.content,
      v.version,
      a.id as "articleId",
      a."authorId",
      a.theme,
      u.username,
      u.name as "authorName",
      u.avatar as "authorAvatar",
      a."published_At",
      (SELECT count(*)::int FROM "Clap" WHERE "articleId" = a.id) as "clapsCount",
      EXISTS(SELECT 1 FROM "Clap" WHERE "articleId" = a.id AND "userId" = ${userId || ''}) as "isClapped",
      EXISTS(SELECT 1 FROM "Bookmark" WHERE "articleId" = a.id AND "userId" = ${userId || ''}) as "isBookmarked"
    FROM "Article" a
    JOIN "ArticleVersion" v
      ON v."articleId" = a.id
      AND v.version = a."published_version"
    JOIN "UserModel" u
      ON u.id = a."authorId"
    WHERE
      a.id = ${articleId}
      AND a.published = true
    LIMIT 1;
  `;

  if (rows.length === 0) {
    return c.json({ error: "Not Found" }, 404);
  }

  return c.json(rows[0]);
});


export default feed;