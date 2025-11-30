import { Injectable } from '@nestjs/common';

/**
 * Simple in-memory cache untuk Pain Point endpoints
 * 
 * TTL: 1 hour (3600 seconds)
 * 
 * Note: Untuk MVP, in-memory cache sudah cukup.
 * Jika nanti butuh Redis, bisa migrate dengan mudah.
 */
@Injectable()
export class PainPointCacheService {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private readonly TTL = 3600 * 1000; // 1 hour in milliseconds

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.TTL,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries (optional, bisa dipanggil secara periodic)
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

