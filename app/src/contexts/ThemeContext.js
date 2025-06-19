import React, { useEffect, useState } from "react";

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
      _setTheme(JSON.parse(storedTheme));
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
