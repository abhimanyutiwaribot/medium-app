import { PrismaDB } from "../types/prisma";
import { articleOwnership } from "./article-ownership";

export async function publishArticle(
  prisma: PrismaDB,
  articleId: string,
  userId: string
) {
  const article = await articleOwnership(
    prisma,
    articleId,
    userId
  )
  
  if (article.published) {
    return article;
  }

  return prisma.$transaction(async (tx) => {

    if (!article) {
      throw new Error("Article not found");
    }

    if (article.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    if(article.published){
      return article;
    }

    const publishedArticle = await tx.article.update({
      where: { id: articleId },
      data: {
        published: true,
        published_At: new Date(),
      },
    });


    await tx.events.create({
      data: {
        userId,
        type: "ARTICLE_PUBLISHED",
        payload: {
          articleId,
        },
      },
    });

    return publishedArticle;
  });
}