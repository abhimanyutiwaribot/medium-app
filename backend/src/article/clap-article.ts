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
    return { clapped: true };
  }
}
