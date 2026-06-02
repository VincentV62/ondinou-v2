GRANT SELECT ON public.reservations TO anon;

CREATE POLICY "Public can view demo restaurant reservations"
ON public.reservations
FOR SELECT
TO anon, authenticated
USING (restaurant_id = '640a8739-fff8-4200-8b40-d9302c807f8b'::uuid);