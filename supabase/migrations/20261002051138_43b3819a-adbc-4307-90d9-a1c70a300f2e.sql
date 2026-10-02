ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_events;