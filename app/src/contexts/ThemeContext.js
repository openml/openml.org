import React, { useEffect, useState } from "react";
import variants from "../theme/variants";

// Create THEMES constant from variants
const THEMES = variants.reduce((acc, variant) => {
  acc[variant.name] = variant.name;
  return acc;
}, {});

const initialState = {
  theme: "DEFAULT",
  setTheme: () => {},
};

const ThemeContext = React.createContext(initialState);

function ThemeProvider({ children }) {
  const [theme, _setTheme] = useState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      try {
        _setTheme(JSON.parse(storedTheme));
      } catch (error) {
        console.warn(
          "Invalid theme data in localStorage, using default theme:",
          error,
        );
        localStorage.removeItem("theme");
        _setTheme(THEMES.DEFAULT);
      }
    } else {
      _setTheme(THEMES.DEFAULT);
    }
    setReady(true);
  }, []);

  const setTheme = (theme) => {
    localStorage.setItem("theme", JSON.stringify(theme));
    _setTheme(theme);
  };

  if (!ready) {
    // Prevent rendering until theme is loaded
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext };
