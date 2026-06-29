import { useSettings } from "@/hooks/use-settings";

export function ThemeStyles() {
  const { theme } = useSettings();
  // Override the design tokens defined in styles.css with admin-set values.
  const css = `:root{--paper:${theme.paper};--ink:${theme.ink};--ink-soft:${theme.inkSoft};--rule:${theme.ink};}
  body{background-color:${theme.paper};color:${theme.ink};}
  .text-ink-soft{color:${theme.inkSoft};}`;
  return <style>{css}</style>;
}
