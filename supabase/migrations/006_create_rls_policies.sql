-- ===== USERS =====
CREATE POLICY "Users can view own record"
  ON public.users FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own record"
  ON public.users FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own record"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- ===== PROFILES =====
CREATE POLICY "Profile owner full access"
  ON public.profiles FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Public profiles viewable by everyone"
  ON public.profiles FOR SELECT
  TO authenticated, anon
  USING (is_profile_public = true);

-- ===== OPTIN AUDIT =====
CREATE POLICY "Users can view own audit trail"
  ON public.optin_audit FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own audit entries"
  ON public.optin_audit FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ===== MATCHES CACHE =====
CREATE POLICY "Anyone can read matches cache"
  ON public.matches_cache FOR SELECT
  TO authenticated, anon
  USING (true);

-- ===== STATS SNAPSHOTS =====
CREATE POLICY "Stats readable for public profiles"
  ON public.stats_snapshots FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.puuid = stats_snapshots.puuid
        AND profiles.is_profile_public = true
    )
  );

CREATE POLICY "Owner can read own snapshots"
  ON public.stats_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.puuid = stats_snapshots.puuid
        AND users.id = (SELECT auth.uid())
    )
  );
