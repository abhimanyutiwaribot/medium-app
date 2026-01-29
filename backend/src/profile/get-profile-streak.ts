import { PrismaDB } from "../types/prisma";

function toKey(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function getProfileStreak(
  prisma: PrismaDB,
  userId: string
) {
  const streak = await prisma.writingStreak.findUnique({
    where: { userId },
  });

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 180);

  const days = await prisma.writingDay.findMany({
    where: {
      userId,
      date: { gte: since },
    },
    select: { date: true },
  });

  const heatmap: Record<string, number> = {};

  for (const d of days) {
    heatmap[toKey(d.date)] = 1;
  }

  return {
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
    heatmap,
  };
}
