import { Hono } from "hono";
import { getPrismaClient } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth-middleware";

const notification = new Hono<{
  Bindings: {
    ACCELERATE_URL: string;
  },
  Variables: {
    userId: string;
  }
}>();

notification.use("*", authMiddleware);

// Get user notifications
notification.get("/", async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const userId = c.get("userId");

  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: userId
    },
    include: {
      sender: {
        select: {
          username: true,
          name: true,
          avatar: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return c.json(notifications);
});

// Mark notification as read
notification.put("/:id/read", async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const id = c.req.param("id");
  const userId = c.get("userId");

  await prisma.notification.updateMany({
    where: {
      id,
      recipientId: userId
    },
    data: {
      isRead: true
    }
  });

  return c.json({ success: true });
});

// Mark all notifications as read
notification.put("/read-all", async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const userId = c.get("userId");

  await prisma.notification.updateMany({
    where: {
      recipientId: userId,
      isRead: false
    },
    data: {
      isRead: true
    }
  });

  return c.json({ success: true });
});

export default notification;
