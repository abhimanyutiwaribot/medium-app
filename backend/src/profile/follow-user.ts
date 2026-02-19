import { PrismaDB } from "../types/prisma";

export async function toggleFollow(
  prisma: PrismaDB,
  followerId: string,
  followingId: string
) {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return { followed: false };
  } else {
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    // Create notification
    try {
      await prisma.notification.create({
        data: {
          recipientId: followingId,
          senderId: followerId,
          type: "FOLLOW"
        }
      });
    } catch (e) {
      console.error("Failed to create notification", e);
    }

    return { followed: true };
  }
}
