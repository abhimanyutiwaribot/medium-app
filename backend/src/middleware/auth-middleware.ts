import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import type { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  let token: string | undefined;

  // 1. Try HttpOnly cookie first (secure, preferred)
  const cookieToken = getCookie(c, "access_token");
  if (cookieToken) {
    token = cookieToken;
  }

  // 2. Fall back to Authorization: Bearer header (for backward compat / API clients)
  if (!token) {
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET_KEY);
    const userId = payload.sub as string;

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("userId", userId);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
};

export const optionalAuthMiddleware: MiddlewareHandler = async (c, next) => {
  let token: string | undefined;

  const cookieToken = getCookie(c, "access_token");
  if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (token) {
    try {
      const payload = await verify(token, c.env.JWT_SECRET_KEY);
      const userId = payload.sub as string;
      if (userId) {
        c.set("userId", userId);
      }
    } catch (error) {
      // Ignore invalid tokens for optional auth
    }
  }

  await next();
};