import React from "react";
import styled from "styled-components";
import { spacing } from "@material-ui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { green, red, blue, amber, purple, grey } from "@material-ui/core/colors";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core/";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

import { ThemeContext } from "../../App.js";

import {
  Grid,
  Paper,
  Card,
  CardContent as MuiCardContent,
  Typography,
  Tooltip
} from "@material-ui/core";

const FrontPaper = styled(Paper)`
  ${spacing}
  opacity: 0.9;
  width: 100%;
`;

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: ${props => props.theme.spacing(4)}px;
  }
`;

const OpenMLTitle = styled.div`
  height: auto;
  text-align: center;
  overflow: auto;
  margin: auto;
  padding-top: 50px;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 4em;
`;

const OpenMLSubTitle = styled.div`
  height: auto;
  text-align: center;
  overflow: auto;
  margin: auto;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 2em;
`;

const CoverTitle = styled(Typography)`
  ${spacing}
  color: white;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding-top: 50px;
  padding-bottom: 30px;
`;
const FixedIcon = styled(FontAwesomeIcon)`
    position: absolute;
    font-size:${props => props.sizept ? props.sizept : 20}pt;
    left: ${props => props.l}px;
    top: ${props => props.t}px;
`;
const GreenFixedIcon = styled(FixedIcon)`
    color: ${green[400]};
