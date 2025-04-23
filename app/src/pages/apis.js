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
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blue, green, purple } from "@mui/material/colors";
import {
  faCode,
  faCopy,
  faFileCode,
  faLocationArrow,
  faPaperPlane,
  faPlay,
  faTerminal,
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
import StyledSwaggerUI from "../components/apis/SwaggerUI";

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
import * as PythonExamples from "../components/apis/pythonCodeExamples";
import * as RExamples from "../components/apis/rCodeExamples";
import * as JuliaExamples from "../components/apis/juliaCodeExamples";
import * as JavaExamples from "../components/apis/javaCodeExamples";
import InfoCard from "../components/Card";
import { faRust } from "@fortawesome/free-brands-svg-icons";
import Wrapper from "../components/Wrapper";

const Typography = styled(MuiTypography)(spacing);
const FixedIcon = styled(FontAwesomeIcon)`
  font-size: ${(props) => (props.sizept ? props.sizept : 15)}pt;
  left: ${(props) => props.l}px;
  top: ${(props) => props.t}px;
  margin-left: ${(props) => props.ml}px;
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

const docs = {
  python: "https://openml.github.io/openml-python",
  r: "https://github.com/mlr-org/mlr3oml",
  julia: "https://juliaai.github.io/OpenML.jl/stable/",
  java: "https://docs.openml.org/Java-guide",
};

const colab_links = {
  python:
    "https://colab.research.google.com/drive/1z5FvwxCz4AMQ67Vzd-AsSd8g5uRxnYDf?usp=sharing",
  r: "https://colab.research.google.com/drive/1d3etWoVg9DVGnDdlQIerB9E4tyY29gqZ?usp=sharing",
  julia:
    "https://colab.research.google.com/drive/1IKO-U27WbV9H4kMiWWp0yxKtKpNiDZAd?usp=sharing",
};

const others = {
  id: "apis.others_card",
  icon: faCode,
  iconColor: blue[400],
  items: [
    {
      link: "https://github.com/mbillingr/openml-rust",
      icon: faRust,
      color: green[400],
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-dotnet",
      icon: faFileCode,
      color: purple[400],
      target: "_blank",
    },
    {
      link: "https://github.com/nok/openml-cli",
      icon: faTerminal,
      color: blue[400],
      target: "_blank",
    },
  ],
};

const examples = {
  python: PythonExamples,
  r: RExamples,
  julia: JuliaExamples,
  java: JavaExamples,
};

const sections = {
  python: ["installation", "data", "run", "benchmark"],
  r: ["installation", "data", "run", "benchmark"],
  julia: ["installation", "data"],
  java: ["installation", "data", "run", "benchmark"],
};

const CodeCard = (props) => {
  const { t } = useTranslation();
  const { language, section, colab, codeTheme, snackBarOpen } = props;
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {t(`apis.code_examples.${language}.${section}`)}
      </Typography>
      <Card style={{ marginTop: 0, opacity: 0.9 }}>
        <CardContent>
          <SyntaxHighlighter
            language={language}
            style={codeTheme}
            customStyle={{ marginBottom: 0, paddingTop: -40 }}
          >
            {examples[language][section]}
          </SyntaxHighlighter>
        </CardContent>
      </Card>
      <Box mb={10} display="flex" justifyContent="right">
        {colab && (
          <Tooltip title={t("apis.tooltip.colab")}>
            <IconButton
              color="primary"
              onClick={() => window.open(colab, "_blank")}
              size="large"
            >
              <FixedIcon icon={faPlay} mr="3" ml="3" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={t("apis.tooltip.copy")}>
          <IconButton
            color="primary"
            onClick={() => {
              navigator.clipboard.writeText(examples[language][section]);
              snackBarOpen(true);
            }}
            size="large"
          >
            <FixedIcon icon={faCopy} mr="3" ml="3" />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

const CenteredBox = ({ children, ...props }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" {...props}>
      {children}
    </Box>
  );
};
const DocButton = ({ children, href, ...props }) => {
  return (
    <Fab
      variant="extended"
      color="secondary"
      target="_blank"
      href={href}
      {...props}
    >
      {children}
    </Fab>
  );
};

function APIs() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  const [api, setApi] = useState("python");
  const [open, setOpen] = React.useState(false); // Snackbar
  const theme = useTheme();
  const codeTheme = theme.name === "DARK" ? dark : light;

  const buildCodeExamples = (language) => {
    return sections[language].map((section) => {
      return (
        <CodeCard
          key={section}
          language={language}
          section={section}
          codeTheme={codeTheme}
          colab={colab_links[language]}
          snackBarOpen={setOpen}
        />
      );
    });
  };

  return (
    <React.Fragment>
      <Helmet title={t("apis.helmet")} />
      <ApiTabs
        value={api}
        onChange={(event, newValue) => setApi(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        textColor="secondary"
        indicatorColor="secondary"
      >
        <ApiTab value="python" label={t("apis.tabs.python")} />
        <ApiTab value="r" label={t("apis.tabs.r")} />
        <ApiTab value="julia" label={t("apis.tabs.julia")} />
        <ApiTab value="java" label={t("apis.tabs.java")} />
        <ApiTab value="others" label={t("apis.tabs.others")} />
        <ApiTab value="rest" label={t("apis.tabs.rest")} />
      </ApiTabs>
      <Wrapper>
        {api === "rest" ? (
          <StyledSwaggerUI value="REST" theme={theme}>
            <SwaggerUI url="openml-api.json" />
          </StyledSwaggerUI>
        ) : api !== "others" ? (
          <Grid>
            <HeroTitle variant="h2" align="center" id="licences">
              {t(`apis.tabs.${api}`)} {t("apis.api")}
            </HeroTitle>
            <CenteredBox pb={15}>
              <DocButton href={docs[api]}>
                <FixedIcon icon={faPaperPlane} mr="10" />
                {t("apis.docs_link")}
              </DocButton>
            </CenteredBox>
            {buildCodeExamples(api)}
            <CenteredBox pb={5}>
              {t("apis.outro_1")}
              <FixedIcon icon={faThumbsUp} mr="10" ml="10" color={green[500]} />
              {t("apis.outro_2")}
            </CenteredBox>
            <CenteredBox pb={15}>
              <DocButton href={docs[api]}>
                <FixedIcon icon={faLocationArrow} mr="10" />
                {t("apis.guide_link")}
              </DocButton>
            </CenteredBox>
          </Grid>
        ) : (
          <Grid>
            <HeroTitle variant="h2" align="center" id="licences">
              {t("apis.others_header")}
            </HeroTitle>
            <InfoCard info={others} />
          </Grid>
        )}
      </Wrapper>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={2000}
        message={t("apis.copied")}
        onClose={() => setOpen(false)}
      />
    </React.Fragment>
  );
}

APIs.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default APIs;
