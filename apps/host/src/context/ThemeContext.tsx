import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
type EffectiveTheme = "light" | "dark";

interface ThemeContextValue {
	preference: ThemePreference;
	theme: EffectiveTheme;
	setPreference: (preference: ThemePreference) => void;
}

const STORAGE_KEY = "cybsec-theme-preference";

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemTheme = (): EffectiveTheme => {
	if (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		return "dark";
	}

	return "light";
};

const getInitialPreference = (): ThemePreference => {
	if (typeof window === "undefined") return "system";

	const stored = localStorage.getItem(STORAGE_KEY);

	if (stored === "light" || stored === "dark" || stored === "system") {
		return stored;
	}

	return "system";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [preference, setPreferenceState] =
		useState<ThemePreference>(getInitialPreference);

	const [systemTheme, setSystemTheme] =
		useState<EffectiveTheme>(getSystemTheme);

	const theme: EffectiveTheme =
		preference === "system" ? systemTheme : preference;

	const setPreference = useCallback((next: ThemePreference) => {
		setPreferenceState(next);
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (event: MediaQueryListEvent) => {
			setSystemTheme(event.matches ? "dark" : "light");
		};

		setSystemTheme(mediaQuery.matches ? "dark" : "light");
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		document.documentElement.style.colorScheme = theme;
		localStorage.setItem(STORAGE_KEY, preference);
	}, [theme, preference]);

	return (
		<ThemeContext.Provider value={{ preference, theme, setPreference }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextValue => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used inside ThemeProvider");
	}

	return context;
};
