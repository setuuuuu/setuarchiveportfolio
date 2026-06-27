
CREATE POLICY "public read work" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'work');
CREATE POLICY "admin upload work" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'work' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update work" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'work' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete work" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'work' AND public.has_role(auth.uid(), 'admin'));
