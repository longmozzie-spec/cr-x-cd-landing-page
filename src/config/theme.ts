/**
 * Tông màu theo từng slide — dùng chung cho DeckController (đổi --accent)
 * và BeamsBackground (đổi màu beam).
 * `accent`: mã màu accent hiển thị. `hue`: gốc màu HSL cho beam (0–360).
 */
export const BEAM_HUE_EVENT = "beam-hue";

export interface ThemeTone {
  accent: string;
  hue: number;
}

export const themeMap: Record<string, ThemeTone> = {
  red: { accent: "#ff2b2b", hue: 8 },
  dark: { accent: "#ff2b2b", hue: 8 },
  blue: { accent: "#2b8cff", hue: 210 },
  purple: { accent: "#8b5cff", hue: 265 },
  orange: { accent: "#ff9a22", hue: 32 },
  final: { accent: "#ff2b2b", hue: 8 },
};

export const DEFAULT_THEME: ThemeTone = themeMap.red;
