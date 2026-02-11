import type {
  AccountData,
  MMRData,
  MMRHistoryEntry,
} from "@/types/valorant";
import type { HenrikLeaderboardPlayer, HenrikLifetimeMatch, HenrikMatch } from "@/types/api";

export interface DataProvider {
  getAccountByRiotId(name: string, tag: string): Promise<AccountData>;

  getLifetimeMatches(
    region: string,
    name: string,
    tag: string,
    options?: { mode?: string; size?: number }
  ): Promise<HenrikLifetimeMatch[]>;

  getMMRByRiotId(
    region: string,
    name: string,
    tag: string
  ): Promise<MMRData>;

  getMMRHistoryByRiotId(
    region: string,
    name: string,
    tag: string
  ): Promise<MMRHistoryEntry[]>;

  getMatchById(matchId: string): Promise<HenrikMatch>;

  getLeaderboard(region: string): Promise<HenrikLeaderboardPlayer[]>;
}
