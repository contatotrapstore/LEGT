export const cacheKeys = {
  account: (name: string, tag: string) =>
    `account:${name.toLowerCase()}#${tag.toLowerCase()}`,

  mmr: (region: string, name: string, tag: string) =>
    `mmr:${region}:${name.toLowerCase()}#${tag.toLowerCase()}`,

  mmrHistory: (region: string, name: string, tag: string) =>
    `mmr-history:${region}:${name.toLowerCase()}#${tag.toLowerCase()}`,

  matches: (region: string, name: string, tag: string) =>
    `matches:${region}:${name.toLowerCase()}#${tag.toLowerCase()}`,

  matchDetail: (matchId: string) => `match:${matchId}`,

  leaderboard: (region: string) => `leaderboard:${region}`,
};
