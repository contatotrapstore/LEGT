import type { HenrikLifetimeMatch, HenrikMatch, HenrikMatchPlayer } from "@/types/api";
import type {
  AgentStats,
  BadgeType,
  MapStats,
  MatchDetail,
  MatchPlayer,
  MatchResult,
  MatchSummary,
  MMRHistoryEntry,
  PlayerStats,
  QueueType,
} from "@/types/valorant";
import { AGENTS } from "./constants";
import { buildRankInfo } from "./rank-utils";

export function computePlayerStats(
  matches: HenrikLifetimeMatch[]
): PlayerStats {
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalScore = 0;
  let totalDamageMade = 0;
  let totalDamageReceived = 0;
  let totalHeadshots = 0;
  let totalBodyshots = 0;
  let totalLegshots = 0;
  let wins = 0;
  let losses = 0;
  let totalRounds = 0;

  const results: MatchResult[] = [];

  for (const match of matches) {
    const s = match.stats;
    const roundsPlayed = match.teams.red + match.teams.blue;

    totalKills += s.kills;
    totalDeaths += s.deaths;
    totalAssists += s.assists;
    totalScore += s.score;
    totalDamageMade += s.damage.made;
    totalDamageReceived += s.damage.received;
    totalHeadshots += s.shots.head;
    totalBodyshots += s.shots.body;
    totalLegshots += s.shots.leg;
    totalRounds += roundsPlayed;

    const team = s.team.toLowerCase();
    const teamScore = team === "red" ? match.teams.red : match.teams.blue;
    const enemyScore = team === "red" ? match.teams.blue : match.teams.red;

    if (teamScore > enemyScore) {
      wins++;
      results.push("win");
    } else if (teamScore < enemyScore) {
      losses++;
      results.push("loss");
    } else {
      results.push("draw");
    }
  }

  const matchCount = matches.length;
  const totalShots = totalHeadshots + totalBodyshots + totalLegshots;
  const draws = matchCount - wins - losses;

  // Current streak (most recent matches first)
  let currentStreak = 0;
  if (results.length > 0) {
    const firstResult = results[0];
    if (firstResult === "win" || firstResult === "loss") {
      currentStreak = firstResult === "win" ? 1 : -1;
      for (let i = 1; i < results.length; i++) {
        if (results[i] === firstResult) {
          currentStreak += firstResult === "win" ? 1 : -1;
        } else {
          break;
        }
      }
    }
  }

  // Longest win streak
  let longestWinStreak = 0;
  let currentWinRun = 0;
  for (const r of results) {
    if (r === "win") {
      currentWinRun++;
      if (currentWinRun > longestWinStreak) longestWinStreak = currentWinRun;
    } else {
      currentWinRun = 0;
    }
  }

  return {
    kills: totalKills,
    deaths: totalDeaths,
    assists: totalAssists,
    kd: totalDeaths > 0 ? totalKills / totalDeaths : totalKills,
    acs: totalRounds > 0 ? Math.round(totalScore / totalRounds) : 0,
    adr: totalRounds > 0 ? Math.round(totalDamageMade / totalRounds) : 0,
    hsPercent: totalShots > 0 ? (totalHeadshots / totalShots) * 100 : 0,
    bodyShotPercent: totalShots > 0 ? (totalBodyshots / totalShots) * 100 : 0,
    legShotPercent: totalShots > 0 ? (totalLegshots / totalShots) * 100 : 0,
    winRate: matchCount > 0 ? (wins / matchCount) * 100 : 0,
    kast: 0,
    firstKills: 0,
    firstDeaths: 0,
    matchesPlayed: matchCount,
    wins,
    losses,
    draws,
    damagePerMatch: matchCount > 0 ? Math.round(totalDamageMade / matchCount) : 0,
    damageDelta:
      matchCount > 0
        ? Math.round((totalDamageMade - totalDamageReceived) / matchCount)
        : 0,
    avgKillsPerMatch: matchCount > 0 ? totalKills / matchCount : 0,
    avgDeathsPerMatch: matchCount > 0 ? totalDeaths / matchCount : 0,
    avgAssistsPerMatch: matchCount > 0 ? totalAssists / matchCount : 0,
    scorePerMatch: matchCount > 0 ? Math.round(totalScore / matchCount) : 0,
    currentStreak,
    longestWinStreak,
  };
}

