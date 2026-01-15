export async function rateLimit({
  kv,
  key,
  limit,
  windowSeconds,
}: {
  kv: KVNamespace;
  key: string;
  limit: number;
  windowSeconds: number;
}) {
  const current = await kv.get(key);
  const count = current ? Number(current) : 0;

  if (count >= limit) {
    return false;
  }

  await kv.put(key, String(count + 1), {
    expirationTtl: windowSeconds,
  });

  return true;
}
