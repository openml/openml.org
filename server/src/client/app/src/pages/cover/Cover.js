import React from "react";
import styled from "styled-components";
import { spacing } from "@material-ui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { green, red, blue, amber, purple } from "@material-ui/core/colors";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Link } from "react-router-dom";

import { Icon } from "@iconify/react";
import tensorflowIcon from "@iconify/icons-logos/tensorflow";
import pythonIcon from "@iconify/icons-logos/python";
import rLang from "@iconify/icons-logos/r-lang";
import javaIcon from "@iconify/icons-logos/java";
import cSharp from "@iconify/icons-logos/c-sharp";
import pytorchIcon from "@iconify/icons-logos/pytorch";
import jupyterIcon from "@iconify/icons-logos/jupyter";

import {
  Grid,
  Card,
  CardContent as MuiCardContent,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
  Container,
  FormControl,
  InputBase,
  MenuItem,
  Select,
  Button,
  Link as MuiLink,
  CardMedia,
  CardActionArea,
  CardActions
} from "@material-ui/core";
import { MainContext } from "../../App.js";
import { ContactChipFull } from "../docs/GetInvolved.js";

const ListItemText = styled(MuiListItemText)`
  .MuiTypography-root {
    font-size: 1.1em;
  }
`;

const CardContent = styled(MuiCardContent)`
  margin-top: 10px;

  &:last-child {
    padding-bottom: ${props => props.theme.spacing(8)}px;
  }
`;

const Paragraph = styled(Typography)({
  paddingBottom: "2vw",
  fontSize: "1.1em"
});

const ListIcon = styled(FontAwesomeIcon)({
  marginRight: 10,
  fontWeight: 800
});

const OpenMLTitle = styled.div`
  height: auto;
  color: white;
  font-weight: 400;
  font-size: 3em;
`;

const OpenMLSubTitle = styled.div`
  height: auto;
  color: white;
  font-weight: 400;
  font-size: 2em;
`;

const OpenMLSubSubTitle = styled.div`
  height: auto;
  color: white;
  padding-top: 35px;
  font-size: 1.2em;
`;

const WhiteText = styled.div`
  height: auto;
  display: inline-block;
  color: white;
  padding-top: 10px;
  padding-bottom: 5px;
  font-size: 1.2em;
  margin-left: 10px;

  > a {
    color: white;
    padding-left: 10px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-size: 1.2em;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
    color: black;
  }
`;

const MoreLink = styled(Link)`
  text-decoration: none;
  color: ${blue[700]};
  margin-top: 10px;
  margin-bottom: 10px;
  display: block;
  font-weight: 700;

  &:focus,
  &:hover,
  &:active {
    text-decoration: underline;
  }
`;

const QuickLink = styled(Link)`
  text-decoration: none;
  color: ${blue[700]};
  margin-right: 10px;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 5px;
  &:focus,
  &:hover,
  &:active {
    text-decoration: underline;
  }
`;

const MoreLinkExternal = styled(MuiLink)`
  text-decoration: none;
  color: ${blue[400]};
  margin-top: 10px;
  margin-bottom: 10px;
  display: block;
  font-weight: 700;

  &:focus,
  &:hover,
  &:active {
    text-decoration: underline;
  }
`;

const WhiteButton = styled(Button)`
  display: inline-block;
  color: #fff;
  border-color: #fff;
`;