export function computeMapStats(
  matches: HenrikLifetimeMatch[]
): MapStats[] {
  const mapMap = new Map<
    string,
    {
      wins: number;
      losses: number;
      kills: number;
      deaths: number;
      score: number;
      rounds: number;
      count: number;
      damageMade: number;
    }
  >();

  for (const match of matches) {
    const s = match.stats;
    const mapName = match.meta.map.name;
    const roundsPlayed = match.teams.red + match.teams.blue;
    const team = s.team.toLowerCase();
    const teamScore = team === "red" ? match.teams.red : match.teams.blue;
    const enemyScore = team === "red" ? match.teams.blue : match.teams.red;

    const existing = mapMap.get(mapName) || {
      wins: 0,
      losses: 0,
      kills: 0,
      deaths: 0,
      score: 0,
      rounds: 0,
      count: 0,
      damageMade: 0,
    };

    existing.kills += s.kills;
    existing.deaths += s.deaths;
    existing.score += s.score;
    existing.rounds += roundsPlayed;
    existing.count++;
    existing.damageMade += s.damage.made;

    if (teamScore > enemyScore) {
      existing.wins++;
    } else if (teamScore < enemyScore) {
      existing.losses++;
    }

    mapMap.set(mapName, existing);
  }

  return Array.from(mapMap.entries())
    .map(([mapName, stats]) => ({
      mapName,
      matchesPlayed: stats.count,
      wins: stats.wins,
      losses: stats.losses,
      winRate: stats.count > 0 ? (stats.wins / stats.count) * 100 : 0,
      avgKills: stats.count > 0 ? stats.kills / stats.count : 0,
      avgDeaths: stats.count > 0 ? stats.deaths / stats.count : 0,
      avgAcs: stats.rounds > 0 ? Math.round(stats.score / stats.rounds) : 0,
      adr: stats.rounds > 0 ? Math.round(stats.damageMade / stats.rounds) : 0,
      kd: stats.deaths > 0 ? stats.kills / stats.deaths : stats.kills,
    }))
    .sort((a, b) => b.matchesPlayed - a.matchesPlayed);
}

export function computeAgentStats(
  matches: HenrikLifetimeMatch[]
): AgentStats[] {
  const agentMap = new Map<
    string,
    {
      wins: number;
      losses: number;
      kills: number;
      deaths: number;
      score: number;
      rounds: number;
      count: number;
      damageMade: number;
      headshots: number;
      bodyshots: number;
      legshots: number;
    }
  >();

  for (const match of matches) {
    const s = match.stats;
    const agent = s.character.name;
    const roundsPlayed = match.teams.red + match.teams.blue;
    const team = s.team.toLowerCase();
    const teamScore = team === "red" ? match.teams.red : match.teams.blue;
    const enemyScore = team === "red" ? match.teams.blue : match.teams.red;

    const existing = agentMap.get(agent) || {
      wins: 0,
      losses: 0,
      kills: 0,
      deaths: 0,
      score: 0,
      rounds: 0,
      count: 0,
      damageMade: 0,
      headshots: 0,
      bodyshots: 0,
      legshots: 0,
    };

    existing.kills += s.kills;
    existing.deaths += s.deaths;
    existing.score += s.score;
    existing.rounds += roundsPlayed;
    existing.count++;
    existing.damageMade += s.damage.made;
    existing.headshots += s.shots.head;
    existing.bodyshots += s.shots.body;
    existing.legshots += s.shots.leg;

    if (teamScore > enemyScore) {
      existing.wins++;
    } else if (teamScore < enemyScore) {
      existing.losses++;
    }

    agentMap.set(agent, existing);
  }

  const totalMatches = matches.length;

  return Array.from(agentMap.entries())
    .map(([agent, stats]) => {
      const totalShots = stats.headshots + stats.bodyshots + stats.legshots;
      return {
        agentName: agent,
        agentIcon: `https://media.valorant-api.com/agents/${getAgentUuid(agent)}/displayicon.png`,
        role: AGENTS[agent]?.role ?? "duelist",
        pickRate: totalMatches > 0 ? (stats.count / totalMatches) * 100 : 0,
        winRate: stats.count > 0 ? (stats.wins / stats.count) * 100 : 0,
        kd:
          stats.deaths > 0
            ? stats.kills / stats.deaths
            : stats.kills,
        acs: stats.rounds > 0 ? Math.round(stats.score / stats.rounds) : 0,
        adr: stats.rounds > 0 ? Math.round(stats.damageMade / stats.rounds) : 0,
        hsPercent: totalShots > 0 ? (stats.headshots / totalShots) * 100 : 0,
        avgKills: stats.count > 0 ? stats.kills / stats.count : 0,
        avgDeaths: stats.count > 0 ? stats.deaths / stats.count : 0,
        matchesPlayed: stats.count,
      };
    })
    .sort((a, b) => b.matchesPlayed - a.matchesPlayed);
}

