CREATE TABLE IF NOT EXISTS public.matches_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puuid TEXT NOT NULL,
  match_id TEXT NOT NULL,
  region TEXT NOT NULL,
  payload JSONB NOT NULL,
  map TEXT,
  mode TEXT,
  agent TEXT,
  result TEXT CHECK (result IN ('win', 'loss', 'draw')),
  kills INTEGER,
  deaths INTEGER,
  assists INTEGER,
  acs INTEGER,
  started_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(puuid, match_id)
);

CREATE INDEX idx_matches_cache_puuid ON public.matches_cache(puuid);
CREATE INDEX idx_matches_cache_match_id ON public.matches_cache(match_id);
CREATE INDEX idx_matches_cache_puuid_started ON public.matches_cache(puuid, started_at DESC);

ALTER TABLE public.matches_cache ENABLE ROW LEVEL SECURITY;
