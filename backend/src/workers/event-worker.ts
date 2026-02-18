import { getPrismaClient } from "../lib/prisma";
import { updateWritingStreak } from "../streak/update-streak";

const MAX_RETRIES = 3;

export async function runEventWorker(accelerateURl: string) {
  const prisma = getPrismaClient(accelerateURl);

  // Fetch unprocessed events that haven't exceeded the retry limit
  const events = await prisma.events.findMany({
    where: {
      processed: false,
      retryCount: { lt: MAX_RETRIES },
    },
    take: 100,
    orderBy: {
      createdAt: "asc",
    },
  });

  if (events.length === 0) return;

  console.log(`[event-worker] Processing ${events.length} events`);

  for (const event of events) {
    try {
      console.log(`[event-worker] Processing: ${event.type} (id=${event.id})`);

      if (event.type === "ARTICLE_VERSION_CREATED") {
        await updateWritingStreak(prisma, event.userId, event.createdAt);
      }

      // Mark as processed
      await prisma.events.update({
        where: { id: event.id },
        data: { processed: true },
      });

    } catch (error) {
      console.error(`[event-worker] Failed to process event ${event.id}:`, error);

      // Increment retry count — after MAX_RETRIES it won't be picked up again
      await prisma.events.update({
        where: { id: event.id },
        data: { retryCount: { increment: 1 } },
      }).catch(() => { }); // Don't throw if this update also fails
    }
  }

  console.log(`[event-worker] Done`);
}