export function transformLifetimeMatchToSummary(
  match: HenrikLifetimeMatch
): MatchSummary {
  const s = match.stats;
  const meta = match.meta;
  const roundsPlayed = match.teams.red + match.teams.blue;
  const team = s.team.toLowerCase();
  const teamScore = team === "red" ? match.teams.red : match.teams.blue;
  const enemyScore = team === "red" ? match.teams.blue : match.teams.red;

  let result: MatchResult = "draw";
  if (teamScore > enemyScore) result = "win";
  else if (teamScore < enemyScore) result = "loss";

  const totalShots = s.shots.head + s.shots.body + s.shots.leg;
  const hsPercent = totalShots > 0 ? (s.shots.head / totalShots) * 100 : 0;
  const acs = roundsPlayed > 0 ? Math.round(s.score / roundsPlayed) : 0;

  const badges: BadgeType[] = [];
  if (hsPercent >= 35) badges.push("headshot_machine");

  const modeMap: Record<string, QueueType> = {
    Competitive: "competitive",
    Unrated: "unrated",
    Deathmatch: "deathmatch",
    "Spike Rush": "spikerush",
    Escalation: "escalation",
    Replication: "replication",
    Swiftplay: "swiftplay",
    Premier: "premier",
    Custom: "custom",
  };

  const rankInfo = buildRankInfo(s.tier);
  const adr = roundsPlayed > 0 ? Math.round(s.damage.made / roundsPlayed) : 0;

  return {
    matchId: meta.id,
    map: meta.map.name,
    mapIcon: "",
    mode: modeMap[meta.mode] ?? "unknown",
    score: { team: teamScore, enemy: enemyScore },
    result,
    agent: s.character.name,
    agentIcon: `https://media.valorant-api.com/agents/${s.character.id}/displayicon.png`,
    kills: s.kills,
    deaths: s.deaths,
    assists: s.assists,
    acs,
    hsPercent,
    multiKills: { doubles: 0, triples: 0, quads: 0, aces: 0 },
    firstKill: false,
    badges,
    playedAt: meta.started_at,
    roundsPlayed,
    tier: s.tier,
    tierName: rankInfo.tierName,
    tierIcon: rankInfo.iconUrl,
    rrChange: null,
    rrAfter: null,
    damageMade: s.damage.made,
    damageReceived: s.damage.received,
    adr,
    shots: { head: s.shots.head, body: s.shots.body, leg: s.shots.leg },
    totalScore: s.score,
  };
}

export function correlateMatchesWithMMR(
  matches: MatchSummary[],
  mmrHistory: MMRHistoryEntry[]
): void {
  const mmrMap = new Map<string, MMRHistoryEntry>();
  for (const entry of mmrHistory) {
    mmrMap.set(entry.matchId, entry);
  }

  for (const match of matches) {
    const mmrEntry = mmrMap.get(match.matchId);
    if (mmrEntry && match.mode === "competitive") {
      match.rrChange = mmrEntry.mmr_change_to_last_game;
      match.rrAfter = mmrEntry.ranking_in_tier;
    }
  }
}

const AGENT_UUID_MAP: Record<string, string> = {
  Astra: "41fb69c1-4189-7b37-f117-bcaf1e96f1bf",
  Breach: "5f8d3a7f-467b-97f3-062c-13acf203c006",
  Brimstone: "9f0d8ba9-4140-b941-57d3-a7ad57c6b417",
  Chamber: "22697a3d-45bf-8dd7-4fec-84a9e28c69d7",
  Clove: "1dbf2edd-4729-0984-3115-daa5eed44993",
  Cypher: "117ed9e3-49f3-6512-3ccf-0cada7e3823b",
  Deadlock: "cc8b64c8-4b25-4ff9-6e7f-37b4da43d235",
  Fade: "dade69b4-4f5a-8528-247b-219e5a1facd6",
  Gekko: "e370fa57-4757-3604-3648-499e1f642d3f",
  Harbor: "95b78ed7-4637-86d9-7e41-71ba8c293152",
  Iso: "0e38b510-41a8-5780-5e8f-568b2a4f2d6c",
  Jett: "add6443a-41bd-e414-f6ad-e58d267f4e95",
  "KAY/O": "601dbbe7-43ce-be57-2a40-4abd24953621",
  Killjoy: "1e58de9c-4950-5125-93e9-a0aee9f98746",
  Neon: "bb2a4828-46eb-8cd1-e765-15848195d751",
  Omen: "8e253930-4c05-31dd-1b6c-968525494517",
  Phoenix: "eb93336a-449b-9c1b-0a54-a891f7921d69",
  Raze: "f94c3b30-42be-e959-889c-5aa313dba261",
  Reyna: "a3bfb853-43b2-7238-a4f1-ad90e9e46bcc",
  Sage: "569fdd95-4d10-43ab-ca70-79becc718b46",
  Skye: "6f2a04ca-43e0-be17-7f36-b3908627744d",
  Sova: "320b2a48-4d9b-a075-30f1-1f93a9b638fa",
  Tejo: "b444168c-4e35-8076-db47-ef9bf368f384",
  Veto: "92eeef5d-43b5-1d4a-8d03-b3927a09034b",
  Viper: "707eab51-4836-f488-046a-cda6bf494859",
  Vyse: "efba5359-4016-a1e5-7626-b1ae76895940",
  Waylay: "df1cb487-4902-002e-5c17-d28e83e78588",
  Yoru: "7f94d92c-4234-0a36-9646-3a87eb8b5c89",
};

