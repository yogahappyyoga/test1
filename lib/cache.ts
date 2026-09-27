type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const store = new Map<string, CacheEntry<unknown>>();

/**
 * Simple in-memory TTL cache, shared per warm server instance. Good enough
 * for keeping ~15-30 minute-old data instead of hammering Open-Meteo on
 * every request; a cold start just refetches.
 */
export async function getOrSet<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const existing = store.get(key);
  if (existing && existing.expiresAt > now) {
    return existing.value as T;
  }

  const value = await fetcher();
  store.set(key, { value, expiresAt: now + ttlMs });
  return value;
}
