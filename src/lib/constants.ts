import type { AgentRole, RankKey } from "@/types/valorant";
import type { SearchEntry } from "@/lib/recent-searches";

// ===== POPULAR PLAYERS =====

export const POPULAR_PLAYERS: SearchEntry[] = [
  { name: "TenZ", tag: "0505", region: "na" },
  { name: "aspas", tag: "aspas", region: "br" },
  { name: "Demon1", tag: "NA1", region: "na" },
  { name: "Less", tag: "LOUD", region: "br" },
  { name: "Chronicle", tag: "FNC", region: "eu" },
  { name: "Derke", tag: "DERKE", region: "eu" },
  { name: "Zekken", tag: "SEN", region: "na" },
  { name: "Yay", tag: "yay", region: "na" },
  { name: "Cned", tag: "cnedd", region: "eu" },
  { name: "s0m", tag: "s0m", region: "ap" },
];

// ===== REGIONS =====

export const REGIONS = [
  { value: "eu", label: "Europe" },
  { value: "na", label: "North America" },
  { value: "ap", label: "Asia Pacific" },
  { value: "kr", label: "Korea" },
  { value: "latam", label: "Latin America" },
  { value: "br", label: "Brazil" },
] as const;

export type Region = (typeof REGIONS)[number]["value"];

// ===== RANK TIERS =====
// Tier 0 = Unranked, 3-5 = Iron 1-3, 6-8 = Bronze 1-3, ..., 27 = Radiant

export interface RankTierInfo {
  tier: number;
  name: string;
  rankKey: RankKey;
  division: number;
}

export const RANK_TIERS: RankTierInfo[] = [
  { tier: 0, name: "Unranked", rankKey: "unranked", division: 0 },
  { tier: 1, name: "Unused 1", rankKey: "unranked", division: 0 },
  { tier: 2, name: "Unused 2", rankKey: "unranked", division: 0 },
  { tier: 3, name: "Iron 1", rankKey: "iron", division: 1 },
  { tier: 4, name: "Iron 2", rankKey: "iron", division: 2 },
  { tier: 5, name: "Iron 3", rankKey: "iron", division: 3 },
  { tier: 6, name: "Bronze 1", rankKey: "bronze", division: 1 },
  { tier: 7, name: "Bronze 2", rankKey: "bronze", division: 2 },
  { tier: 8, name: "Bronze 3", rankKey: "bronze", division: 3 },
  { tier: 9, name: "Silver 1", rankKey: "silver", division: 1 },
  { tier: 10, name: "Silver 2", rankKey: "silver", division: 2 },
  { tier: 11, name: "Silver 3", rankKey: "silver", division: 3 },
  { tier: 12, name: "Gold 1", rankKey: "gold", division: 1 },
  { tier: 13, name: "Gold 2", rankKey: "gold", division: 2 },
  { tier: 14, name: "Gold 3", rankKey: "gold", division: 3 },
  { tier: 15, name: "Platinum 1", rankKey: "platinum", division: 1 },
  { tier: 16, name: "Platinum 2", rankKey: "platinum", division: 2 },
  { tier: 17, name: "Platinum 3", rankKey: "platinum", division: 3 },
  { tier: 18, name: "Diamond 1", rankKey: "diamond", division: 1 },
  { tier: 19, name: "Diamond 2", rankKey: "diamond", division: 2 },
  { tier: 20, name: "Diamond 3", rankKey: "diamond", division: 3 },
  { tier: 21, name: "Ascendant 1", rankKey: "ascendant", division: 1 },
  { tier: 22, name: "Ascendant 2", rankKey: "ascendant", division: 2 },
  { tier: 23, name: "Ascendant 3", rankKey: "ascendant", division: 3 },
  { tier: 24, name: "Immortal 1", rankKey: "immortal", division: 1 },
  { tier: 25, name: "Immortal 2", rankKey: "immortal", division: 2 },
  { tier: 26, name: "Immortal 3", rankKey: "immortal", division: 3 },
  { tier: 27, name: "Radiant", rankKey: "radiant", division: 0 },
];

