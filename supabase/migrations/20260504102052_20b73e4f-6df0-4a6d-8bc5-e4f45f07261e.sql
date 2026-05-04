-- Settings table (single row enforced by unique id)
CREATE TABLE public.notification_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  recipient_email TEXT NOT NULL DEFAULT 'healthcarenutrix@gmail.com',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = TRUE)
);

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view notification settings"
  ON public.notification_settings FOR SELECT USING (true);

CREATE POLICY "Anyone can insert notification settings"
  ON public.notification_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update notification settings"
  ON public.notification_settings FOR UPDATE USING (true);

INSERT INTO public.notification_settings (id, recipient_email, enabled)
  VALUES (TRUE, 'healthcarenutrix@gmail.com', TRUE);

-- Events table for notification triggers
CREATE TABLE public.notification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('order','message','test')),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  payload JSONB,
  recipient_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','skipped','failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view notification events"
  ON public.notification_events FOR SELECT USING (true);

CREATE POLICY "Anyone can insert notification events"
  ON public.notification_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update notification events"
  ON public.notification_events FOR UPDATE USING (true);

CREATE INDEX idx_notification_events_created ON public.notification_events (created_at DESC);