`;
const RedFixedIcon = styled(FixedIcon)({
    color: red[400],
});
const BlueFixedIcon = styled(FixedIcon)({
    color: blue[400],
});
const AmberFixedIcon = styled(FixedIcon)({
    color: amber[500],
});
const PurpleFixedIcon = styled(FixedIcon)({
    color: purple[500],
});
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
const PauseIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    marginLeft: 10,
    color: grey[100],
});

function OpenMLGraph() {
  return (
  <div style={{padding:30}}>
    <div style={{position: 'relative', margin: 'auto', width: 345, height: 250 }}>

      <GreenFixedIcon icon="database" l="0" t="50" />
      <GreenFixedIcon icon="database" l="0" t="90" />
      <GreenFixedIcon icon="database" l="0" t="130" />
      <AmberFixedIcon icon="flag" l="90" t="50" />
      <AmberFixedIcon icon="flag" l="90" t="90" />
      <AmberFixedIcon icon="flag" l="90" t="130" />
      <AmberFixedIcon icon="flag" l="90" t="170" />
      <RedFixedIcon icon="atom" l="180" t="10" />
      <RedFixedIcon icon="atom" l="180" t="50" />
      <RedFixedIcon icon="atom" l="180" t="90" />
      <RedFixedIcon icon="atom" l="180" t="130" />
      <RedFixedIcon icon="atom" l="180" t="170" />
      <RedFixedIcon icon="atom" l="180" t="210" />
      <BlueFixedIcon icon="cog" l="270" t="50" />
      <BlueFixedIcon icon="cog" l="270" t="90" />
      <BlueFixedIcon icon="cog" l="270" t="130" />
      <BlueFixedIcon icon="cog" l="270" t="170" />
      <svg style={{minHeight: 250}}>
        <line x1="35" y1="65" x2="80" y2="65" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="35" y1="105" x2="80" y2="105" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="35" y1="145" x2="80" y2="145" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="35" y1="145" x2="80" y2="185" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="125" y1="65" x2="170" y2="25" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="125" y1="65" x2="170" y2="65" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="125" y1="105" x2="170" y2="105" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="125" y1="145" x2="170" y2="145" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="125" y1="145" x2="170" y2="185" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="125" y1="185" x2="170" y2="225" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="215" y1="25" x2="265" y2="65" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="215" y1="105" x2="265" y2="65" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="215" y1="65" x2="265" y2="105" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="215" y1="145" x2="265" y2="105" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="215" y1="185" x2="265" y2="145" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="215" y1="225" x2="265" y2="185" style={{stroke:'grey', strokeWidth:1.5}} />
      </svg>
    </div>
  </div>
  );
}

function ReproGraph() {
  return (
  <div style={{padding:30}}>
    <div style={{position: 'relative', margin: 'auto', width: 420, height: 100 }}>
      <GreenFixedIcon icon="database" sizept="30" l="28" t="10" />
      <AmberFixedIcon icon="flag" sizept="30" l="135" t="10" />
      <BlueFixedIcon icon="cog" sizept="30" l="245" t="10" />
      <RedFixedIcon icon="atom" sizept="30" l="355" t="10" />
      <svg style={{minWidth: 420, minHeight: 100}}>
        <text x="13" y="70" fontWeight="bold">data sets</text>
        <text x="0" y="90" fontStyle="italic" fontSize="9pt">files/urls, versions</text>
        <text x="3" y="110" fontStyle="italic" fontSize="9pt">stats, properties</text>
        <text x="135" y="70" fontWeight="bold">tasks</text>
        <text x="112" y="90" fontStyle="italic" fontSize="9pt">inputs, outputs</text>
        <text x="113" y="110" fontStyle="italic" fontSize="9pt">train/test splits</text>
        <text x="248" y="70" fontWeight="bold">flows</text>
        <text x="232" y="90" fontStyle="italic" fontSize="9pt">dependencies</text>
        <text x="222" y="110" fontStyle="italic" fontSize="9pt">detailed structure</text>
        <text x="359" y="70" fontWeight="bold">runs</text>
        <text x="337" y="90" fontStyle="italic" fontSize="9pt">configurations</text>
        <text x="345" y="110" fontStyle="italic" fontSize="9pt">evaluations</text>
        <line x1="75" y1="30" x2="125" y2="30" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="295" y1="30" x2="345" y2="30" style={{stroke:'grey', strokeWidth:1.5}} />
        <path d="M 180 30 Q 265 -30 345 30" stroke="black" fill="transparent"/>
      </svg>
    </div>
  </div>
  );
}

function ReproGraph2() {
  return (
    <div style={{position: 'relative', margin: 'auto', width: 420, height: 180 }}>
      <PurpleFixedIcon icon="cogs" sizept="20" l="20" t="10" />
      <BlueFixedIcon icon="cog" sizept="20" l="100" t="10" />
      <BlueFixedIcon icon="cog" sizept="20" l="100" t="50" />
      <AmberFixedIcon icon="flag" sizept="20" l="135" t="50" />
      <RedFixedIcon icon="atom" sizept="20" l="200" t="50" />
      <BlueFixedIcon icon="cog" sizept="20" l="260" t="50" />
      <AmberFixedIcon icon="flag" sizept="20" l="295" t="50" />
      <BlueFixedIcon icon="cog" sizept="20" l="260" t="90" />
      <PurpleFixedIcon icon="cogs" sizept="20" l="340" t="90" />

      <svg style={{minWidth: 420, minHeight: 150}}>
        <defs>
            <marker id="black-arrow" viewBox="0 0 10 10" refX="0" refY="5" orient="auto">
               <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
        </defs>
        <line x1="60" y1="25" x2="90" y2="25"  markerEnd="url(#black-arrow)" style={{stroke:'grey', strokeWidth:1.5}} />
        <text x="65" y="20" fontStyle="italic" fontSize="8pt">wrap</text>
        <line x1="170" y1="62" x2="190" y2="62"  markerEnd="url(#black-arrow)" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="230" y1="62" x2="250" y2="62" markerEnd="url(#black-arrow)" style={{stroke:'grey', strokeWidth:1.5}} />
        <line x1="295" y1="102" x2="325" y2="102"  markerEnd="url(#black-arrow)" style={{stroke:'grey', strokeWidth:1.5}} />
        <text x="295" y="97" fontStyle="italic" fontSize="8pt">rebuild</text>
        <text x="80" y="140">original run</text>
        <text x="250" y="140">reproduced run</text>
      </svg>
    </div>
  );
}

const CodeCard = (props) => {
    const { language, value, title } = props;
    return (
      <Card style={{marginTop: 10, opacity: 0.9}}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <SyntaxHighlighter language={language} style={coy}
           customStyle={{marginLeft:-60, marginTop:0, marginBottom:0 }}>
          {value}
          </SyntaxHighlighter>
        </CardContent>
      </Card>
    );
  }

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

        lrn = makeLearner("classif.rpart")
        task = getOMLTask(3954)
        run = runTaskMlr(task, lrn)
        uploadOMLRun(run)
      `;


class Cover extends React.Component {

