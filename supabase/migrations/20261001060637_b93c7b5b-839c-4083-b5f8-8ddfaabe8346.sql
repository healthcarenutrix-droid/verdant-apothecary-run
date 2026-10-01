CREATE TABLE public.popup_settings (
  id boolean NOT NULL DEFAULT TRUE PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  image_url text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT 'Get 10% Off Your First Order',
  body_text text NOT NULL DEFAULT 'Join our list and enjoy a welcome discount on your first purchase.',
  discount_code text NOT NULL DEFAULT '',
  button_text text NOT NULL DEFAULT 'Shop Now',
  button_link text NOT NULL DEFAULT '/products',
  trigger_type text NOT NULL DEFAULT 'load',
  trigger_delay_seconds integer NOT NULL DEFAULT 5,
  trigger_scroll_percent integer NOT NULL DEFAULT 50,
  frequency text NOT NULL DEFAULT 'session',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT popup_settings_singleton CHECK (id = TRUE),
  CONSTRAINT popup_settings_trigger_type CHECK (trigger_type IN ('load','delay','exit','scroll')),
  CONSTRAINT popup_settings_frequency CHECK (frequency IN ('always','session','day','once')),
  CONSTRAINT popup_settings_delay CHECK (trigger_delay_seconds >= 0 AND trigger_delay_seconds <= 600),
  CONSTRAINT popup_settings_scroll CHECK (trigger_scroll_percent >= 1 AND trigger_scroll_percent <= 100)
);

GRANT SELECT ON public.popup_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.popup_settings TO authenticated;
GRANT INSERT, UPDATE ON public.popup_settings TO anon;
GRANT ALL ON public.popup_settings TO service_role;

ALTER TABLE public.popup_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view popup settings" ON public.popup_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert popup settings" ON public.popup_settings FOR INSERT TO anon, authenticated WITH CHECK (id = TRUE);
CREATE POLICY "Anyone can update popup settings" ON public.popup_settings FOR UPDATE TO anon, authenticated USING (id = TRUE) WITH CHECK (id = TRUE);

CREATE TRIGGER update_popup_settings_updated_at BEFORE UPDATE ON public.popup_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.popup_settings (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.popup_settings;