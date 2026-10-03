CREATE TABLE public.social_proof_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  enabled boolean NOT NULL DEFAULT false,
  initial_delay_seconds integer NOT NULL DEFAULT 5,
  display_seconds integer NOT NULL DEFAULT 5,
  gap_seconds integer NOT NULL DEFAULT 8,
  position text NOT NULL DEFAULT 'bottom-left',
  language text NOT NULL DEFAULT 'en',
  badge text NOT NULL DEFAULT 'cod',
  product_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.social_proof_settings TO anon, authenticated;
GRANT ALL ON public.social_proof_settings TO service_role;
ALTER TABLE public.social_proof_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view social proof settings" ON public.social_proof_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert social proof settings" ON public.social_proof_settings FOR INSERT TO anon, authenticated WITH CHECK (id = true);
CREATE POLICY "Anyone can update social proof settings" ON public.social_proof_settings FOR UPDATE TO anon, authenticated USING (id = true) WITH CHECK (id = true);
CREATE TRIGGER update_social_proof_settings_updated_at BEFORE UPDATE ON public.social_proof_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.social_proof_settings (id) VALUES (true) ON CONFLICT DO NOTHING;