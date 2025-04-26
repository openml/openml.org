import merge from "deepmerge";
import {
  green,
  yellow,
  orange,
  purple,
  pink,
  blue,
  grey,
  indigo,
  red,
  lightBlue,
  deepPurple,
} from "@mui/material/colors";
import {
  faDatabase,
  faHandHoldingHeart,
  faRss,
  faFlag,
  faCog,
  faFlask,
  faChartColumn,
  faTachometerAlt,
  faCampground,
  faUsers,
  faScaleBalanced,
  faUser,
  faLayerGroup,
  faCircleUser,
  faRocket,
  faBookOpenReader,
} from "@fortawesome/free-solid-svg-icons";

const customBlue = {
  50: "#e9f0fb",
  100: "#c8daf4",
  200: "#a3c1ed",
  300: "#7ea8e5",
  400: "#6395e0",
  500: "#4782da",
  600: "#407ad6",
  700: "#376fd0",
  800: "#2f65cb",
  900: "#2052c2 ",
};

const openmlColors = {
  d: green[400],
  t: yellow[800],
  f: customBlue[800],
  r: red[400],
  data: green[400],
  task: yellow[800],
  flow: customBlue[800],
  run: red[400],
  collections: pink[400],
  benchmarks: purple[400],
  tasktypes: orange[400],
  measures: deepPurple[400],
  docs: green[400],
  blog: blue[800],
  apis: red[400],
  contribute: purple[400],
  meet: yellow[800],
  about: green[400],
  terms: blue[400],
  auth: lightBlue[500],
};

const openmlIcons = {
  d: faDatabase,
  t: faFlag,
  f: faCog,
  r: faFlask,
  data: faDatabase,
  task: faFlag,
  flow: faCog,
  run: faFlask,
  user: faCircleUser,
  collections: faLayerGroup,
  benchmarks: faChartColumn,
  tasktypes: faFlag,
  measures: faTachometerAlt,
  docs: faBookOpenReader,
  blog: faRss,
  apis: faRocket,
  contribute: faHandHoldingHeart,
  meet: faCampground,
  about: faUsers,
  terms: faScaleBalanced,
  auth: faUser,
};

const defaultVariant = {
  name: "DEFAULT",
  palette: {
    mode: "light",
    primary: {
      main: customBlue[700],
      contrastText: "#FFF",
    },
    secondary: {
      main: customBlue[500],
      contrastText: "#FFF",
    },
    background: {
      default: "#F7F9FC",
      paper: "#FFF",
    },
    entity: openmlColors,
    icon: openmlIcons,
    header: {
      color: grey[700],
      background: "#FFF",
      search: {
        color: grey[800],
      },
      indicator: {
        background: customBlue[600],
      },
    },
    footer: {
      color: grey[500],
      background: "#FFF",
    },
    sidebar: {
      color: grey[200],
      background: "#233044",
      header: {
        color: grey[200],
        background: "#233044",
        brand: {
          color: "rgba(0, 0, 0, 0.5)",
        },
      },
      footer: {
        color: grey[200],
        background: "#1E2A38",
        online: {
          background: green[500],
        },
      },
      badge: {
        color: grey[200],
        background: "#233044",
      },
    },
  },
};

const darkVariant = merge(defaultVariant, {
  name: "DARK",
  palette: {
    mode: "dark",
    primary: {
      main: customBlue[600],
      contrastText: "#FFF",
    },
    background: {
      default: "#1B2635",
      paper: "#233044",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.95)",
      secondary: "rgba(255, 255, 255, 0.5)",
    },
    entity: openmlColors,
    icon: openmlIcons,
    sidebar: {
      header: {
        brand: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
    },
    header: {
      color: grey[300],
      background: "#1B2635",
      search: {
        color: grey[200],
      },
    },
    footer: {
      color: grey[300],
      background: "#233044",
    },
  },
});

const lightVariant = merge(defaultVariant, {
  name: "LIGHT",
  palette: {
    mode: "light",
    entity: openmlColors,
    icon: openmlIcons,
    header: {
      color: grey[200],
      background: customBlue[800],
      search: {
        color: grey[100],
      },
      indicator: {
        background: red[700],
      },
    },
    sidebar: {
      color: grey[900],
      background: "#FFF",
      header: {
        color: "#FFF",
        background: customBlue[800],
        brand: {
          color: "#FFFFFF",
        },
      },
      footer: {
        color: grey[800],
        background: "#F7F7F7",
        online: {
          background: green[500],
        },
      },
      badge: {
        color: grey[900],
        background: "#FFF",
      },
    },
  },
});

const indigoVariant = merge(defaultVariant, {
  name: "INDIGO",
  palette: {
    primary: {
      main: indigo[600],
      contrastText: "#FFF",
    },
    secondary: {
      main: indigo[400],
      contrastText: "#FFF",
    },
    entity: openmlColors,
    icon: openmlIcons,
    header: {
      indicator: {
        background: indigo[600],
      },
    },
    sidebar: {
      color: "#FFF",
      background: indigo[700],
      header: {
        color: "#FFF",
        background: indigo[800],
        brand: {
          color: "rgba(0, 0, 0, 0.5)",
        },
      },
      footer: {
        color: "#FFF",
        background: indigo[800],
        online: {
          background: "#FFF",
        },
      },
      badge: {
        color: "#FFF",
        background: indigo[700],
      },
    },
  },
});

const variants = [defaultVariant, darkVariant, lightVariant, indigoVariant];

export default variants;
