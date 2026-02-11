CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  puuid TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL DEFAULT 'eu',
  game_name TEXT NOT NULL,
  tag_line TEXT NOT NULL,
  is_profile_public BOOLEAN NOT NULL DEFAULT false,
  show_stats BOOLEAN NOT NULL DEFAULT true,
  show_match_history BOOLEAN NOT NULL DEFAULT true,
  show_agents BOOLEAN NOT NULL DEFAULT true,
  show_rank_journey BOOLEAN NOT NULL DEFAULT true,
  card_style TEXT NOT NULL DEFAULT 'default',
  current_rank_tier INTEGER,
  current_rr INTEGER,
  peak_rank_tier INTEGER,
  peak_rank_act TEXT,
  level INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_fetched_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_puuid ON public.profiles(puuid);
CREATE INDEX idx_profiles_game_name_tag ON public.profiles(game_name, tag_line);
CREATE INDEX idx_profiles_public ON public.profiles(is_profile_public) WHERE is_profile_public = true;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
