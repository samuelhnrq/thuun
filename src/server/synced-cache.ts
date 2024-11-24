import { LRUCache } from "lru-cache";
import Locker from "async-lock";
import { logger } from "./logger";

export abstract class CachedResource<T extends {}> {
  protected dailyArtistCache = new LRUCache<string, T>({
    max: 1000,
    ttl: 24 * 60 * 60 * 1000,
    updateAgeOnGet: true,
  });
  protected locker = new Locker();

  protected abstract cacheValueMiss(key: string): Promise<T | null> | T | null;

  async get(key: string): Promise<T | null> {
    return await this.locker.acquire(key, async () => {
      logger.debug("lock acquired for %s", key);
      const cached = this.dailyArtistCache.get(key);
      if (cached) {
        logger.debug("Cache hit for %s", key);
        return cached;
      }
      logger.debug("Cache miss for %s", key);
      const value = await this.cacheValueMiss(key);
      if (!value) {
        logger.debug("Failed to get value for %s, returning null", key);
        return null;
      }
      logger.debug("Value regenated successfully for %s, caching", key);
      this.dailyArtistCache.set(key, value);
      return value;
    });
  }

  async has(key: string): Promise<boolean> {
    return await this.locker.acquire(key, async () => {
      logger.debug("lock acquired for %s", key);
      return this.dailyArtistCache.has(key);
    });
  }
}
