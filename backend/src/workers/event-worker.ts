import { getPrismaClient } from "../lib/prisma";
import { updateWritingStreak } from "../streak/update-streak";

export async function runEventWorker(accelerateURl: string) {
  const prisma = getPrismaClient(accelerateURl);

  const events = await prisma.events.findMany({
    where: {
      processed: false
    },
    take: 10,
    orderBy: {
      createdAt: "asc"
    },
  });

  for (const event of events) {
    try {
      console.log("Procesing events: ", event.type, event.id);

      if (event.type === "ARTICLE_VERSION_CREATED") {
        await updateWritingStreak(
          prisma,
          event.userId,
          event.createdAt
        )
      };

      await prisma.events.update({
        where: {
          id: event.id
        },
        data: {
          processed: true
        }
      });

    }
    catch (error) {
      console.error("Failed to process event: ", event.id, error)
    }

  }
}