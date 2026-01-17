import { PrismaDB } from "../types/prisma"
import { articleOwnership } from "./article-ownership";

export async function editArticle(
  prisma: PrismaDB,
  articleId: string,
  userId: string,
  title: string,
  content_markdown: string,
  content_json: any
) {
  const article = await articleOwnership(
    prisma,
    articleId,
    userId
  );

  if (article.published) {
    throw new Error("Cannot edit a published article. Create a new draft instead.");
  }

  // console.log(content_markdown)
  const wordCount = content_markdown.trim().split(/\s+/).length;
  const nextVersion = article.current_version + 1;

  return await prisma.$transaction(async (tx) => {
    await tx.articleVersion.create({
      data: {
        articleId,
        version: nextVersion,
        title,
        content: content_markdown,
        content_json,
        wordCount,
      }
    });

    await tx.article.update({
      where: {
        id: articleId
      },
      data: {
        current_version: nextVersion
      },
      select: {
        current_version: true
      }
    })

    await tx.events.create({
      data: {
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
      version: nextVersion,
      updatedAt: new Date(),
      wordCount
    }
  });
}