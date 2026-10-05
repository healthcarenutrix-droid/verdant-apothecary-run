ALTER TABLE public.social_proof_settings
  ADD COLUMN IF NOT EXISTS animation_direction text NOT NULL DEFAULT 'up';

DO $$
DECLARE
  constraint_name text;
BEGIN
  FOR constraint_name IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'social_proof_settings'
      AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) ILIKE '%position%'
  LOOP
    EXECUTE format('ALTER TABLE public.social_proof_settings DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE public.social_proof_settings
  ADD CONSTRAINT social_proof_settings_position_check
  CHECK (position IN ('top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right')),
  ADD CONSTRAINT social_proof_settings_animation_direction_check
  CHECK (animation_direction IN ('up', 'down', 'left', 'right'));

UPDATE public.social_proof_settings
SET animation_direction = CASE
  WHEN position LIKE 'top-%' THEN 'down'
  ELSE 'up'
END;