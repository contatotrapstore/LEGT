// ===== API Response Wrapper =====

export interface ApiResponse<T> {
  status: number;
  data: T | null;
  error: string | null;
}

// ===== HenrikDev Raw Response Types =====

export interface HenrikAccountResponse {
  status: number;
  data: {
    puuid: string;
    region: string;
    account_level: number;
    name: string;
    tag: string;
    card: {
      small: string;
      large: string;
      wide: string;
      id: string;
    };
    last_update: string;
    last_update_raw: number;
  };
}

export interface HenrikMMRResponse {
  status: number;
  data: {
    name: string;
    tag: string;
    current_data: {
      currenttier: number;
      currenttierpatched: string;
      ranking_in_tier: number;
      mmr_change_to_last_game: number;
      elo: number;
      games_needed_for_rating: number;
      old: boolean;
    };
    highest_rank: {
      old: boolean;
      tier: number;
      patched_tier: string;
      season: string;
    };
    by_season: Record<
      string,
      {
        error: boolean | string;
        wins: number;
        number_of_games: number;
        final_rank: number;
        final_rank_patched: string;
        act_rank_wins: Array<{
          patched_tier: string;
          tier: number;
        }>;
        old?: boolean;
      }
    >;
  };
}

export interface HenrikMMRHistoryResponse {
  status: number;
  name: string;
  tag: string;
  data: Array<{
    currenttier: number;
    currenttierpatched: string;
    images: {
      small: string;
      large: string;
      triangle_down: string;
      triangle_up: string;
    };
    match_id: string;
    map: {
      id: string;
      name: string;
    };
    season_id: string;
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    date: string;
    date_raw: number;
  }>;
}

// ===== Lifetime Matches (v1) =====

export interface HenrikLifetimeMatchesResponse {
  status: number;
  results: {
    total: number;
    returned: number;
    before: number;
    after: number;
  };
  data: HenrikLifetimeMatch[];
}

export interface HenrikLifetimeMatch {
  meta: {
    id: string;
    map: { id: string; name: string };
    version: string;
    mode: string;
    started_at: string;
    season: { id: string; short: string };
    region: string;
    cluster: string;
  };
  stats: {
    puuid: string;
    team: string;
    level: number;
    character: { id: string; name: string };
    tier: number;
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    shots: { head: number; body: number; leg: number };
    damage: { made: number; received: number };
  };
  teams: {
    red: number;
    blue: number;
  };
}

// ===== V3 Match Types (kept for match detail) =====

export interface HenrikMatchesResponse {
  status: number;
  data: HenrikMatch[];
}

export interface HenrikMatchDetailResponse {
  status: number;
  data: HenrikMatch;
}

export interface HenrikMatch {
  metadata: {
    map: string;
    game_version: string;
    game_length: number;
    game_start: number;
    game_start_patched: string;
    rounds_played: number;
    mode: string;
    mode_id: string;
    queue: string;
    season_id: string;
    platform: string;
    matchid: string;
    premier_info: unknown;
    region: string;
    cluster: string;
  };
  players: {
    all_players: HenrikMatchPlayer[];
    red: HenrikMatchPlayer[];
    blue: HenrikMatchPlayer[];
  };
  teams: {
    red: {
      has_won: boolean;
      rounds_won: number;
      rounds_lost: number;
      roster: unknown;
    };
    blue: {
      has_won: boolean;
      rounds_won: number;
      rounds_lost: number;
      roster: unknown;
    };
  };
  rounds: Array<{
    winning_team: string;
    end_type: string;
    bomb_planted: boolean;
    bomb_defused: boolean;
    plant_events: unknown;
    defuse_events: unknown;
    player_stats: Array<{
      ability_casts: unknown;
      player_puuid: string;
      player_display_name: string;
      player_team: string;
      damage_events: unknown;
      damage: number;
      bodyshots: number;
      headshots: number;
      legshots: number;
      kills: number;
      score: number;
      economy: unknown;
      was_afk: boolean;
      was_penalized: boolean;
      stayed_in_spawn: boolean;
    }>;
  }>;
}

export interface HenrikMatchPlayer {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  level: number;
  character: string;
  currenttier: number;
  currenttier_patched: string;
  player_card: string;
  player_title: string;
  party_id: string;
  session_playtime: {
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  assets: {
    card: {
      small: string;
      large: string;
      wide: string;
    };
    agent: {
      small: string;
      bust: string;
      full: string;
      killfeed: string;
    };
  };
  behaviour: {
    afk_rounds: number;
    friendly_fire: {
      incoming: number;
      outgoing: number;
    };
    rounds_in_spawn: number;
  };
  platform: {
    type: string;
    os: { name: string; version: string };
  };
  ability_casts: {
    c_cast: number;
    q_cast: number;
    e_cast: number;
    x_cast: number;
  };
  stats: {
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    bodyshots: number;
    headshots: number;
    legshots: number;
  };
  economy: {
    spent: { overall: number; average: number };
    loadout_value: { overall: number; average: number };
  };
  damage_made: number;
  damage_received: number;
}

// ===== LEADERBOARD =====

export interface HenrikLeaderboardResponse {
  status: number;
  data: {
    players: HenrikLeaderboardPlayer[];
  };
}

export interface HenrikLeaderboardPlayer {
  puuid: string;
  name: string;
  tag: string;
  leaderboard_rank: number;
  tier: number;
  rr: number;
  wins: number;
  is_banned: boolean;
  is_anonymized: boolean;
}
