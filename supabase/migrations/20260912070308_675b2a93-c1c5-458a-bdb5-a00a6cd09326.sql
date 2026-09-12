CREATE TABLE public.announcement_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  announcement_text TEXT NOT NULL DEFAULT 'Free Shipping on All Orders',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  background_color TEXT NOT NULL DEFAULT '#2F6B2F',
  text_color TEXT NOT NULL DEFAULT '#FFFFFF',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT announcement_settings_single_row CHECK (id = TRUE),
  CONSTRAINT announcement_settings_text_not_blank CHECK (length(btrim(announcement_text)) > 0),
  CONSTRAINT announcement_settings_background_hex CHECK (background_color ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT announcement_settings_text_hex CHECK (text_color ~ '^#[0-9A-Fa-f]{6}$')
);

GRANT SELECT, INSERT, UPDATE ON public.announcement_settings TO anon, authenticated;
GRANT ALL ON public.announcement_settings TO service_role;

ALTER TABLE public.announcement_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcement settings"
  ON public.announcement_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert announcement settings"
  ON public.announcement_settings FOR INSERT TO anon, authenticated WITH CHECK (id = TRUE);

CREATE POLICY "Anyone can update announcement settings"
  ON public.announcement_settings FOR UPDATE TO anon, authenticated USING (id = TRUE) WITH CHECK (id = TRUE);

CREATE TRIGGER update_announcement_settings_updated_at
  BEFORE UPDATE ON public.announcement_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.announcement_settings;