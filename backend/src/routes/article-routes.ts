import { Hono } from "hono";
import { getPrismaClient } from "../lib/prisma";
import { createArticle } from "../article/createArticle";
import { editArticle } from "../article/editArticle";


const article = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    ACCELERATE_URL: string,
  }
}>;

// POST /api/v1/blog
// PUT /api/v1/blog
// GET /api/v1/blog/:id
// GET /api/v1/blog/bulk


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

    const result = await editArticle(
      prisma,
      articleId,
      title,
      content
    )
    
    return c.json(result);
})

// article.get('/:id', async (c) => {
    
// });

// article.get('/bulk', async (c) => {
    
// });

export default article;
