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
    return { followed: true };
  }
}