const CoverTitle = styled(Typography)`
  ${spacing}
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding-top: 80px;
  padding-bottom: 10px;
`;
const CoverSubTitle = styled(Typography)`
  ${spacing}
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-size: 1.2em;
  padding-bottom: 10px;
`;
const FixedIcon = styled(FontAwesomeIcon)`
  position: absolute;
  font-size: ${props => (props.sizept ? props.sizept : 20)}pt;
  left: ${props => props.l}px;
  top: ${props => props.t}px;
`;
const GreenFixedIcon = styled(FixedIcon)`
  color: ${green[400]};
`;
const LightGreenFixedIcon = styled(FixedIcon)`
  color: ${green[50]};
`;
const WhiteFixedIcon = styled(FixedIcon)`
  color: #fff;
`;
const RedFixedIcon = styled(FixedIcon)`
  color: ${red[400]};
`;
const LightRedFixedIcon = styled(FixedIcon)`
  color: ${red[50]};
`;
const BlueFixedIcon = styled(FixedIcon)`
  color: ${blue[400]};
`;
const LightBlueFixedIcon = styled(FixedIcon)`
  color: ${blue[50]};
`;
const AmberFixedIcon = styled(FixedIcon)`
  color: ${amber[500]};
`;
const PurpleFixedIcon = styled(FixedIcon)`
  color: ${purple[500]};
`;
const GreenIcon = styled(FontAwesomeIcon)`
  color: ${green[400]};
`;
const RedIcon = styled(FontAwesomeIcon)`
  color: ${red[400]};
`;
const BlueIcon = styled(FontAwesomeIcon)`
  color: ${blue[400]};
`;
const AmberIcon = styled(FontAwesomeIcon)`
  color: ${amber[500]};
`;
const PurpleIcon = styled(FontAwesomeIcon)`
  color: ${purple[500]};
`;

const CoverInput = styled(InputBase)`
  width: 75%;
  border-radius: 4px;
  background-color: #fff;
  padding: 3px;
  padding-left: 15px;
  font-size: 1.2em;
  display: flex-inline;

  .input: {
    margin-left: 20;
    flex: 1;
  }
  .MuiInputBase-input {
    background: linear-gradient(to right, #5a70cd 0%, #b0a972 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    &::placeholder {
      background: linear-gradient(to right, #5a70cd 0%, #8ac788 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      opacity: 0.9;
      width: 100px;
    }
  }
`;

const CustomInput = styled(InputBase)`
  border-radius: 4px;
  background-color: #fff;
  padding-top: 4px;
  padding-bottom: 3px;
  padding-left: 15px;
  margin-left: -7px;

  .input: {
    border-radius: 4;
    position: "relative";
    background-color: #fff;
    border: "1px solid #ced4da";
    fontsize: 16;
    padding: "10px 26px 10px 12px";
    margin-left: 20;
    flex: 1;
  }
`;

