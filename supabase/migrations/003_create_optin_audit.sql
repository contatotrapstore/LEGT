CREATE TABLE IF NOT EXISTS public.optin_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('opt_in', 'opt_out')),
  scope TEXT NOT NULL DEFAULT 'profile_public',
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_optin_audit_user_id ON public.optin_audit(user_id);
CREATE INDEX idx_optin_audit_created_at ON public.optin_audit(created_at DESC);

ALTER TABLE public.optin_audit ENABLE ROW LEVEL SECURITY;
