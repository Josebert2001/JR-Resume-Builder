interface RateLimitRule {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private rules: Record<string, RateLimitRule> = {
    ai_generation: { maxRequests: 10, windowMs: 60000 }, // 10 requests per minute
    resume_analysis: { maxRequests: 5, windowMs: 60000 }, // 5 analyses per minute
    file_upload: { maxRequests: 3, windowMs: 60000 }, // 3 uploads per minute
  };

  private getKey(userId: string, action: string): string {
    return `${userId}:${action}`;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now >= entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  isAllowed(userId: string, action: string): { allowed: boolean; resetTime?: number } {
    this.cleanup();
    
    const rule = this.rules[action];
    if (!rule) {
      return { allowed: true };
    }

    const key = this.getKey(userId, action);
    const now = Date.now();
    const entry = this.requests.get(key);

    if (!entry) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + rule.windowMs,
      });
      return { allowed: true };
    }

    if (now >= entry.resetTime) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + rule.windowMs,
      });
      return { allowed: true };
    }

    if (entry.count >= rule.maxRequests) {
      return { allowed: false, resetTime: entry.resetTime };
    }

    entry.count++;
    return { allowed: true };
  }

  getRemainingRequests(userId: string, action: string): number {
    this.cleanup();
    
    const rule = this.rules[action];
    if (!rule) return Infinity;

    const key = this.getKey(userId, action);
    const entry = this.requests.get(key);

    if (!entry || Date.now() >= entry.resetTime) {
      return rule.maxRequests;
    }

    return Math.max(0, rule.maxRequests - entry.count);
  }
}

export const rateLimiter = new RateLimiter();