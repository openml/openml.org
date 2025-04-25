import React, { useEffect } from "react";

import { THEMES } from "../constants";

const initialState = {
  theme: THEMES.DEFAULT,
  setTheme: () => {},
};

const ThemeContext = React.createContext(initialState);

function ThemeProvider({ children }) {
  // 🔥 Instead of always defaulting to initialState.theme,
  // check if window exists to use localStorage
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        return JSON.parse(storedTheme);
      }
    }
    return initialState.theme;
  };

  const [theme, _setTheme] = React.useState(getInitialTheme); // ✅ initialized immediately

  useEffect(() => {
    // Optional: double-check after mount
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      _setTheme(JSON.parse(storedTheme));
    }
  }, []);

  const setTheme = (theme) => {
    localStorage.setItem("theme", JSON.stringify(theme));
    _setTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext };
