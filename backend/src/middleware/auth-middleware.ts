import { verify } from "hono/jwt";
import type { MiddlewareHandler } from "hono";


export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const jwt = c.req.header('Authorization');
  if (!jwt || !jwt.startsWith("Bearer ")) {
    c.status(401);
    return c.json({
      error: "Unauthorized"
    })
  }
  try {
    const token = jwt.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET_KEY);
    const userId = payload.sub as string

    if (!userId) {
      c.status(401);
      return c.json({
        error: "Unauthorized"
      })
    }
    // console.log(payload);
    c.set("userId", userId);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }


}