import { PrismaDB } from "../types/prisma";
import { articleOwnership } from "./article-ownership";

export async function deleteArticle(
  prisma: PrismaDB,
  articleId: string,
  userId: string
) {
  // Ensure the user owns the article
  await articleOwnership(prisma, articleId, userId);

  return await prisma.$transaction(async (tx) => {
    // 1. Delete Claps
    await tx.clap.deleteMany({
      where: { articleId }
    });

    // 2. Delete Bookmarks
    await tx.bookmark.deleteMany({
      where: { articleId }
    });

    // 3. Delete Versions
    await tx.articleVersion.deleteMany({
      where: { articleId }
    });

    // 4. Delete Notifications related to this article
    await tx.notification.deleteMany({
      where: { articleId }
    });

    // 5. Delete the Article itself
    await tx.article.delete({
      where: { id: articleId }
    });

    return { success: true, articleId };
  });
}