function IntroGraph() {
  return (
    <div style={{ paddingLeft: 30 }}>
      <div
        style={{
          position: "relative",
          margin: "auto"
        }}
      >
        <svg
          style={{
            minHeight: 250,
            minWidth: 350
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="7"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
              fill="white"
            >
              <polygon points="0 0, 6 3, 0 6" />
            </marker>
          </defs>
          <path
            d="M 40 160 C 40 60, 120 30, 130 30"
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 240 30 C 300 30, 340 100, 340 150"
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 300 180 C 250 180, 190 130, 190 80"
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            markerEnd="url(#arrowhead)"
          />
          <rect
            x="60"
            y="150"
            rx="16"
            ry="20"
            width="160"
            height="32"
            stroke="#2979ff"
            fill="#2979ff"
          />
          <text x="70" y="170" fill="white">
            I shared a new data set
          </text>
          <rect
            x="150"
            y="190"
            rx="16"
            ry="20"
            width="160"
            height="32"
            stroke="#2979ff"
            fill="#2979ff"
          />
          <text x="160" y="210" fill="white">
            I found a better model!
          </text>
          <text x="160" y="62" fill="white">
            OpenML
          </text>
        </svg>

        <WhiteFixedIcon icon="desktop" l="0" t="170" sizept="45" />
        <WhiteFixedIcon icon="laptop" l="300" t="170" sizept="45" />
        <WhiteFixedIcon icon="brain" l="160" t="0" sizept="35" />
        <LightGreenFixedIcon icon="database" l="40" t="40" sizept="20" />
        <LightGreenFixedIcon icon="database" l="320" t="40" sizept="20" />
        <LightBlueFixedIcon icon="cog" l="200" t="80" sizept="20" />
        <LightRedFixedIcon icon="flask" l="225" t="110" sizept="20" />
      </div>
    </div>
  );
}

function OpenMLGraph() {
  return (
    <div
      style={{
        position: "relative",
        margin: "auto",
        marginTop: 40,
        width: 345,
        height: 250
      }}
    >
      <GreenFixedIcon icon="database" l="0" t="50" />
      <GreenFixedIcon icon="database" l="0" t="90" />
      <GreenFixedIcon icon="database" l="0" t="130" />
      <AmberFixedIcon icon="flag" l="90" t="50" />
      <AmberFixedIcon icon="flag" l="90" t="90" />
      <AmberFixedIcon icon="flag" l="90" t="130" />
      <AmberFixedIcon icon="flag" l="90" t="170" />
      <RedFixedIcon icon="flask" l="180" t="10" />
      <RedFixedIcon icon="flask" l="180" t="50" />
      <RedFixedIcon icon="flask" l="180" t="90" />
      <RedFixedIcon icon="flask" l="180" t="130" />
      <RedFixedIcon icon="flask" l="180" t="170" />
      <RedFixedIcon icon="flask" l="180" t="210" />
      <BlueFixedIcon icon="cog" l="270" t="50" />
      <BlueFixedIcon icon="cog" l="270" t="90" />
      <BlueFixedIcon icon="cog" l="270" t="130" />
      <BlueFixedIcon icon="cog" l="270" t="170" />
      <svg style={{ minHeight: 250 }}>
        <line
          x1="35"
          y1="65"
          x2="80"
          y2="65"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="35"
          y1="105"
          x2="80"
          y2="105"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="35"
          y1="145"
          x2="80"
          y2="145"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="35"
          y1="145"
          x2="80"
          y2="185"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="125"
          y1="65"
          x2="170"
          y2="25"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="125"
          y1="65"
          x2="170"
          y2="65"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="125"
          y1="105"
          x2="170"
          y2="105"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="125"
          y1="145"
          x2="170"
          y2="145"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="125"
          y1="145"
          x2="170"
          y2="185"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="125"
          y1="185"
          x2="170"
          y2="225"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="215"
          y1="25"
          x2="265"
          y2="65"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="215"
          y1="105"
          x2="265"
          y2="65"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="215"
          y1="65"
          x2="265"
          y2="105"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="215"
          y1="145"
          x2="265"
          y2="105"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="215"
          y1="185"
          x2="265"
          y2="145"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
        <line
          x1="215"
          y1="225"
          x2="265"
          y2="185"
          style={{ stroke: "grey", strokeWidth: 1.5 }}
        />
      </svg>
    </div>
  );
}

function ReproGraph() {
  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          position: "relative",
          margin: "auto",
          width: 345,
          height: 180,
          marginTop: 60
        }}
      >
        <PurpleFixedIcon icon="cogs" sizept="20" l="20" t="10" />
        <BlueFixedIcon icon="cog" sizept="20" l="100" t="10" />
        <BlueFixedIcon icon="cog" sizept="20" l="100" t="50" />
        <AmberFixedIcon icon="flag" sizept="20" l="65" t="50" />
        <RedFixedIcon icon="flask" sizept="20" l="160" t="50" />
        <BlueFixedIcon icon="cog" sizept="20" l="220" t="50" />
        <AmberFixedIcon icon="flag" sizept="20" l="255" t="50" />
        <BlueFixedIcon icon="cog" sizept="20" l="220" t="90" />
        <PurpleFixedIcon icon="cogs" sizept="20" l="300" t="90" />

        <svg style={{ minWidth: 345, minHeight: 150 }}>
          <defs>
            <marker
              id="black-arrow"
              viewBox="0 0 10 10"
              refX="0"
              refY="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <line
            x1="60"
            y1="25"
            x2="90"
            y2="25"
            markerEnd="url(#black-arrow)"
            style={{ stroke: "grey", strokeWidth: 1.5 }}
          />
          <text x="65" y="20" fontSize="8pt">
            wrap
          </text>
          <line
            x1="130"
            y1="62"
            x2="150"
            y2="62"
            markerEnd="url(#black-arrow)"
            style={{ stroke: "grey", strokeWidth: 1.5 }}
          />
          <line
            x1="190"
            y1="62"
            x2="210"
            y2="62"
            markerEnd="url(#black-arrow)"
            style={{ stroke: "grey", strokeWidth: 1.5 }}
          />
          <line
            x1="255"
            y1="102"
            x2="285"
            y2="102"
            markerEnd="url(#black-arrow)"
            style={{ stroke: "grey", strokeWidth: 1.5 }}
          />
          <text x="255" y="97" fontSize="8pt">
            rebuild
          </text>
          <text x="40" y="140">
            original run
          </text>
          <text x="230" y="140">
            reproduced run
          </text>
        </svg>
      </div>
    </div>
  );
}