function getAgentUuid(agentName: string): string {
  return AGENT_UUID_MAP[agentName] ?? "";
}

// ===== Match Detail Transform =====

function transformPlayer(
  p: HenrikMatchPlayer,
  roundsPlayed: number,
  observedPuuid: string
): MatchPlayer {
  const totalShots = p.stats.headshots + p.stats.bodyshots + p.stats.legshots;
  const acs = roundsPlayed > 0 ? Math.round(p.stats.score / roundsPlayed) : 0;
  const adr = roundsPlayed > 0 ? Math.round(p.damage_made / roundsPlayed) : 0;
  const hsPercent = totalShots > 0 ? (p.stats.headshots / totalShots) * 100 : 0;

  return {
    puuid: p.puuid,
    name: p.name,
    tag: p.tag,
    agent: p.character,
    agentIcon: p.assets?.agent?.small || "",
    rank: p.currenttier,
    team: p.team.toLowerCase() as "blue" | "red",
    stats: {
      kills: p.stats.kills,
      deaths: p.stats.deaths,
      assists: p.stats.assists,
      acs,
      adr,
      hsPercent,
      firstKills: 0,
      firstDeaths: 0,
      multiKills: 0,
      plants: 0,
      defuses: 0,
    },
    isObserved: p.puuid === observedPuuid,
    damageMade: p.damage_made,
    damageReceived: p.damage_received,
    partyId: p.party_id,
    rankPatched: p.currenttier_patched,
  };
}

export function transformMatchToDetail(
  raw: HenrikMatch,
  observedPuuid: string
): MatchDetail {
  const roundsPlayed = raw.metadata.rounds_played;

  const allPlayers = raw.players.all_players.map((p) =>
    transformPlayer(p, roundsPlayed, observedPuuid)
  );

  const bluePlayers = allPlayers
    .filter((p) => p.team === "blue")
    .sort((a, b) => b.stats.acs - a.stats.acs);
  const redPlayers = allPlayers
    .filter((p) => p.team === "red")
    .sort((a, b) => b.stats.acs - a.stats.acs);

  const modeRaw = raw.metadata.mode?.toLowerCase() || "";
  const mode: QueueType =
    modeRaw === "competitive" ? "competitive"
    : modeRaw === "unrated" ? "unrated"
    : modeRaw === "deathmatch" ? "deathmatch"
    : modeRaw === "spike rush" ? "spikerush"
    : modeRaw === "swiftplay" ? "swiftplay"
    : modeRaw === "escalation" ? "escalation"
    : modeRaw === "replication" ? "replication"
    : modeRaw === "premier" ? "premier"
    : modeRaw === "custom game" ? "custom"
    : "unknown";

  return {
    matchId: raw.metadata.matchid,
    map: raw.metadata.map,
    mapIcon: "",
    mode,
    duration: raw.metadata.game_length,
    startedAt: raw.metadata.game_start_patched,
    score: {
      blue: raw.teams.blue.rounds_won,
      red: raw.teams.red.rounds_won,
    },
    teams: {
      blue: bluePlayers,
      red: redPlayers,
    },
    rounds: raw.rounds?.map((r, i) => ({
      roundNum: i + 1,
      winningTeam: r.winning_team.toLowerCase() as "blue" | "red",
      endType: r.end_type,
    })) || [],
  };
}
