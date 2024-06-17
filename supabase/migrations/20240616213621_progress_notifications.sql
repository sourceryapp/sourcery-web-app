-- Create a function to run after a request has been picked up.
CREATE OR REPLACE FUNCTION public.notification_request_changed_status() RETURNS trigger AS $$
DECLARE
  organization_user_id uuid;
  notification_json json;
BEGIN
    notification_json = jsonb_build_object(
        'request', new
    );

    organization_user_id = (
        SELECT id
        FROM public.user
        WHERE id = (
            SELECT owner_id
            FROM public.organizations
            WHERE id = (
                SELECT organization_id
                FROM public.repositories
                WHERE id = new.repository_id
            )
        )
    );

    if new.status_id = 2 then
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (new.user_id, 'Request Picked Up', 'request_picked_up', notification_json);
    ELSIF new.status_id = 3 then
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (new.user_id, 'Request Completed', 'request_completed', notification_json);
    ELSIF new.status_id = 5 then
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (new.user_id, 'Request Cancelled', 'request_cancelled', notification_json);
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (organization_user_id, 'Request Cancelled', 'request_cancelled', notification_json);
    END IF;

    return new;
END;
$$ LANGUAGE plpgsql security definer;

-- Create a trigger to run the notification_new_message function after a request comment (chat message) is created.
drop trigger if exists create_notification_on_request_change_status on public.requests;
create trigger create_notification_on_request_change_status
  after update of status_id on public.requests
  for each row execute procedure public.notification_request_changed_status();