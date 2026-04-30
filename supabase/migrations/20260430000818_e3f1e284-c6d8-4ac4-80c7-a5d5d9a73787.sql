
-- 1) Function to build a referral code from a display name
CREATE OR REPLACE FUNCTION public.build_referral_code_from_name(p_name text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  cleaned text;
  parts text[];
  first_part text;
  last_part text;
  base_code text;
  candidate text;
  suffix int := 0;
  exists_check boolean;
BEGIN
  -- Normalize: remove accents, uppercase, keep only A-Z and spaces
  cleaned := upper(unaccent(coalesce(p_name, '')));
  cleaned := regexp_replace(cleaned, '[^A-Z ]', '', 'g');
  cleaned := trim(regexp_replace(cleaned, '\s+', ' ', 'g'));

  IF cleaned = '' THEN
    -- fallback: random 6 chars
    base_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
  ELSE
    parts := string_to_array(cleaned, ' ');
    first_part := parts[1];
    IF array_length(parts, 1) >= 2 THEN
      last_part := parts[array_length(parts, 1)];
      base_code := substr(first_part, 1, 1) || last_part;
    ELSE
      -- Only one word: take first letter + rest
      base_code := first_part;
    END IF;
  END IF;

  -- Truncate to 12 chars max
  base_code := substr(base_code, 1, 12);

  -- Find unique candidate
  candidate := base_code;
  LOOP
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = candidate) INTO exists_check;
    EXIT WHEN NOT exists_check;
    suffix := suffix + 1;
    candidate := substr(base_code, 1, 12 - length(suffix::text)) || suffix::text;
  END LOOP;

  RETURN candidate;
END;
$$;

-- Ensure unaccent extension exists
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2) Update handle_new_user to use new code format and credit the referee +5
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral_code TEXT;
  v_inviter_id UUID;
  v_display_name TEXT;
  v_new_code TEXT;
BEGIN
  v_referral_code := upper(NULLIF(NEW.raw_user_meta_data->>'referral_code', ''));
  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    ''
  );

  IF v_referral_code IS NOT NULL THEN
    SELECT user_id INTO v_inviter_id
    FROM public.profiles
    WHERE referral_code = v_referral_code
    LIMIT 1;
  END IF;

  v_new_code := public.build_referral_code_from_name(v_display_name);

  -- Insert profile (filleul gets +5 credits if invited = base 5 + 5 = 10)
  INSERT INTO public.profiles (user_id, display_name, avatar_url, referral_code, referred_by, credits)
  VALUES (
    NEW.id,
    v_display_name,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    v_new_code,
    v_inviter_id,
    CASE WHEN v_inviter_id IS NOT NULL THEN 10 ELSE 5 END
  );

  IF v_inviter_id IS NOT NULL THEN
    -- Log filleul bonus
    INSERT INTO public.credit_transactions (user_id, type, amount, action)
    VALUES (NEW.id, 'credit', 5, 'referral_welcome');

    -- +5 credits to inviter
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
$$;

-- 3) Make sure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4) Regenerate referral codes for all existing profiles based on display_name
DO $$
DECLARE
  r RECORD;
  new_code text;
BEGIN
  -- Clear existing codes first to avoid uniqueness conflicts during regeneration
  UPDATE public.profiles SET referral_code = NULL;

  FOR r IN SELECT user_id, display_name FROM public.profiles ORDER BY created_at ASC LOOP
    new_code := public.build_referral_code_from_name(coalesce(r.display_name, ''));
    UPDATE public.profiles SET referral_code = new_code WHERE user_id = r.user_id;
  END LOOP;
END $$;
