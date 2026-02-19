import { PrismaDB } from "../types/prisma";

export async function clapArticle(
  prisma: PrismaDB,
  userId: string,
  articleId: string
) {
  const existing = await prisma.clap.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (existing) {
    await prisma.clap.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
    return { clapped: false };
  } else {
    await prisma.clap.create({
      data: {
        userId,
        articleId,
        count: 1,
      },
    });

    // Notify author
    try {
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: { authorId: true }
      });

      if (article && article.authorId !== userId) {
        await prisma.notification.create({
          data: {
            recipientId: article.authorId,
            senderId: userId,
            type: "CLAP",
            articleId: articleId
          }
        });
      }
    } catch (e) {
      console.error("Failed to create clap notification", e);
    }

    return { clapped: true };
  }
}
