import { PrismaDB } from "../types/prisma";

export async function updateProfile(
  prisma: PrismaDB,
  userId: string,
  data: {
    name?: string;
    bio?: string;
    avatar?: string;
  }
) {
  return await prisma.userModel.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name,
      bio: data.bio,
      avatar: data.avatar,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      bio: true,
      avatar: true
    }
  });
}

export async function getPublicProfile(
  prisma: PrismaDB,
  username: string,
  currentUserId?: string
) {
  const user = await prisma.userModel.findUnique({
    where: {
      username
    },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      avatar: true,
      _count: {
        select: {
          followers: true,
          following: true,
          article: { where: { published: true } }
        }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  let isFollowing = false;
  if (currentUserId) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: user.id
        }
      }
    });
    isFollowing = !!follow;
  }

  return {
    ...user,
    isFollowing
  }
}

export async function getPublicUserArticles(
  prisma: PrismaDB,
  userId: string
) {
  return await prisma.$queryRaw<
    { id: string; title: string; published_At: Date }[]
  >`
      SELECT 
        a.id,
        av.title,
        a."published_At"
      FROM "Article" a
      INNER JOIN "ArticleVersion" av 
        ON a.id = av."articleId" 
        AND a."published_version" = av.version
      WHERE a."authorId" = ${userId}
        AND a.published = true
      ORDER BY a."published_At" DESC
    `;
}

