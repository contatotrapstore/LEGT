export class TokenBucketRateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillIntervalMs: number;
  private lastRefill: number;
  private waitQueue: Array<() => void> = [];

  constructor(maxTokens: number = 30, refillWindowMs: number = 60000) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillIntervalMs = refillWindowMs / maxTokens;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens--;
      return;
    }

    return new Promise((resolve) => {
      this.waitQueue.push(resolve);
      setTimeout(() => this.processQueue(), this.refillIntervalMs);
    });
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed / this.refillIntervalMs);

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  private processQueue(): void {
    this.refill();
    while (this.waitQueue.length > 0 && this.tokens >= 1) {
      this.tokens--;
      const resolve = this.waitQueue.shift()!;
      resolve();
    }
  }
}
