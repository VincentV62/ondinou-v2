CREATE POLICY "Public can insert restaurants via creator page"
ON public.restaurants
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

GRANT INSERT ON public.restaurants TO anon;