  render() {
    return (
      <div>
        <OpenMLTitle>OpenML</OpenMLTitle>
        <OpenMLSubTitle>Machine Learning, better, together</OpenMLSubTitle>
        <Grid container spacing={3}>

          <CoverTitle mt={50} variant="h4" gutterBottom>
          What if we could organize the world’s machine learning information?
          </CoverTitle>
          <FrontPaper>
            <CardContent>
              <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <OpenMLGraph />
              </Grid>
              <Grid item xs={12} md={6}>
              OpenML allows you to easily share your machine learning data and
              experiments online:
              <ListItem>
              <ListItemIcon>
                <GreenIcon icon="database" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              For every <span style={{color:'green'}}><b>dataset</b>
              </span>, find which tasks (e.g. classification) need to be solved.
              </ListItemText>
              </ListItem>
              <ListItem>
              <ListItemIcon>
                <AmberIcon icon="flag" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              For every <span style={{color:'orange', fontWeigth:'bold'}}><b>
              task</b></span>, find all models that were built, and
              how well they perform.
              </ListItemText>
              </ListItem>
              <ListItem>
              <ListItemIcon>
                <RedIcon icon="atom" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              For every <span style={{color:'red', fontWeigth:'bold'}}><b>
              model evaluated</b></span>, find the exact data and algorithms
              used to build it.
              </ListItemText>
              </ListItem>
              <ListItem>
              <ListItemIcon>
                <BlueIcon icon="cog" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              For every <span style={{color:'blue', fontWeigth:'bold'}}>
              <b>algorithm or pipeline</b></span>, find the tasks it
              was evaluated on and how well it performed.
              </ListItemText>
              </ListItem>
              </Grid>
              </Grid>
              </CardContent>
          </FrontPaper>

          <CoverTitle variant="h4" gutterBottom>
            Frictionless machine learning
          </CoverTitle>
          <FrontPaper>
            <CardContent>
              <ListItemText>
              OpenML uses clean formats and protocols to share machine learning
              data and has integrations into many machine learning libraries and
              environments
              </ListItemText>
              <ListItem>
              <ListItemIcon>
                <RedIcon icon="share-square" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              <b>Share</b> data, algorithms, and models straight from the
              environment in which you created them
              </ListItemText>
              </ListItem>
              <ListItem>
              <ListItemIcon>
                <AmberIcon icon="cloud-download-alt" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              <b>Import</b> many data sets, algorithms, and results directly
              into scripts and use them straight away
              </ListItemText>
              </ListItem>
              <ListItem>
              <ListItemIcon>
                <GreenIcon icon="laptop" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              <b>Run</b> models <i>locally</i> (or wherever you want) and easily
              share them <i>globally</i>.
              </ListItemText>
              </ListItem>
            </CardContent>
          </FrontPaper>
          <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CodeCard
                title = 'In Python (with scikit-learn)'
                language='python'
                value= {pythonExample}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CodeCard
                title = 'In R (with mlr)'
                language='r'
                value= {rExample}
            />
          </Grid>
          </Grid>

          <CoverTitle variant="h4" gutterBottom>
            Reproducible machine learning
          </CoverTitle>
          <FrontPaper>
            <CardContent>
              <ListItemText>
              OpenML automatically extracts rich meta-data and makes it
              available to ensure reproducibility
              </ListItemText>
            </CardContent>
            <ReproGraph />
            <CardContent>
              <ListItemText>
              <span style={{color:'blue'}}><b>Flows</b></span> are
              wrappers around tool-specific algorithm implementations. They
              can be serialized, included in runs, and later deserialized to
              reproduce and reuse models, or to try the same algorithms on
              different tasks.
              </ListItemText>
            </CardContent>
            <ReproGraph2 />
          </FrontPaper>

          <CoverTitle variant="h4" gutterBottom>
            Automated machine learning
          </CoverTitle>
          <FrontPaper>
            <CardContent>
              <ListItemText>
              Build better models by learning from the past.
              </ListItemText>
              <ListItem>
              <ListItemIcon>
                <RedIcon icon="brain" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              Download millions of prior model evaluations to make informed
              decisions on which algorithms to try
              </ListItemText>
              </ListItem>
              <ListItem>
              <ListItemIcon>
                <PurpleIcon icon="robot" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              Automate the creation of machine learning pipelines and neural
              archtectures by efficiently exploiting prior knowledge when
              searching for optimal models
              </ListItemText>
              </ListItem>
              <ListItem>
              <ListItemIcon>
                <BlueIcon icon="hands-helping" size="2x" fixedWidth />
              </ListItemIcon>
              <ListItemText>
              Collaborative intelligence: combine human and artificial
              intelligence by sharing results on the same platform and solve
              problems faster
              </ListItemText>
              </ListItem>
            </CardContent>
          </FrontPaper>

          <CoverTitle variant="h5" gutterBottom>
          <ThemeContext.Consumer>
            {(context) => (
              <Tooltip title={context.state.animation ? "Stop gradient descent" : "Start gradient descent"} placement="top-start">
              <div style={{display:'inline-block'}}>
              {context.state.animation
                ? <PauseIcon icon={['far', 'pause-circle']} size="lg" onClick={() => context.toggleAnimation(false)} />
                : <PauseIcon icon={['far', 'play-circle']} size="lg" onClick={() => context.toggleAnimation(true)} />
              }
              </div>
              </Tooltip>
            )}
          </ThemeContext.Consumer>
          </CoverTitle>
        </Grid>
      </div>
      );
  }
}

export default Cover;