// ===== AGENTS =====

export interface AgentInfo {
  name: string;
  role: AgentRole;
}

export const AGENTS: Record<string, AgentInfo> = {
  Astra: { name: "Astra", role: "controller" },
  Breach: { name: "Breach", role: "initiator" },
  Brimstone: { name: "Brimstone", role: "controller" },
  Chamber: { name: "Chamber", role: "sentinel" },
  Clove: { name: "Clove", role: "controller" },
  Cypher: { name: "Cypher", role: "sentinel" },
  Deadlock: { name: "Deadlock", role: "sentinel" },
  Fade: { name: "Fade", role: "initiator" },
  Gekko: { name: "Gekko", role: "initiator" },
  Harbor: { name: "Harbor", role: "controller" },
  Iso: { name: "Iso", role: "duelist" },
  Jett: { name: "Jett", role: "duelist" },
  "KAY/O": { name: "KAY/O", role: "initiator" },
  Killjoy: { name: "Killjoy", role: "sentinel" },
  Neon: { name: "Neon", role: "duelist" },
  Omen: { name: "Omen", role: "controller" },
  Phoenix: { name: "Phoenix", role: "duelist" },
  Raze: { name: "Raze", role: "duelist" },
  Reyna: { name: "Reyna", role: "duelist" },
  Sage: { name: "Sage", role: "sentinel" },
  Skye: { name: "Skye", role: "initiator" },
  Sova: { name: "Sova", role: "initiator" },
  Tejo: { name: "Tejo", role: "initiator" },
  Veto: { name: "Veto", role: "initiator" },
  Viper: { name: "Viper", role: "controller" },
  Vyse: { name: "Vyse", role: "sentinel" },
  Waylay: { name: "Waylay", role: "duelist" },
  Yoru: { name: "Yoru", role: "duelist" },
};

// ===== MAPS =====

export const MAPS: Record<string, string> = {
  Ascent: "Ascent",
  Bind: "Bind",
  Breeze: "Breeze",
  Fracture: "Fracture",
  Haven: "Haven",
  Icebox: "Icebox",
  Lotus: "Lotus",
  Pearl: "Pearl",
  Split: "Split",
  Sunset: "Sunset",
  Abyss: "Abyss",
};

// ===== QUEUE MODES =====

export const QUEUE_DISPLAY: Record<string, string> = {
  competitive: "Competitive",
  unrated: "Unrated",
  deathmatch: "Deathmatch",
  spikerush: "Spike Rush",
  escalation: "Escalation",
  replication: "Replication",
  swiftplay: "Swiftplay",
  premier: "Premier",
  custom: "Custom",
  unknown: "Unknown",
};

// ===== FILTER MODES =====

export const FILTER_MODES = [
  { value: "all", label: "All" },
  { value: "competitive", label: "Competitive" },
  { value: "unrated", label: "Unrated" },
  { value: "deathmatch", label: "Deathmatch" },
  { value: "spikerush", label: "Spike Rush" },
  { value: "swiftplay", label: "Swiftplay" },
] as const;

// ===== MAP SPLASH IMAGES =====

export const MAP_IMAGES: Record<string, string> = {
  Ascent: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png",
  Bind: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2c7a-c0a3e5a3e8f1/splash.png",
  Breeze: "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/splash.png",
  Fracture: "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/splash.png",
  Haven: "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png",
  Icebox: "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9a90-8f8571c3e039/splash.png",
  Lotus: "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/splash.png",
  Pearl: "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77571f40f3be/splash.png",
  Split: "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png",
  Sunset: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/splash.png",
  Abyss: "https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/splash.png",
};

// ===== CACHE TTLs (seconds) =====

export const CACHE_TTL = {
  ACCOUNT: 300, // 5 min
  MATCHES: 120, // 2 min
  MATCH_DETAIL: 86400, // 24h
  MMR: 120, // 2 min
  MMR_HISTORY: 600, // 10 min
  LEADERBOARD: 300, // 5 min
} as const;
