import React, { useState } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";

import DashboardLayout from "../layouts/Dashboard";
import { spacing, useTheme } from "@mui/system";

import {
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Typography as MuiTypography,
  Snackbar,
  Box,
  Fab,
  Card,
  Grid,
  CardContent as MuiCardContent,
  List,
  ListItem,
  ListItemText as MuiListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { green } from "@mui/material/colors";
import {
  faCopy,
  faLocationArrow,
  faPaperPlane,
  faPlay,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

// Code highlighting (importing only the minimum needed)
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  nightOwl as dark,
  coy as light,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import r from "react-syntax-highlighter/dist/cjs/languages/prism/r";
import julia from "react-syntax-highlighter/dist/cjs/languages/prism/julia";
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java";
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("r", r);
SyntaxHighlighter.registerLanguage("julia", julia);
SyntaxHighlighter.registerLanguage("java", java);

// API Docs. Note: swagger-ui-react is no longer actively maintained and uses
// outdated lifecycle methods (results in warnings).
// Replace with new API docs when available.
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "swagger-ui-themes/themes/3.x/theme-material.css";
import StyledSwaggerUI from "../components/pages/apis/SwaggerUI";

// Server-side translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export async function getStaticProps({ locale }) {
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

// Code examples
import * as PythonExamples from "../components/pages/apis/pythonCodeExamples";
import * as RExamples from "../components/pages/apis/rCodeExamples";
import * as JuliaExamples from "../components/pages/apis/juliaCodeExamples";
import * as JavaExamples from "../components/pages/apis/javaCodeExamples";

const Typography = styled(MuiTypography)(spacing);
const FixedIcon = styled(FontAwesomeIcon)`
  font-size: ${(props) => (props.sizept ? props.sizept : 15)}pt;
  left: ${(props) => props.l}px;
  top: ${(props) => props.t}px;
  margin-right: ${(props) => props.mr}px;
  color: ${(props) => props.color};
`;
const ApiTabs = styled(Tabs)`
  height: 61px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  border-top: 1px solid rgba(0, 0, 0, 0.12);
`;
const ApiTab = styled(Tab)`
  color: ${(props) => props.searchcolor} !important;
  font-size: 11pt;
  margin-top: 5px;
`;
const HeroTitle = styled(Typography)({
  textAlign: "center",
  lineHeight: "150%",
  padding: "2vw 5vw",
});
const CardContent = styled(MuiCardContent)`
  margin-top: 10px;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(8)};
  }
`;
const ListItemText = styled(MuiListItemText)`
  font-weight: "bold" !important;
`;

const docs = {
  Python: "https://openml.github.io/openml-python",
  R: "https://github.com/mlr-org/mlr3oml",
  Julia: "https://juliaai.github.io/OpenML.jl/stable/",
  Java: "https://docs.openml.org/Java-guide",
};

const colab_links = {
  Python:
    "https://colab.research.google.com/drive/1z5FvwxCz4AMQ67Vzd-AsSd8g5uRxnYDf?usp=sharing",
  R: "https://colab.research.google.com/drive/1d3etWoVg9DVGnDdlQIerB9E4tyY29gqZ?usp=sharing",
  Julia:
    "https://colab.research.google.com/drive/1IKO-U27WbV9H4kMiWWp0yxKtKpNiDZAd?usp=sharing",
};

const other_links = {
  RUST: "https://github.com/mbillingr/openml-rust",
  ".NET": "https://github.com/openml/openml-dotnet",
  "Command line": "https://github.com/nok/openml-cli",
};

const codeExamples = {
  Python: {
    Installation: PythonExamples.InstallationExample,
    "Query and download data": PythonExamples.DataExample,
    "Download tasks, run models locally, publish results (with scikit-learn)":
      PythonExamples.RunExample,
    "OpenML Benchmarks": PythonExamples.BenchmarkExample,
  },
  R: {
    Installation: RExamples.InstallationExample,
    "Query and download data": RExamples.DataExample,
    "Run an mlr3 model locally": RExamples.RunExample,
    "OpenML Benchmarks": RExamples.BenchmarkExample,
  },
  Julia: {
    Installation: JuliaExamples.InstallationExample,
    "Query and download data": JuliaExamples.DataExample,
  },
  Java: {
    Installation: JavaExamples.InstallationExample,
    "Query and download data": JavaExamples.DataExample,
    "Download tasks, run models locally, publish results (with WEKA)":
      JavaExamples.RunExample,
    "OpenML Benchmarks": JavaExamples.BenchmarkExample,
  },
};

function APIs() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  const [api, setApi] = useState("Python");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const codeTheme = theme.name === "DARK" ? dark : light;

  const CodeCard = (props) => {
    const { language, value, title, colab } = props;
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Card style={{ marginTop: 0, opacity: 0.9 }}>
          <CardContent>
            <SyntaxHighlighter
              language={language}
              style={codeTheme}
              customStyle={{ marginBottom: 0, paddingTop: -40 }}
            >
              {value}
            </SyntaxHighlighter>
          </CardContent>
        </Card>
        <Box mb={10} display="flex" justifyContent="right">
          {colab && (
            <Tooltip title="Run in Colab">
              <IconButton
                color="primary"
                onClick={() => window.open(colab, "_blank")}
                size="large"
              >
                <FixedIcon icon={faPlay} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Copy to clipboard">
            <IconButton
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(value);
                setOpen(true);
              }}
              size="large"
            >
              <FixedIcon icon={faCopy} />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    );
  };
  const code = (language) => {
    return Object.entries(codeExamples[language]).map(([title, example]) => {
      return (
        <CodeCard
          key={title}
          title={title}
          language={language.toLowerCase()}
          value={example}
          colab={colab_links[language]}
        />
      );
    });
  };
  const make_other = () => {
    return Object.entries(other_links).map(([title, link]) => {
      return (
        <ListItem button component="a" href={link} target="_blank" key={title}>
          <ListItemText primary={title} style={{ fontWeight: 900 }} />
        </ListItem>
      );
    });
  };
  Object.entries(other_links).map(([title, link]) => {
    return (
      <ListItem button component="a" href={link} target="_blank" key={title}>
        <ListItemText primary={title} />
      </ListItem>
    );
  });
  return (
    <React.Fragment>
      <Helmet title={t("apis.helmet")} />
      <ApiTabs
        value={api}
        onChange={(event) => setApi(event.target.textContent)}
        variant="scrollable"
        scrollButtons="auto"
        textColor="secondary"
        indicatorColor="secondary"
      >
        <ApiTab value="Python" label="Python" />
        <ApiTab value="R" label="R" />
        <ApiTab value="Julia" label="Julia" />
        <ApiTab value="Java" label="Java" />
        <ApiTab value="Others" label="Others" />
        <ApiTab value="REST" label="REST" />
      </ApiTabs>
      <Grid
        container
        spacing={6}
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ margin: 0, width: "100%" }}
      >
        {api === "REST" ? (
          <StyledSwaggerUI value="REST" theme={theme}>
            <SwaggerUI url="openml-api.json" />
          </StyledSwaggerUI>
        ) : api !== "Others" ? (
          <Grid item sm={10} xs={12}>
            <HeroTitle variant="h2" align="center" id="licences">
              {api} API
            </HeroTitle>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Fab
                variant="extended"
                color="secondary"
                target="_blank"
                href={docs[api]}
              >
                <FixedIcon
                  icon={faPaperPlane}
                  l="40"
                  t="40"
                  mr="10"
                  sizept="15"
                />
                Full Documentation
              </Fab>
            </Box>
            <CardContent>{code(api)}</CardContent>
            <Box
              pb={5}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              You are learning fast, young apprentice!
              {"\u00A0\u00A0"}
              <FixedIcon
                icon={faThumbsUp}
                size="2x"
                fixedWidth
                color={green[500]}
              />
              {"\u00A0\u00A0"}
              Still, there is so much more to see...
            </Box>
            <Box
              pb={15}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                size="small"
                variant="extended"
                color="secondary"
                target="_blank"
                href={docs[api]}
              >
                <FixedIcon
                  icon={faLocationArrow}
                  l="60"
                  t="40"
                  mr="10"
                  sizept="15"
                />
                See the complete guide
              </Fab>
            </Box>
          </Grid>
        ) : (
          <Grid item sm={10} xs={12}>
            <HeroTitle variant="h2" align="center" id="licences">
              Other APIs
            </HeroTitle>
            <Card style={{ marginTop: 0, opacity: 0.9 }}>
              <CardContent>
                These are all APIs developed and maintained independently by
                others. As such, we can't offer any guarantees, but hope they
                might be useful to you.
                <List component="nav">{make_other()}</List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={2000}
        message="Example code copied!"
        onClose={() => setOpen(false)}
      />
    </React.Fragment>
  );
}

APIs.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default APIs;
