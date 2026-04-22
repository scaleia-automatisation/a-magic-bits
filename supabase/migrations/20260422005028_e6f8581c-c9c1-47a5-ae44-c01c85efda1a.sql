-- Table to store Meta (Facebook + Instagram) connection per user
CREATE TABLE public.meta_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  facebook_user_id TEXT NOT NULL,
  facebook_user_token TEXT NOT NULL,
  page_id TEXT,
  page_name TEXT,
  page_access_token TEXT,
  instagram_business_account_id TEXT,
  instagram_username TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.meta_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meta connection"
  ON public.meta_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meta connection"
  ON public.meta_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meta connection"
  ON public.meta_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meta connection"
  ON public.meta_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_meta_connections_updated_at
  BEFORE UPDATE ON public.meta_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_meta_connections_user_id ON public.meta_connections(user_id);