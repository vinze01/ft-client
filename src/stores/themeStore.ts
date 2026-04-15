import { defineStore } from "pinia";

interface ThemeState {
  isDark: boolean;
  accentColor: string;
}

const DEFAULT_ACCENT = "#6366f1";
const PRESET_COLORS = [
  "#6366f1", // Indigo (default)
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#0ea5e9", // Sky
  "#3b82f6", // Blue
];

export const useThemeStore = defineStore("theme", {
  state: (): ThemeState => {
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    const savedAccent = localStorage.getItem("accentColor");
    const accentColor = savedAccent || DEFAULT_ACCENT;
    return { isDark, accentColor };
  },
  getters: {
    presetColors: () => PRESET_COLORS,
    defaultAccent: () => DEFAULT_ACCENT,
  },
  actions: {
    toggle() {
      this.isDark = !this.isDark;
      this.apply();
    },
    setAccentColor(color: string) {
      this.accentColor = color;
      this.apply();
    },
    resetAccentColor() {
      this.accentColor = DEFAULT_ACCENT;
      this.apply();
    },
    apply() {
      localStorage.setItem("theme", this.isDark ? "dark" : "light");
      localStorage.setItem("accentColor", this.accentColor);

      if (this.isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      document.documentElement.style.setProperty(
        "--accent-color",
        this.accentColor,
      );
      this.applyAccentColors();
    },
    applyAccentColors() {
      const root = document.documentElement;
      const hex = this.accentColor;

      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      root.style.setProperty("--accent-r", String(r));
      root.style.setProperty("--accent-g", String(g));
      root.style.setProperty("--accent-b", String(b));

      root.style.setProperty("--accent-50", `rgba(${r}, ${g}, ${b}, 0.1)`);
      root.style.setProperty("--accent-100", `rgba(${r}, ${g}, ${b}, 0.2)`);
      root.style.setProperty("--accent-200", `rgba(${r}, ${g}, ${b}, 0.3)`);
      root.style.setProperty("--accent-400", `rgba(${r}, ${g}, ${b}, 0.5)`);
      root.style.setProperty("--accent-500", `rgba(${r}, ${g}, ${b}, 0.6)`);
      root.style.setProperty("--accent-600", `rgba(${r}, ${g}, ${b}, 0.7)`);
      root.style.setProperty("--accent-700", `rgba(${r}, ${g}, ${b}, 0.8)`);
      root.style.setProperty("--accent-900", `rgba(${r}, ${g}, ${b}, 0.9)`);
    },
    init() {
      this.apply();
    },
  },
});
