
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER touch_site_settings BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed defaults
INSERT INTO public.site_settings (key, value) VALUES
  ('site', '{"name":"Studio / Name","tagline":"Graphic designer · Typography, cover art & print"}'),
  ('home', '{"eyebrow":"Portfolio · 2026","headline":"Quiet design.\nLoud ideas.","intro":"Independent graphic designer working in typography, cover art, and print. Selected projects below.","featuredLabel":"Selected work"}'),
  ('about', '{"heading":"About","body":"I''m a graphic designer focused on typography, cover art, and editorial print. I work with musicians, publishers and independent brands to make calm, considered work with strong ideas at the center.","sideNote":"Available for select projects."}'),
  ('contact', '{"heading":"Contact","intro":"Tell me about your project. Short notes welcome.","email":"hello@example.com","location":"Available worldwide"}'),
  ('footer', '{"line":"© 2026 — Studio / Name. All rights reserved."}'),
  ('theme', '{"paper":"#f5f3ee","ink":"#0d0d0d","inkSoft":"#5b5b5b","accent":"#0d0d0d"}')
ON CONFLICT (key) DO NOTHING;

-- Public read policy on uploaded files so signed/public URLs in the work bucket resolve
CREATE POLICY "public read work bucket"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'work');

CREATE POLICY "admins write work bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'work' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update work bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'work' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete work bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'work' AND public.has_role(auth.uid(), 'admin'));
