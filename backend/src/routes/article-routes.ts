import { Hono } from "hono";
import { getPrismaClient } from "../lib/prisma";
import { createArticle } from "../article/create-article";
import { editArticle } from "../article/edit-article";
import { runEventWorker } from "../workers/event-worker";
import { getArticle } from "../article/get-article";
import { getArticleVersions } from "../article/get-article-versions";
import { getArticleVersion } from "../article/get-article-version";
import { publishArticle } from "../article/publish-article";
import { authMiddleware } from "../middleware/auth-middleware";


const article = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    ACCELERATE_URL: string,
  };
  Variables:{
    userId: string
  }
}>;


article.use("*", authMiddleware)



article.post('/article', async (c) => {
    const prisma = getPrismaClient(c.env.ACCELERATE_URL);

    const body = await c.req.json();

    const { authorId, title, content } = body;

    const articleCreate = await createArticle(
      prisma,
      authorId,
      title,
      content
    )
    
    return c.json(articleCreate);
});



article.put("/:id", async(c) => {
    const prisma = getPrismaClient(c.env.ACCELERATE_URL);

    const articleId = c.req.param("id");
    const body = await c.req.json();

    const { title, content } = body;
    const userId = c.get('userId')
    const result = await editArticle(
      prisma,
      articleId,
      userId,
      title,
      content
    )
    
    return c.json(result);
})



// article.post("/_run-worker", async(c) => {
//     await runEventWorker(c.env.ACCELERATE_URL);
//     return c.json({
//       status: "worker ran"
//     })  
// })



article.get("/:id", async(c) => {
    const prisma = getPrismaClient(c.env.ACCELERATE_URL);
    const articleId = c.req.param("id");

    const articleData = await getArticle(
      prisma, articleId
    );

    return c.json(articleData);
});



article.get("/:id/versions", async (c) => {
    const prisma = getPrismaClient(c.env.ACCELERATE_URL);
    const articleId = c.req.param("id");

    const versions = await getArticleVersions(
      prisma,
      articleId
    );

    return c.json(versions);
});



article.get("/:id/versions/:version", async (c) => {
    const prisma = getPrismaClient(c.env.ACCELERATE_URL);
    const articleId = c.req.param("id");
    const version = Number(c.req.param("version"));

    if(Number.isNaN(version)){
      return c.json({
        error: "Invalid version"
      },400)
    }

    const data = await getArticleVersion(
      prisma,
      articleId,
      version
    );

    return c.json(data);
});


article.post("/:id/publish", async(c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);

  const articleId = c.req.param("id");
  const body = await c.req.json();
  const userId = c.get('userId');

  const result = await publishArticle(
    prisma,
    articleId,
    userId
  );

  return c.json({
    articleId: result.id,
    published: result.published,
    published_At: result.published_At,
  })
})

export default article;
