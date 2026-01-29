import { Hono } from "hono";
import { getPrismaClient } from "../lib/prisma";
import { getProfileStreak } from "../profile/get-profile-streak";
import { authMiddleware } from "../middleware/auth-middleware";
import { getProfileArticle } from "../profile/get-profile-articles";

const profile = new Hono<{
  Bindings: {
    ACCELERATE_URL: string,
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

profile.use("*",authMiddleware)


profile.get("/streak", async(c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const userId = c.get("userId");

  const data = await getProfileStreak(
    prisma,
    userId
  )

  return c.json(data);
})

profile.get("/articles", async(c) => {
  const prisma = getPrismaClient(c.env.ACCELERATE_URL);
  const userId = c.get("userId");

  const data = await getProfileArticle(
    prisma,
    userId
  )

  return c.json(data)
})


export default profile;