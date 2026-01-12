import { PrismaDB } from "../types/prisma"
import { articleOwnership } from "./article-ownership";

export async function editArticle(
  prisma: PrismaDB,
  articleId: string,
  userId: string,
  title: string,
  content: string
) {
    const article = await articleOwnership(
      prisma,
      articleId,
      userId
    );

    const wordCount = content.trim().split(/\s+/).length;
    const nextVersion = article.current_version + 1;
  
    return await prisma.$transaction(async (tx) => {
        await tx.articleVersion.create({
          data:{
            articleId,
            version: nextVersion,
            title,
            content,
            wordCount,
          }
        });

        await tx.article.update({
          where: {
            id: articleId
          },
          data:{
            current_version: nextVersion
          }
        })

        await tx.events.create({
          data:{
            userId: article.authorId,
            type: "ARTICLE_VERSION_CREATED",
            payload: {
              articleId,
              version: nextVersion
            }
          }
        })

        return {
          articleId,
          version: nextVersion
        }
    });
}