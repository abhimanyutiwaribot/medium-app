import { PrismaDB } from "../types/prisma";
import { articleOwnership } from "./article-ownership";

export async function publishArticle(
  prisma: PrismaDB,
  articleId: string,
  userId: string,
  version?: number
) {
  const article = await articleOwnership(
    prisma,
    articleId,
    userId
  )

  return prisma.$transaction(async (tx) => {
    const public_version = version ?? article.current_version;

    const exists = await tx.articleVersion.findUnique({
      where:{
        articleId_version:{
          articleId,
          version: public_version
        }
      }
    })

    if(!exists){
      throw new Error("Version does not exist");
    }

    if(article.published && article.published_version === public_version){
      return article;
    }

    const publishedArticle = await tx.article.update({
      where: { id: articleId },
      data: {
        published: true,
        published_version: public_version,
        published_At: new Date(),
      },
    });


    await tx.events.create({
      data: {
        userId,
        type: "ARTICLE_PUBLISHED",
        payload: {
          articleId,
          version: public_version
        },
      },
    });

    return publishedArticle;
  });
}