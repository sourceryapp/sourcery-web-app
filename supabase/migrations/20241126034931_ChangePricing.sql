DROP FUNCTION IF EXISTS claim_request(input_request_id bigint, input_pricing pricing_enum);
CREATE OR REPLACE FUNCTION public.claim_request(input_request_id bigint)
RETURNS void LANGUAGE plpgsql security definer set search_path = 'public' AS $$
BEGIN
    UPDATE public.requests
    SET servicer_id = auth.uid(),
        servicer_claimed_at = NOW(),
        status = 'STATUS_PAID'::status_enum
    WHERE id = input_request_id
      AND servicer_id IS NULL
      AND status = 'STATUS_CREATED'
      AND public_can_claim = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_request(input_request_id bigint)
RETURNS void LANGUAGE plpgsql security definer set search_path = 'public' AS $$
BEGIN
    UPDATE public.requests
    SET servicer_id = NULL,
        servicer_claimed_at = NULL,
        status = 'STATUS_CREATED'::status_enum
    WHERE id = input_request_id
      AND servicer_id = auth.uid()
      AND status IN ('STATUS_UNPAID');
END;
$$;