const CodeCard = props => {
  const { language, value, title } = props;
  return (
    <Card style={{ marginTop: 10, opacity: 0.9 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <SyntaxHighlighter
          language={language}
          style={coy}
          customStyle={{ marginLeft: -60, marginTop: 0, marginBottom: -30 }}
        >
          {value}
        </SyntaxHighlighter>
      </CardContent>
    </Card>
  );
};

const pythonExample = `
        from sklearn import ensemble
        from openml import tasks, runs

        clf = ensemble.RandomForestClassifier()
        task = tasks.get_task(3954)
        run = runs.run_model_on_task(clf, task)
        run.publish()
      `;

const rExample = `
        library(mlr)
        library(OpenML)

        lrn = makeLearner("classif.randomForest")
        task = getOMLTask(3954)
        run = runTaskMlr(task, lrn)
        uploadOMLRun(run)
      `;

class Cover extends React.Component {
  render() {
    return (
      <MainContext.Consumer>
        {context => (
          <Container maxWidth="md">
            <Grid
              container
              spacing={10}
              style={{ height: "500", paddingTop: 50, marginBottom: 70 }}
            >
              <Grid item xs={12} md={6}>
                <OpenMLTitle>OpenML</OpenMLTitle>
                <OpenMLSubTitle>
                  A worldwide machine learning lab
                </OpenMLSubTitle>
                <OpenMLSubSubTitle>
                  Machine learning research should be easily accessible and
                  reusable. OpenML is an open platform for sharing datasets,
                  algorithms, and experiments - to learn how to learn better,
                  together.
                </OpenMLSubSubTitle>
              </Grid>
              <Grid item xs={12} md={6}>
                <IntroGraph />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 20 }}>
                <FormControl style={{ display: "inline" }}>
                  <CoverInput
                    placeholder="Search OpenML"
                    onKeyPress={event => {
                      if (event.charCode === 13) {
                        event.preventDefault();
                        context.setQuery(event.target.value);
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <Select
                    id="type-select"
                    value={context.type ? context.type : "data"}
                    input={<CustomInput />}
                    onChange={event => {
                      context.setType(event.target.value);
                    }}
                  >
                    <MenuItem value={"data"}>Datasets</MenuItem>
                    <MenuItem value={"task"}>Tasks</MenuItem>
                    <MenuItem value={"flow"}>Flows</MenuItem>
                    <MenuItem value={"run"}>Runs</MenuItem>
                  </Select>
                </FormControl>
                <div style={{ marginTop: 10 }}>
                  <StyledLink to="/auth/sign-up">
                    <WhiteButton variant="outlined">Sign Up</WhiteButton>
                  </StyledLink>
                  <WhiteText>
                    to start tracking and sharing your own work.
                  </WhiteText>
                  <WhiteText>OpenML is open and free to use.</WhiteText>
                </div>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={10}
              style={{
                paddingLeft: 20,
                paddingRight: 20
              }}
            >
              <Grid
                container
                spacing={3}
                style={{
                  paddingTop: 80
                }}
              >
                <Grid item xs={12} md={4}>
                  <Typography variant="h5" style={{ marginBottom: 15 }}>
                    <ListIcon
                      icon="database"
                      size="2x"
                      style={{ color: green[400], marginBottom: 10 }}
                    />
                    <br />
                    AI-ready data
                  </Typography>
                  <Paragraph>
                    All datasets are uniformy formatted, have rich, consistent
                    metadata, and can be loaded directly into your favourite
                    environments.
                  </Paragraph>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h5" style={{ marginBottom: 15 }}>
                    <ListIcon
                      icon="cogs"
                      size="2x"
                      style={{ color: blue[400], marginBottom: 10 }}
                    />
                    <br />
                    ML library integrations
                  </Typography>
                  <Paragraph>
                    Pipelines and models can be shared directly from your
                    favourite machine learning libraries. No manual steps
                    required.
                  </Paragraph>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h5" style={{ marginBottom: 15 }}>
                    <ListIcon
                      icon="flask"
                      size="2x"
                      style={{ color: red[400], marginBottom: 10 }}
                    />
                    <br />A treasure trove of ML results
                  </Typography>
                  <Paragraph>
                    Learn from millions of reproducible machine learning
                    experiments on thousands of datasets to make informed
                    decisions.
                  </Paragraph>
                </Grid>
              </Grid>

              <CoverTitle variant="h4" gutterBottom>
                Frictionless machine learning
              </CoverTitle>
              <CoverSubTitle>
                Easily import and export datasets, pipelines, and experiments
                from your favourite machine learning environments and libraries.
              </CoverSubTitle>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  fontSize: 50,
                  textAlign: "center"
                }}
              >
                <Grid item xs={2} md={1}>
                  <Icon icon={jupyterIcon} />
                </Grid>
                <Grid item xs={2} md={1}>
                  <Icon icon={tensorflowIcon} />
                </Grid>
                <Grid item xs={2} md={1}>
                  <Icon icon={pytorchIcon} />
                </Grid>
                <Grid item xs={2} md={1}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg"
                    height="50"
                    width="50"
                    alt="sklearn"
                  />
                </Grid>
                <Grid item xs={2} md={1}>
                  <img
                    src="https://avatars2.githubusercontent.com/u/12941794?s=200&v=4"
                    height="50"
                    width="50"
                    alt="mlr"
                  />
                </Grid>
                <Grid item xs={2} md={1}>
                  <img
                    src="https://waikato.github.io/weka-site/images/weka.png"
                    height="50"
                    width="50"
                    alt="WEKA"
                  />
                </Grid>
                <Grid item xs={2} md={1}>
                  <Icon icon={pythonIcon} />
                </Grid>
                <Grid item xs={2} md={1}>
                  <Icon icon={rLang} />
                </Grid>
                <Grid item xs={2} md={1}>
                  <Icon icon={javaIcon} />
                </Grid>
                <Grid item xs={2} md={1}>
                  <Icon icon={cSharp} />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CodeCard
                    title="In Python (with scikit-learn)"
                    language="python"
                    value={pythonExample}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CodeCard
                    title="In R (with mlr)"
                    language="r"
                    value={rExample}
                  />
                </Grid>
                <MoreLink to="/api" style={{ fontSize: "1.1em" }}>
                  Learn more about the OpenML APIs{" "}
                  <ListIcon icon="arrow-right" style={{ marginLeft: 5 }} />
                </MoreLink>
              </Grid>

              <Grid
                container
                spacing={3}
                style={{
                  paddingTop: 80,
                  paddingBottom: 30
                }}
              >
                <Grid item xs={12} md={6}>
                  <OpenMLGraph />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" style={{ marginBottom: 10 }}>
                    All machine learning data, organized
                  </Typography>

                  <ListItem>
                    <ListItemIcon>
                      <GreenIcon icon="database" size="2x" fixedWidth />
                    </ListItemIcon>
                    <ListItemText>
                      For every{" "}
                      <span style={{ color: "green" }}>
                        <b>dataset</b>
                      </span>
                      , find which{" "}
                      <span style={{ color: "orange" }}>
                        <b>tasks</b>
                      </span>{" "}
                      (e.g. classification) need to be solved.
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AmberIcon icon="flag" size="2x" fixedWidth />
                    </ListItemIcon>
                    <ListItemText>
                      For every{" "}
                      <span style={{ color: "orange", fontWeigth: "400" }}>
                        <b>task</b>
                      </span>
                      , find all{" "}
                      <span style={{ color: "red", fontWeigth: "400" }}>
                        <b>evaluation runs</b>
                      </span>{" "}
                      that people did, and how well their models performed.
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <RedIcon icon="flask" size="2x" fixedWidth />
                    </ListItemIcon>
                    <ListItemText>
                      For every{" "}
                      <span style={{ color: "red", fontWeigth: "400" }}>
                        <b>run</b>
                      </span>
                      , find model details, evaluations, and the exact{" "}
                      <span style={{ color: "blue", fontWeigth: "400" }}>
                        <b>algorithm pipelines</b>
                      </span>{" "}
                      used.
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BlueIcon icon="cog" size="2x" fixedWidth />
                    </ListItemIcon>
                    <ListItemText>
                      For every{" "}
                      <span style={{ color: "blue", fontWeigth: "400" }}>
                        <b>flow (pipeline)</b>
                      </span>
                      , find all the{" "}
                      <span style={{ color: "red", fontWeigth: "400" }}>
                        <b>evaluation runs</b>
                      </span>{" "}
                      to see how well it performed on different{" "}
                      <span style={{ color: "orange", fontWeigth: "400" }}>
                        <b>tasks</b>
                      </span>
                      .
                    </ListItemText>
                  </ListItem>
                  <MoreLinkExternal
                    href="https://docs.openml.org"
                    target="_blank"
                    style={{ fontSize: "1.1em" }}
                  >
                    Learn more{" "}
                    <ListIcon icon="arrow-right" style={{ marginLeft: 5 }} />
                  </MoreLinkExternal>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                style={{
                  paddingTop: 40,
                  paddingBottom: 30
                }}
              >
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" style={{ marginBottom: 10 }}>
                    Reproducible machine learning
                  </Typography>
                  <ListItem>
                    <ListItemIcon>
                      <RedIcon icon="code-branch" size="2x" fixedWidth />
                    </ListItemIcon>
                    <ListItemText>
                      OpenML records exactly which datasets and library versions
                      are used, so that nothing gets lost.
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PurpleIcon icon="sliders-h" size="2x" fixedWidth />
                    </ListItemIcon>
                    <ListItemText>
                      For every experiment, the exact pipeline structure,
                      architecture, and all hyperparameter settings are
                      automatically stored.
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BlueIcon icon="sync" size="2x" fixedWidth />
                    </ListItemIcon>
                    <ListItemText>
                      OpenML{" "}
                      <span style={{ color: "blue", fontWeigth: "400" }}>
                        <b>flows</b>
                      </span>{" "}
                      wrap around tool-specific implementations that can be
                      serialized and later deserialized to reproduce models and
                      verify results.
                    </ListItemText>
                  </ListItem>
                  <MoreLinkExternal
                    href="https://openml.github.io/blog/"
                    target="_blank"
                    style={{ fontSize: "1.1em" }}
                  >
                    Read stories{" "}
                    <ListIcon icon="arrow-right" style={{ marginLeft: 5 }} />
                  </MoreLinkExternal>
                </Grid>

                <Grid item xs={12} md={6}>
                  <ReproGraph />
                </Grid>
              </Grid>

              <CoverTitle variant="h4" gutterBottom>
                Learning to learn
              </CoverTitle>
              <CoverSubTitle>
                Run systematic benchmarks, large-scale experiments, learn from
                previous experiments, and automate machine learning itself.
              </CoverSubTitle>
              <Grid
                container
                spacing={6}
                style={{
                  paddingTop: 40
                }}
              >
                <Grid item xs={12} sm={6} md={3} style={{ display: "flex" }}>
                  <Card style={{ width: "100%" }}>
                    <CardActionArea>
                      <CardMedia
                        style={{ height: 140 }}
                        image="cover-suites.png"
                        title="Benchmarking suites"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          Benchmarking Suites
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Easy-to-use, curated suites of machine learning tasks
                          to standardize and improve benchmarking.
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        href="https://docs.openml.org/benchmark/"
                        target="_blank"
                      >
                        Learn more
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        href="https://arxiv.org/pdf/1708.03731.pdf"
                        target="_blank"
                      >
                        Paper
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  style={{ display: "flex", gridTemplateRows: "1fr auto" }}
                >
                  <Card style={{ width: "100%" }}>
                    <CardActionArea>
                      <CardMedia
                        style={{ height: 140 }}
                        image="cover-automlbm.png"
                        title="AutoML Benchmark"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          AutoML Benchmark
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          An open, ongoing, and extensible benchmark framework
                          for Automated Machine Learning systems.
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        href="https://openml.github.io/automlbenchmark/paper.html"
                        target="_blank"
                      >
                        Learn more
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        href="https://www.automl.org/wp-content/uploads/2019/06/automlws2019_Paper45.pdf"
                        target="_blank"
                      >
                        Paper
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3} sm={6} style={{ display: "flex" }}>
                  <Card style={{ width: "100%" }}>
                    <CardMedia
                      style={{ height: 140 }}
                      image="cover-automl.png"
                      title="AutoML Tools"
                    />
                    <CardContent style={{ paddingBottom: 0 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        AutoML Tools
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Several AutoML tools use OpenML to speed up the search
                        for the best models, including
                        <QuickLink
                          to="https://arxiv.org/abs/2007.04074"
                          target="_blank"
                          style={{ marginLeft: 10 }}
                        >
                          autosklearn
                        </QuickLink>
                        <QuickLink
                          to="https://arxiv.org/abs/1712.02902"
                          target="_blank"
                        >
                          SageMaker AutoML
                        </QuickLink>
                        <QuickLink
                          to="https://papers.nips.cc/paper/7595-probabilistic-matrix-factorization-for-automated-machine-learning.pdf"
                          target="_blank"
                        >
                          Azure AutoML
                        </QuickLink>
                        <QuickLink
                          to="https://github.com/PGijsbers/gama"
                          target="_blank"
                        >
                          GAMA
                        </QuickLink>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3} sm={6} style={{ display: "flex" }}>
                  <Card style={{ width: "100%" }}>
                    <CardMedia
                      style={{ height: 140 }}
                      image="cover-hyperimp.png"
                      title="Hackathon"
                    />
                    <CardContent style={{ paddingBottom: 0 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Learn to tune
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Learn from millions of experiments how to tune
                        algorithms:
                        <QuickLink
                          to="https://arxiv.org/abs/1710.04725"
                          target="_blank"
                        >
                          parameter importance
                        </QuickLink>
                        <QuickLink
                          to="https://arxiv.org/abs/1811.09409"
                          target="_blank"
                        >
                          default learning
                        </QuickLink>
                        <QuickLink
                          to="http://metalearning.ml/2018/papers/metalearn2018_paper70.pdf"
                          target="_blank"
                        >
                          symbolic defaults
                        </QuickLink>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <MoreLinkExternal
                href="https://scholar.google.be/scholar?oi=bibs&cites=17799286834300265378"
                target="_blank"
                style={{ fontSize: "1.1em", paddingTop: 10 }}
              >
                Read more research based on OpenML{" "}
                <ListIcon icon="arrow-right" style={{ marginLeft: 5 }} />
              </MoreLinkExternal>

              <CoverTitle variant="h4" gutterBottom>
                Join OpenML
              </CoverTitle>
              <CoverSubTitle>
                Join a vibrant ecosystem of machine learning researchers and
                enthousiasts.
              </CoverSubTitle>
              <Grid
                container
                spacing={3}
                style={{
                  paddingTop: 20
                }}
              >
                <Grid item xs={12} md={3}>
                  <Typography variant="h5" style={{ marginBottom: 15 }}>
                    <ListIcon
                      icon="user-graduate"
                      size="2x"
                      style={{ color: red[400], marginBottom: 10 }}
                    />
                    <br />
                    Machine learning experts
                  </Typography>
                  <Paragraph>
                    Share your work, show how it's done, and track how often it
                    is viewed and reused
                  </Paragraph>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="h5" style={{ marginBottom: 15 }}>
                    <ListIcon
                      icon="user-shield"
                      size="2x"
                      style={{ color: green[400], marginBottom: 10 }}
                    />
                    <br />
                    Data owners
                  </Typography>
                  <Paragraph>
                    Share your data to challenge and collaborate with the
                    machine learning community
                  </Paragraph>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="h5" style={{ marginBottom: 15 }}>
                    <ListIcon
                      icon="user-cog"
                      size="2x"
                      style={{ color: blue[400], marginBottom: 10 }}
                    />
                    <br />
                    Algorithm developers
                  </Typography>
                  <Paragraph>
                    Integrate your tools with OpenML to easily import and export
                    data and experiments
                  </Paragraph>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="h5" style={{ marginBottom: 15 }}>
                    <ListIcon
                      icon="user-ninja"
                      size="2x"
                      style={{ color: purple[400], marginBottom: 10 }}
                    />
                    <br />
                    Software engineers
                  </Typography>
                  <Paragraph>
                    OpenML is open source, get involved and make it even better
                    and more useful
                  </Paragraph>
                </Grid>
              </Grid>
              <MoreLink to="/contribute" style={{ fontSize: "1.1em" }}>
                Learn how to contribute to OpenML{" "}
                <ListIcon icon="arrow-right" style={{ marginLeft: 5 }} />
              </MoreLink>

              <CoverTitle variant="h4" gutterBottom>
                Support OpenML
              </CoverTitle>
              <CoverSubTitle>
                We gratefully acknowledge the support from our sponsors and
                supporting organizations.
                <MoreLink
                  to="/contribute"
                  style={{ color: red[500], display: "inline", marginLeft: 5 }}
                >
                  Become a sponsor
                  <ListIcon icon="heart" style={{ marginLeft: 5 }} />{" "}
                </MoreLink>
              </CoverSubTitle>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                style={{
                  marginTop: 20,
                  marginBottom: 0,
                  fontSize: 50,
                  textAlign: "center"
                }}
              >
                {" "}
                <Grid item xs={3}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Eindhoven_University_of_Technology_logo_new.png"
                    height="50"
                    width="180"
                    alt="TU/e"
                  />
                </Grid>
                <Grid item xs={3}>
                  <img
                    src="https://assets.amazon.science/07/d9/d204ca2242bea8215dbf9ca5c43e/amazon-science-logo.svg"
                    height="50"
                    width="200"
                    alt="Amazon Science"
                  />
                </Grid>
                <Grid item xs={3}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/NWO_logo_-_RGB.jpg/370px-NWO_logo_-_RGB.jpg"
                    height="70"
                    width="50"
                    alt="NWO"
                  />
                </Grid>
              </Grid>

              <CoverTitle variant="h4" gutterBottom>
                Get started now
              </CoverTitle>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                style={{
                  marginTop: 20,
                  marginBottom: 100,
                  textAlign: "center"
                }}
              >
                <Grid item xs={4} md={3}>
                  <ContactChipFull
                    link="/auth/sign-up"
                    icon={"sign-in-alt"}
                    text="Sign Up"
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <ContactChipFull
                    link="https://docs.openml.org/"
                    icon="book-open"
                    text="OpenML guides"
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <ContactChipFull
                    link="/contribute"
                    icon="hand-holding-heart"
                    text="Get Involved"
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <ContactChipFull link="/about" icon="users" text="About Us" />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        )}
      </MainContext.Consumer>
    );
  }
}

export default Cover;
