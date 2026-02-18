import { Hono } from "hono";
import { getPrismaClient } from "../lib/prisma";
import { getProfileStreak } from "../profile/get-profile-streak";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth-middleware";
import { getProfileArticle } from "../profile/get-profile-articles";
import { updateProfile, getPublicProfile, getPublicUserArticles } from "../profile/update-profile";
import { toggleFollow } from "../profile/follow-user";
import { updateProfileSchema } from "@abhimanyutiwaribot/medium-app-validation";


const profile = new Hono<{
  Bindings: {
    ACCELERATE_URL: string,
    JWT_SECRET_KEY: string
  },
  Variables: {
    userId: string
  }
}>

profile.onError((err, c) => {
  console.error('Error', err);
  return c.json({
    error: "Internal Server Error"
  }, 500)
})

// profile.use("*", authMiddleware)


profile.get("/streak", authMiddleware, async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const userId = c.get("userId");

  const data = await getProfileStreak(
    prisma,
    userId
  )

  return c.json(data);
})

profile.get("/articles", authMiddleware, async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const userId = c.get("userId");

  const data = await getProfileArticle(
    prisma,
    userId
  )

  return c.json(data)
})

// Get public profile
profile.get("/u/:username", optionalAuthMiddleware, async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const username = c.req.param("username");
  const userId = c.get("userId"); // Optional, from optionalAuthMiddleware

  const profileData = await getPublicProfile(prisma, username, userId);
  const articles = await getPublicUserArticles(prisma, profileData.id);

  return c.json({
    ...profileData,
    articles
  });
});


// Update profile
profile.put("/update", authMiddleware, async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const userId = c.get("userId");
  const body = await c.req.json();

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error }, 400);
  }

  const updated = await updateProfile(prisma, userId, body);
  return c.json(updated);
});

// Follow/Unfollow user
profile.post("/follow/:id", authMiddleware, async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const followerId = c.get("userId");
  const followingId = c.req.param("id");

  const result = await toggleFollow(prisma, followerId, followingId);
  return c.json(result);
});

// Get user bookmarks
profile.get("/bookmarks", authMiddleware, async (c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const userId = c.get("userId");

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId
    },
    include: {
      article: {
        include: {
          author: {
            select: {
              username: true,
              name: true,
              avatar: true
            }
          },
          versions: {
            where: {
              version: 1 // Just a placeholder, we usually want the published version
            },
            select: {
              title: true
            }
          }
        }
      }
    }
  });

  // Better to map this to a cleaner structure
  const mapped = bookmarks.map(b => ({
    id: b.article.id,
    title: b.article.versions[0]?.title || "Untitled",
    author: b.article.author,
    createdAt: b.createdAt
  }));

  return c.json(mapped);
});

export default profile;