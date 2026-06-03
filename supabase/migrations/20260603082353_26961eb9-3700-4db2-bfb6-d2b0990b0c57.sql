
-- 1. Reviews rating CHECK constraint
UPDATE public.reviews SET rating = LEAST(GREATEST(rating, 1), 5) WHERE rating < 1 OR rating > 5;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5);

-- 2. DELETE policy on reviews (GDPR right to erasure)
CREATE POLICY "Users can delete own reviews"
  ON public.reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Hide sensitive columns from unauthenticated users
-- Reviews: hide user_id / reservation_id from anon
REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT (id, restaurant_id, rating, text, created_at) ON public.reviews TO anon;

-- Restaurants: hide phone / manager_name from anon
REVOKE SELECT ON public.restaurants FROM anon;
GRANT SELECT (
  id, name, cuisine, address, city, photo, price_range, budget,
  food_type, ambiance, tags, terrasse, is_new, available_tables,
  opening_hours, rating, owner_id, distance, distance_minutes,
  created_at, updated_at
) ON public.restaurants TO anon;

-- 4. Prevent self-assigned ownership of restaurants via public creator page,
-- which would let any anon/authenticated user read other users' reservations
-- by setting owner_id = auth.uid().
DROP POLICY IF EXISTS "Public can insert restaurants via creator page" ON public.restaurants;
CREATE POLICY "Public can insert restaurants via creator page"
  ON public.restaurants
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (owner_id IS NULL);
