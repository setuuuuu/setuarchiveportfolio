import { useQuery } from "@tanstack/react-query";
import { DEFAULT_SETTINGS, fetchSettings, type SiteSettings } from "@/lib/settings-api";

export function useSettings(): SiteSettings {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSettings,
    staleTime: 60_000,
  });
  return data ?? DEFAULT_SETTINGS;
}
