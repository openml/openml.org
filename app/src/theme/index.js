import "@mui/lab/themeAugmentation";

import { createTheme as createMuiTheme } from "@mui/material/styles";
import variants from "./variants";
import typography from "./typography";
import breakpoints from "./breakpoints";
import components from "./components";
import shadows from "./shadows";

const createTheme = (name) => {
  let themeConfig = variants.find((variant) => variant.name === name);

  if (!themeConfig) {
    console.warn(new Error(`The theme ${name} is not valid`));
    themeConfig = variants[0];
  }

  const baseTheme = createMuiTheme({
    spacing: 4,
    breakpoints,
    components,
    typography,
    shadows,
    palette: themeConfig.palette,
  });

  return {
    ...baseTheme,
    name: themeConfig.name,
  };
};

export default createTheme;
