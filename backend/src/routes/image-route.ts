import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import { rateLimit } from "../lib/ratelimit";
import { sha1 } from "../lib/sign";


const image = new Hono<{
  Bindings: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    RATE_LIMIT_KV: KVNamespace;
  };
  Variables: {
    userId: string
  }
}>();

image.use("*", authMiddleware)


image.get("/sign", async (c) => {
  const userId = c.get("userId");
  const key = `image-upload:${userId}:${Math.floor(Date.now() / 60000)}`;

  const allowed = await rateLimit({
    kv: c.env.RATE_LIMIT_KV,
    key,
    limit: 10,
    windowSeconds: 60,
  })

  if (!allowed) {
    return c.json({
      error: "Too many upload attempts"
    }, 429)
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=medium-app&timestamp=${timestamp}`;
  const toSign = `${paramsToSign}${c.env.CLOUDINARY_API_SECRET}`;
  const signature = await sha1(toSign);

  return c.json({
    cloudName: c.env.CLOUDINARY_CLOUD_NAME,
    apiKey: c.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder: "medium-app",
  });

}); 

export default image;