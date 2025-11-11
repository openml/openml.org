import React from "react";
import { Provider } from "react-redux";
import { CacheProvider } from "@emotion/react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { appWithTranslation } from "next-i18next";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import "chart.js/auto";

// Note: Remove the following line if you want to disable the API mocks.
import "../mocks";

// TailwindCSS global styles
import "../styles/globals.css";

import "../vendor/perfect-scrollbar.css";

import createTheme from "../theme";

import { ThemeProvider as CustomThemeProvider } from "../contexts/ThemeContext"; // renamed to avoid confusion
import useTheme from "../hooks/useTheme";
import { store } from "../redux/store";
import createEmotionCache from "../utils/createEmotionCache";

import { AuthProvider } from "../contexts/JWTContext";
// import { AuthProvider } from "../contexts/Auth0Context";

const clientSideEmotionCache = createEmotionCache();

function App({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CustomThemeProvider>
            <ThemeConsumerWrapper
              Component={Component}
              pageProps={pageProps}
              getLayout={getLayout}
            />
          </CustomThemeProvider>
        </LocalizationProvider>
      </Provider>
    </CacheProvider>
  );
}

// This wrapper is used to provide the theme to the components so it can be updated dynamically
function ThemeConsumerWrapper({ Component, pageProps, getLayout }) {
  const { theme } = useTheme();
  const muiTheme = createTheme(theme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
    </MuiThemeProvider>
  );
}

export default appWithTranslation(App);
