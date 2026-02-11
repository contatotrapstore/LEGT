export interface HenrikApiErrorDetail {
  code: number;
  message: string;
  status: number;
  details: string | null;
}

export class ApiError extends Error {
  public henrikCode?: number;

  constructor(
    public status: number,
    public body: string,
    henrikErrors?: HenrikApiErrorDetail[]
  ) {
    const henrikMsg = henrikErrors?.[0]?.message;
    super(henrikMsg ?? `API Error ${status}: ${body}`);
    this.name = "ApiError";
    this.henrikCode = henrikErrors?.[0]?.code;
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isAccountNotFound(): boolean {
    return this.henrikCode === 22;
  }

  get isDataUnavailable(): boolean {
    return this.henrikCode === 24;
  }

  get userFriendlyMessage(): string {
    switch (this.henrikCode) {
      case 22:
        return "Account not found. Check the name and tag.";
      case 23:
        return "Region not found. The player may need to play a game first.";
      case 24:
        return "Player data temporarily unavailable. The player needs to have played recently.";
      case 26:
        return "Match data not found.";
      default:
        if (this.isRateLimited) return "Too many requests. Please try again in a moment.";
        return "Something went wrong. Please try again.";
    }
  }
}

interface HttpClientOptions {
  apiKey: string;
  maxRetries?: number;
  timeoutMs?: number;
}

export class HttpClient {
  private apiKey: string;
  private maxRetries: number;
  private timeoutMs: number;

  constructor(options: HttpClientOptions) {
    this.apiKey = options.apiKey;
    this.maxRetries = options.maxRetries ?? 3;
    this.timeoutMs = options.timeoutMs ?? 10000;
  }

  async get<T>(url: string): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: this.apiKey,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(this.timeoutMs),
        });

        if (res.status === 429) {
          const backoff = Math.pow(2, attempt) * 1000;
          await this.sleep(backoff);
          continue;
        }

        const text = await res.text();

        if (!res.ok) {
          let henrikErrors: HenrikApiErrorDetail[] | undefined;
          try {
            const parsed = JSON.parse(text);
            if (parsed.errors && Array.isArray(parsed.errors)) {
              henrikErrors = parsed.errors;
            }
          } catch {
            // Body isn't JSON, use raw text
          }
          throw new ApiError(res.status, text, henrikErrors);
        }

        return JSON.parse(text) as T;
      } catch (err) {
        lastError = err as Error;
        if (err instanceof ApiError && !err.isRateLimited) {
          throw err;
        }
        if (attempt < this.maxRetries - 1) {
          await this.sleep(Math.pow(2, attempt) * 500);
        }
      }
    }

    throw lastError ?? new Error("Request failed after retries");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
