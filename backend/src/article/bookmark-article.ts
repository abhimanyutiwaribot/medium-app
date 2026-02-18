import { PrismaDB } from "../types/prisma";

export async function toggleBookmark(
  prisma: PrismaDB,
  userId: string,
  articleId: string
) {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
    return { bookmarked: false };
  } else {
    await prisma.bookmark.create({
      data: {
        userId,
        articleId,
      },
    });
    return { bookmarked: true };
  }
}
