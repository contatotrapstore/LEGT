CREATE TABLE IF NOT EXISTS public.stats_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puuid TEXT NOT NULL,
  act_id TEXT NOT NULL,
  matches_played INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  total_kills INTEGER NOT NULL DEFAULT 0,
  total_deaths INTEGER NOT NULL DEFAULT 0,
  total_assists INTEGER NOT NULL DEFAULT 0,
  total_acs NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_adr NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_headshots INTEGER NOT NULL DEFAULT 0,
  total_bodyshots INTEGER NOT NULL DEFAULT 0,
  total_legshots INTEGER NOT NULL DEFAULT 0,
  total_first_kills INTEGER NOT NULL DEFAULT 0,
  total_first_deaths INTEGER NOT NULL DEFAULT 0,
  total_multi_kills INTEGER NOT NULL DEFAULT 0,
  total_clutches INTEGER NOT NULL DEFAULT 0,
  peak_rank_tier INTEGER,
  end_rank_tier INTEGER,
  start_rr INTEGER,
  end_rr INTEGER,
  agent_stats JSONB DEFAULT '[]',
  map_stats JSONB DEFAULT '[]',
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(puuid, act_id)
);

CREATE INDEX idx_stats_snapshots_puuid ON public.stats_snapshots(puuid);
CREATE INDEX idx_stats_snapshots_puuid_act ON public.stats_snapshots(puuid, act_id);

CREATE TRIGGER update_stats_snapshots_updated_at
  BEFORE UPDATE ON public.stats_snapshots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.stats_snapshots ENABLE ROW LEVEL SECURITY;
