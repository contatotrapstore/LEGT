import type { DataProvider } from "./data-provider";
import type {
  AccountData,
  MMRData,
  MMRHistoryEntry,
} from "@/types/valorant";
import type {
  HenrikAccountResponse,
  HenrikLeaderboardPlayer,
  HenrikLeaderboardResponse,
  HenrikLifetimeMatch,
  HenrikLifetimeMatchesResponse,
  HenrikMatch,
  HenrikMatchDetailResponse,
  HenrikMMRHistoryResponse,
  HenrikMMRResponse,
} from "@/types/api";
import { HttpClient } from "./http-client";
import { TokenBucketRateLimiter } from "./rate-limiter";
import { MemoryCache } from "../cache/memory-cache";
import { cacheKeys } from "../cache/cache-keys";
import { CACHE_TTL } from "../constants";
import { buildRankInfo } from "../rank-utils";

const BASE_URL = "https://api.henrikdev.xyz";

export class HenrikDevProvider implements DataProvider {
  private http: HttpClient;
  private cache: MemoryCache;
  private rateLimiter: TokenBucketRateLimiter;

  constructor() {
    const apiKey = process.env.HENRIKDEV_API_KEY;
    if (!apiKey) {
      throw new Error("HENRIKDEV_API_KEY environment variable is required");
    }

    this.http = new HttpClient({ apiKey });
    this.cache = new MemoryCache(500);
    this.rateLimiter = new TokenBucketRateLimiter(30, 60000);
  }

  async getAccountByRiotId(name: string, tag: string): Promise<AccountData> {
    const key = cacheKeys.account(name, tag);
    const cached = this.cache.get<AccountData>(key);
    if (cached) return cached;

    await this.rateLimiter.acquire();
    const response = await this.http.get<HenrikAccountResponse>(
      `${BASE_URL}/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
    );

    const data = this.transformAccount(response.data);
    this.cache.set(key, data, CACHE_TTL.ACCOUNT);
    return data;
  }

  async getLifetimeMatches(
    region: string,
    name: string,
    tag: string,
    options?: { mode?: string; size?: number }
  ): Promise<HenrikLifetimeMatch[]> {
    const key = cacheKeys.matches(region, name, tag);
    const cached = this.cache.get<HenrikLifetimeMatch[]>(key);
    if (cached) return cached;

    await this.rateLimiter.acquire();

    const params = new URLSearchParams();
    if (options?.mode) params.set("mode", options.mode);
    if (options?.size) params.set("size", String(options.size));

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await this.http.get<HenrikLifetimeMatchesResponse>(
      `${BASE_URL}/valorant/v1/lifetime/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}${queryString}`
    );

    this.cache.set(key, response.data, CACHE_TTL.MATCHES);
    return response.data;
  }

  async getMMRByRiotId(
    region: string,
    name: string,
    tag: string
  ): Promise<MMRData> {
    const key = cacheKeys.mmr(region, name, tag);
    const cached = this.cache.get<MMRData>(key);
    if (cached) return cached;

    await this.rateLimiter.acquire();
    const response = await this.http.get<HenrikMMRResponse>(
      `${BASE_URL}/valorant/v2/mmr/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
    );

    const data = this.transformMMR(response.data);
    this.cache.set(key, data, CACHE_TTL.MMR);
    return data;
  }

  async getMMRHistoryByRiotId(
    region: string,
    name: string,
    tag: string
  ): Promise<MMRHistoryEntry[]> {
    const key = cacheKeys.mmrHistory(region, name, tag);
    const cached = this.cache.get<MMRHistoryEntry[]>(key);
    if (cached) return cached;

    await this.rateLimiter.acquire();
    const response = await this.http.get<HenrikMMRHistoryResponse>(
      `${BASE_URL}/valorant/v1/mmr-history/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
    );

    const data: MMRHistoryEntry[] = response.data.map((entry) => ({
      currenttier: entry.currenttier,
      currenttierpatched: entry.currenttierpatched,
      elo: entry.elo,
      mmr_change_to_last_game: entry.mmr_change_to_last_game,
      ranking_in_tier: entry.ranking_in_tier,
      date: entry.date,
      matchId: entry.match_id ?? "",
    }));

    this.cache.set(key, data, CACHE_TTL.MMR_HISTORY);
    return data;
  }

  async getMatchById(matchId: string): Promise<HenrikMatch> {
    const key = cacheKeys.matchDetail(matchId);
    const cached = this.cache.get<HenrikMatch>(key);
    if (cached) return cached;

    await this.rateLimiter.acquire();
    const response = await this.http.get<HenrikMatchDetailResponse>(
      `${BASE_URL}/valorant/v2/match/${encodeURIComponent(matchId)}`
    );

    const data = response.data;
    this.cache.set(key, data, CACHE_TTL.MATCH_DETAIL);
    return data;
  }

  async getLeaderboard(region: string): Promise<HenrikLeaderboardPlayer[]> {
    const key = cacheKeys.leaderboard(region);
    const cached = this.cache.get<HenrikLeaderboardPlayer[]>(key);
    if (cached) return cached;

    await this.rateLimiter.acquire();
    const response = await this.http.get<HenrikLeaderboardResponse>(
      `${BASE_URL}/valorant/v3/leaderboard/${encodeURIComponent(region)}/pc`
    );

    const players = (response.data?.players ?? []).slice(0, 100);
    this.cache.set(key, players, CACHE_TTL.LEADERBOARD);
    return players;
  }

  // ===== Transform helpers =====

  private transformAccount(
    raw: HenrikAccountResponse["data"]
  ): AccountData {
    return {
      puuid: raw.puuid,
      gameName: raw.name,
      tagLine: raw.tag,
      region: raw.region,
      accountLevel: raw.account_level,
      card: {
        small: raw.card.small,
        large: raw.card.large,
        wide: raw.card.wide,
      },
      lastUpdate: raw.last_update,
    };
  }

  private transformMMR(raw: HenrikMMRResponse["data"]): MMRData {
    const current = raw.current_data;
    const highest = raw.highest_rank;

    return {
      currentRank: buildRankInfo(
        current.currenttier,
        current.ranking_in_tier,
        current.elo
      ),
      peakRank: buildRankInfo(highest.tier),
      rankingInTier: current.ranking_in_tier,
      elo: current.elo,
      gamesNeededForRating: current.games_needed_for_rating,
      seasonalData: Object.fromEntries(
        Object.entries(raw.by_season)
          .filter(([, season]) => !season.error && season.number_of_games > 0)
          .map(([id, season]) => [
            id,
            {
              wins: season.wins,
              losses: season.number_of_games - season.wins,
              gamesPlayed: season.number_of_games,
              finalRank: season.final_rank,
              finalRankPatched: season.final_rank_patched,
              actRankWins: (season.act_rank_wins ?? []).map((w) => ({
                patchedTier: w.patched_tier,
                tier: w.tier,
              })),
            },
          ])
      ),
    };
  }
}

// ===== Singleton =====

let providerInstance: HenrikDevProvider | null = null;

export function getProvider(): HenrikDevProvider {
  if (!providerInstance) {
    providerInstance = new HenrikDevProvider();
  }
  return providerInstance;
}
