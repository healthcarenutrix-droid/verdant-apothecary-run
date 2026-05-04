import { supabase } from "@/integrations/supabase/client";

export type NotificationEventType = "order" | "message" | "test";

export interface QueueNotificationInput {
  eventType: NotificationEventType;
  subject: string;
  body: string;
  payload?: Record<string, any>;
}

/**
 * Queues a notification event. Reads notification_settings to determine
 * whether the email should be sent and to whom. If notifications are
 * disabled, the event is logged with status="skipped".
 *
 * Currently the actual email send is stubbed — events are recorded in the
 * notification_events table for audit. Once an email domain is configured,
 * this can be swapped to invoke an edge function that sends via Lovable
 * Emails.
 */
export async function queueNotification(input: QueueNotificationInput) {
  try {
    const { data: settings } = await supabase
      .from("notification_settings")
      .select("recipient_email, enabled")
      .eq("id", true)
      .maybeSingle();

    const enabled = settings?.enabled ?? true;
    const recipient = settings?.recipient_email ?? null;

    await supabase.from("notification_events").insert({
      event_type: input.eventType,
      subject: input.subject,
      body: input.body,
      payload: input.payload ?? null,
      recipient_email: recipient,
      status: enabled && recipient ? "pending" : "skipped",
      error_message: enabled
        ? null
        : "Notifications are turned off in admin settings.",
    });
  } catch (err) {
    // Silent fail — we never want to block checkout/contact UX on notifications.
    console.error("queueNotification failed", err);
  }
}
