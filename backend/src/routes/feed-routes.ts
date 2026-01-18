import { Hono } from "hono";
import { getPrismaClient } from "../lib/prisma";
import { getPublicFeed } from "../feed/get-feed";

const feed = new Hono<{
  Bindings:{
    ACCELERATE_URL: string;
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


feed.get("/article/:id", async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const articleId = c.req.param("id");

  const rows = await prisma.$queryRaw<
    {
      title: string;
      content: string;
      version: number;
      theme: string | null;
    }[]
  >`
    SELECT
      v.title,
      v.content,
      v.version,
      a.theme
    FROM "Article" a
    JOIN "ArticleVersion" v
      ON v."articleId" = a.id
     AND v.version = a."published_version"
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