DROP POLICY "Active products are viewable by everyone" ON public.products;
CREATE POLICY "Active products are viewable by everyone" ON public.products FOR SELECT USING (is_active);

DROP POLICY "Approved reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Approved reviews are viewable by everyone" ON public.reviews FOR SELECT USING (is_approved);

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;