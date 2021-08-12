import { createTheme } from "@material-ui/core/styles";
import { blue, green, grey, red } from "@material-ui/core/colors";

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 2100
  }
};

const props = {
  MuiButtonBase: {
    disableRipple: true
  }
};

function createShadow(px) {
  return `0 0 ${px}px 0 rgba(53,64,82,.15)`;
}

const shadows = [
  "none",
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14),
  createShadow(14)
];

const typography = {
  useNextVariants: true,
  fontFamily: ["Lato", "Roboto", "Arial", "sans-serif"].join(","),
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 800,
  h1: {
    fontSize: "2rem",
    fontWeight: 600
  },
  h2: {
    fontSize: "1.75rem",
    fontWeight: 600
  },
  h3: {
    fontSize: "1.5rem",
    fontWeight: 600
  },
  h4: {
    fontSize: "1.25rem",
    fontWeight: 600
  },
  h5: {
    fontSize: "1.125rem",
    fontWeight: 600
  },
  h6: {
    fontSize: "1rem",
    fontWeight: 600
  },
  body1: {
    fontSize: 14
  },
  button: {
    textTransform: "none"
  }
};
const lightVariant = {
  name: "Light",
  palette: {
    primary: {
      main: blue[800],
      contrastText: "#FFF"
    },
    secondary: {
      main: blue[600],
      contrastText: "#FFF"
    }
  },
  header: {
    color: grey[200],
    background: blue[700],
    search: {
      color: "#FFF"
    },
    indicator: {
      background: red[700]
    }
  },
  sidebar: {
    color: grey[900],
    background: "#FFF",
    header: {
      color: "#FFF",
      background: "#FFF",
      brand: {
        color: "#FFFFFF"
      }
    },
    footer: {
      color: grey[900],
      background: grey[100],
      online: {
        background: green[500]
      }
    },
    badge: {
      color: "#FFF",
      background: green[600]
    }
  },
  body: {
    background: "#F9F9FC"
  }
};
const darkVariant = {
  name: "Dark",
  palette: {
    primary: {
      main: blue[700],
      contrastText: "#FFF"
    },
    secondary: {
      main: blue[600],
      contrastText: "#FFF"
    }
  },
  header: {
    color: grey[900],
    background: "#FFFFFF",
    search: {
      color: grey[800]
    },
    indicator: {
      background: red[600]
    }
  },
  sidebar: {
    color: grey[200],
    background: "#1B2430",
    header: {
      color: grey[200],
      background: "#1B2430",
      brand: {
        color: blue[500]
      }
    },
    footer: {
      color: grey[200],
      background: "#232f3e",
      online: {
        background: green[500]
      }
    },
    badge: {
      color: "#000",
      background: "#FFF"
    }
  },
  body: {
    background: "#F9F9FC"
  }
};

const variants = [darkVariant, lightVariant];

const theme = variant => {
  return createTheme(
    {
      spacing: 4,
      breakpoints: breakpoints,
      props: props,
      typography: typography,
      shadows: shadows,
      body: variant.body,
      header: variant.header,
      palette: variant.palette,
      sidebar: variant.sidebar
    },
    variant.name
  );
};

const themes = variants.map(variant => theme(variant));

export default themes;
