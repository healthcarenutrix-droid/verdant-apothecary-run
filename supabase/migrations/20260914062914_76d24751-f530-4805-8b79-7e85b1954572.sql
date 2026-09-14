CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  ga4_id text NOT NULL DEFAULT '',
  google_ads_id text NOT NULL DEFAULT '',
  meta_pixel_id text NOT NULL DEFAULT '',
  tiktok_pixel_id text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO anon;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert site settings" ON public.site_settings FOR INSERT TO anon, authenticated WITH CHECK (id = 1);
CREATE POLICY "Anyone can update site settings" ON public.site_settings FOR UPDATE TO anon, authenticated USING (id = 1) WITH CHECK (id = 1);

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;