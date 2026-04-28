
-- ============= 1. TABLE PARTNERSHIP REQUESTS =============
CREATE TABLE public.partnership_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  partner_type TEXT NOT NULL,
  audience_size TEXT,
  social_handle TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut soumettre (formulaire public sur la landing)
CREATE POLICY "Anyone can submit partnership request"
ON public.partnership_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Seuls les admins peuvent lire
CREATE POLICY "Admins can read partnership requests"
ON public.partnership_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============= 2. TABLE REFERRAL INVITATIONS =============
CREATE TABLE public.referral_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID NOT NULL,
  invited_email TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent', -- sent | converted
  converted_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted_at TIMESTAMPTZ,
  UNIQUE (inviter_id, invited_email)
);

CREATE INDEX idx_referral_invitations_inviter ON public.referral_invitations(inviter_id);
CREATE INDEX idx_referral_invitations_email ON public.referral_invitations(lower(invited_email));

ALTER TABLE public.referral_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own invitations"
ON public.referral_invitations FOR SELECT
TO authenticated
USING (auth.uid() = inviter_id);

CREATE POLICY "Users create own invitations"
ON public.referral_invitations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = inviter_id);

-- ============= 3. UPDATE handle_new_user POUR PARRAINAGE 5 CRÉDITS =============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_referral_code TEXT;
  v_inviter_id UUID;
BEGIN
  -- Récupère le code parrain envoyé via signUp options.data ou Google OAuth metadata
  v_referral_code := upper(NULLIF(NEW.raw_user_meta_data->>'referral_code', ''));

  -- Cherche le parrain
  IF v_referral_code IS NOT NULL THEN
    SELECT user_id INTO v_inviter_id
    FROM public.profiles
    WHERE referral_code = v_referral_code
    LIMIT 1;
  END IF;

  -- Insère le profil
  INSERT INTO public.profiles (user_id, display_name, avatar_url, referral_code, referred_by)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    public.generate_referral_code(),
    v_inviter_id
  );

  -- Si invité par un parrain : +5 crédits au parrain et marque l'invitation comme convertie
  IF v_inviter_id IS NOT NULL THEN
    UPDATE public.profiles
      SET credits = credits + 5
      WHERE user_id = v_inviter_id;

    INSERT INTO public.credit_transactions (user_id, type, amount, action)
    VALUES (v_inviter_id, 'credit', 5, 'referral_signup');

    UPDATE public.referral_invitations
      SET status = 'converted',
          converted_user_id = NEW.id,
          converted_at = now()
      WHERE inviter_id = v_inviter_id
        AND lower(invited_email) = lower(NEW.email);
  END IF;

  RETURN NEW;
END;
$function$;
