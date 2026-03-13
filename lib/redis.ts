import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('[Redis] UPSTASH credentials not set — Redis features disabled (in-memory fallback for OTP)');
}

let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// In-memory fallback store (dev only, single-process)
const memStore = new Map<string, { value: string; expires: number }>();

export async function redisSet(key: string, value: string, expirySeconds: number): Promise<void> {
  if (redis) {
    await redis.set(key, value, { ex: expirySeconds });
  } else {
    memStore.set(key, { value, expires: Date.now() + expirySeconds * 1000 });
  }
}

export async function redisGet(key: string): Promise<string | null> {
  if (redis) {
    const val = await redis.get<string>(key);
    return val ?? null;
  }
  const entry = memStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    memStore.delete(key);
    return null;
  }
  return entry.value;
}

export async function redisDel(key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
  } else {
    memStore.delete(key);
  }
}

export async function redisIncr(key: string, expirySeconds?: number): Promise<number> {
  if (redis) {
    const val = await redis.incr(key);
    if (expirySeconds) await redis.expire(key, expirySeconds);
    return val;
  }
  const entry = memStore.get(key);
  const newVal = ((entry ? Number(entry.value) : 0) + 1);
  memStore.set(key, {
    value: String(newVal),
    expires: expirySeconds ? Date.now() + expirySeconds * 1000 : Infinity,
  });
  return newVal;
}

export default redis;
