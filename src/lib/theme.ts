export const THEME_STORAGE_KEY = "agi-tracker-theme";

export type ThemeMode = "light" | "dark";

export const getThemeInitScript = () => `
(() => {
  const storageKey = "${THEME_STORAGE_KEY}";
  const root = document.documentElement;
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    const theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : getSystemTheme();

    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch (error) {
    const theme = getSystemTheme();
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }
})();
`.trim();
