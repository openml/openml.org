import React, { useState } from "react";
import styled from "styled-components";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "swagger-ui-themes/themes/3.x/theme-material.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { green } from "@mui/material/colors";
import {
  Tab,
  Tabs,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Box,
  Fab,
  Card,
  Grid,
  CardContent as MuiCardContent,
  List,
  ListItem,
  ListItemText as MuiListItemText
} from "@mui/material";

const StyledSwaggerUI = styled.div`
  [id^="model-"][id*="_"] {
    display: none;
  }
  [id^="model-"][id*="List"] {
    display: none;
  }
  [id^="model-"][id*="Unprocessed"] {
    display: none;
  }
  [id^="model-"][id*="Request"] {
    display: none;
  }
  [id^="model-"][id*="Trace"] {
    display: none;
  }
  .swagger-ui .scheme-container {
    background: inherit;
    box-shadow: none;
  }
  .swagger-ui .wrapper:nth-of-type(2n):before {
    content: "Actions";
    font-size: 18pt;
    color: #3b4151;
    font-weight: 600;
  }
  #operations-tag-data {
    margin-top: 20px;
  }
  .swagger-ui .scheme-container {
    direction: rtl;
    display: flex;
    justify-content: flex-end;
    padding: 0;
  }
  .swagger-ui section.schemes {
    margin-left: auto;
  }
  .swagger-ui .servers {
    width: 320px;
  }
  .swagger-ui .servers > label {
    margin: 0;
  }
  .swagger-ui section.models .model-container {
    background: white;
    margin: 0;
    border-bottom: 1px solid rgba(59, 65, 81, 0.3);
    border-radius: 0px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }

  .swagger-ui section.models .model-container:last-of-type {
    margin: 0;
  }
  .swagger-ui section.models.is-open {
    padding: 0px;
  }
  .swagger-ui section.models {
    border: none;
  }
  .swagger-ui section.models h4 {
    margin-bottom: 10px;
    font-size: 18pt;
    color: #3b4151;
    font-weight: 600;
  }
  .swagger-ui section.models.is-open h4 {
    margin-top: 20px;
    margin-bottom: 0px;
    border-bottom: 0px;
  }
  .swagger-ui .info {
    margin-bottom: 0px;
  }
  .swagger-ui .servers > label select {
    height: 40px;
  }
  .swagger-ui table.model tr.property-row td {
    padding: 0.6em;
    font-size: 12pt;
  }
  .swagger-ui table.model tr.property-row td:first-child {
    padding: 0.6em;
    font-size: 12pt;
  }
  .swagger-ui td .model .pointer .model-title {
    display: none;
  }
  .swagger-ui .model-box {
    padding-top: 7px;
    padding-left: 5px;
    padding-bottom: 7px;
  }
  .swagger-ui .model-title {
    font-size: 12pt;
    color: rgb(59, 65, 81);
    text-transform: lowercase;
  }
  .swagger-ui .model-title__text {
    padding-left: 10px;
  }
  .swagger-ui td .model-toggle {
    font-size: 20px;
    top: 2px;
    margin-left: 0px;
  }
  .swagger-ui td .brace-open {
    font-size: 16px;
  }
  .renderedMarkdown {
    color: #999;
  }
  .swagger-ui .opblock-tag {
    margin: 0px;
    background-color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }
  .no-margin {
    display: flex;
    flex-direction: column;
  }
  .swagger-ui .opblock-tag-section h4 {
    padding-left: 20px;
    font-size: 12pt;
    height: 50px;
  }
  .swagger-ui .opblock-get {
    padding-left: 5px;
    margin-bottom: 1px;
  }
  .swagger-ui .opblock-post {
    padding-left: 5px;
    margin-bottom: 1px;
    order: 2;
  }
  .swagger-ui .opblock-delete {
    padding-left: 5px;
    margin-bottom: 1px;
    order: 3;
  }
  .swagger-ui .opblock-summary {
    height: 50px;
  }
`;


const FixedIcon = styled(FontAwesomeIcon)`
  font-size: ${props => (props.sizept ? props.sizept : 15)}pt;
  left: ${props => props.l}px;
  top: ${props => props.t}px;
  margin-right: ${props => props.mr}px;
  color: ${props => props.color},
`;
const ApiTabs = styled(Tabs)`
height: 61px;
background-color: #fff;
border-bottom: 1px solid rgba(0, 0, 0, 0.12);
border-top: 1px solid rgba(0, 0, 0, 0.12);
`;
const ApiTab = styled(Tab)`
color: ${props => props.searchcolor} !important;
font-size: 11pt;
margin-top: 5px;
`;
const HeroTitle = styled(Typography)({
  textAlign: "center",
  lineHeight: "150%",
  padding: "2vw 5vw"
});
const CardContent = styled(MuiCardContent)`
  margin-top: 10px;

  &:last-child {
    padding-bottom: ${props => props.theme.spacing(8)};
  }
`;
const ListItemText = styled(MuiListItemText)`
  font-weight: 'bold' !important;
`;

const docs = {
  "Python" : "https://openml.github.io/openml-python",
  "R" : "https://github.com/mlr-org/mlr3oml",
  "Julia": "https://juliaai.github.io/OpenML.jl/stable/",
  "Java" : "https://docs.openml.org/Java-guide"
}

const colab_links = {
  "Python" : "https://colab.research.google.com/drive/1z5FvwxCz4AMQ67Vzd-AsSd8g5uRxnYDf?usp=sharing",
  "R" : "https://colab.research.google.com/drive/1d3etWoVg9DVGnDdlQIerB9E4tyY29gqZ?usp=sharing",
  "Julia" : "https://colab.research.google.com/drive/1IKO-U27WbV9H4kMiWWp0yxKtKpNiDZAd?usp=sharing"
}

const other_links = {
  "RUST" : "https://github.com/mbillingr/openml-rust",
  ".NET" : "https://github.com/openml/openml-dotnet",
  "Command line" : "https://github.com/nok/openml-cli"
}

const codeExamples = {
  "Python" : {
    "Installation" :
`pip install openml`,

    "Query and download data" :
`import openml

# List all datasets and their properties
openml.datasets.list_datasets(output_format="dataframe")

# Get dataset by ID
dataset = openml.datasets.get_dataset(61)

# Get dataset by name
dataset = openml.datasets.get_dataset('Fashion-MNIST')

# Get the data itself as a dataframe (or otherwise)
X, y, _, _ = dataset.get_data(dataset_format="dataframe")`,

    "Download tasks, run models locally, publish results (with scikit-learn)" :
`from sklearn import ensemble
from openml import tasks, runs

# Build any model you like
clf = ensemble.RandomForestClassifier()

# Download any OpenML task
task = tasks.get_task(3954)

# Run and evaluate your model on the task
run = runs.run_model_on_task(clf, task)

# Share the results on OpenML. Your API key can be found in your account.
# openml.config.apikey = 'YOUR_KEY'
run.publish()`,

    "OpenML Benchmarks" :
`# List all tasks in a benchmark
benchmark = openml.study.get_suite('OpenML-CC18')
tasks.list_tasks(output_format="dataframe", task_id=benchmark.tasks)

# Return benchmark results
openml.evaluations.list_evaluations(
    function="area_under_roc_curve",
    tasks=benchmark.tasks,
    output_format="dataframe"
)`
  },
  "R" : {
    "Info" : "The old OpenML package is superseded by the mlr3oml package. The documentation of the OpenML package can be found here: http://openml.github.io/openml-r/.",

    "Installation" :
`install.packages("mlr3oml")`,
    "Query and download data" :
`library(mlr3oml)
library(mlr3)

# Search for specific datasets
odatasets = list_oml_data(
  number_features = c(10, 20),
  number_instances = c(45000, 50000),
  number_classes = 2
)

# Get dataset
odata = odt(id = 1590)
# Access the actual data
odata$data

# Convert to an mlr3::Task
tsk_adult = as_task(odata, target = "class")
`,
    "Run an mlr3 model locally" :
`# create an mlr3 Learner and Resampling and run a resample experiment

rr = resample(
  task = tsk_adult,
  learner = lrn("classif.rpart"),
  resampling = rsmp("cv", folds = 10)
)`,
    "OpenML Benchmarks" :
` # Access a Benchmark Suite
ocollection = ocl(353)

# The IDs
ocollection$task_ids
id = ocollection$task_ids[1L]

# Create mlr3 Task and Resampling from the OpenML Task
task = tsk("oml", task_id = id)
resampling = tsk("oml", task_id = id)
`
  },
  "Julia" : {
    "Installation" :
`using Pkg
Pkg.add("OpenML")`,

    "Query and download data" :
`using OpenML
using DataFrames

# List all datasets and their properties
ds = OpenML.list_datasets(output_format = DataFrame)

# Get dataset by ID
OpenML.describe_dataset(40996)

# Get the data itself as a dataframe (or otherwise)
table = OpenML.load(40996)
df = DataFrame(table)`
  },
  "Java" : {
    "Installation" :
`// Download the jar file, or install via Maven. See the full docs.`,

    "Query and download data" :
`// Create a client. Your API key can be found in your account.
OpenmlConnector openml = new OpenmlConnector("api_key");

// List all datasets and their properties
DataSet[] datasets = openml.dataList();

// Get dataset by ID
DataSetDescription data = openml.dataGet(40996);
String file_url = data.getUrl();
`,

"Download tasks, run models locally, publish results (with WEKA)" :
`// Build any model you like
Classifier model = new RandomForest();

// Download any OpenML task
Task t = openml.taskGet(3954);

// Load the data as WEKA Instances (optional)
Instances d = InstancesHelper.getDatasetFromTask(openml, t);

// Run and evaluate your model on the task, and upload to OpenML
Pair<Integer, Run> result = RunOpenmlJob.executeTask(openml, new WekaConfig(), 3954, model);`,

"OpenML Benchmarks" :
`// List all tasks in a benchmark
Study benchmark = openml.studyGet("OpenML-CC18", "tasks");
Task[] tasks = benchmark.getTasks()

// Return benchmark results
EvaluationList el = openml.evaluationList(tasks, null, "area_under_roc_curve", 1000);`
  }
}

function OpenMLSwaggerUI() {
  const [api, setApi] = useState('Python');
  const [open, setOpen] = React.useState(false);

  const CodeCard = props => {
    const { language, value, title, colab } = props;
    return (
      <div>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Card style={{ marginTop: 0, opacity: 0.9}}>
        <CardContent>
          <SyntaxHighlighter
            language={language}
            style={coy}
            customStyle={{marginBottom: 0, paddingTop: -40}}
          >
            {value}
          </SyntaxHighlighter>
        </CardContent>
      </Card>
      <Box mb={10} display="flex" justifyContent="right">
        { colab &&
        <Tooltip title="Run in Colab">
            <IconButton color="primary" onClick={() => window.open(colab, "_blank")} size="large">
            <FixedIcon icon={"play"}/>
            </IconButton>
        </Tooltip>}
        <Tooltip title="Copy to clipboard">
            <IconButton
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(value);
                setOpen(true);
                }}
              size="large">
            <FixedIcon icon={"copy"}/>
            </IconButton>
        </Tooltip>
      </Box>
      </div>
    );
  };
  const code = (language) => {
    return (
        Object.entries(codeExamples[language]).map(([title, example]) => { return (
          <CodeCard
            key = {title}
            title={title}
            language={language.toLowerCase()}
            value={example}
            colab={colab_links[language]}
          />
          )
        }
      )
    )
  }
  const make_other = () => {
    return (
      Object.entries(other_links).map(([title, link]) => { return (
        <ListItem button component="a" href={link} target="_blank" key = {title}>
          <ListItemText primary={title} style={{fontWeight:900}}/>
        </ListItem>
        )
      }
      )
    )
  }
  Object.entries(other_links).map(([title, link]) => { return (
    <ListItem button component="a" href={link} target="_blank" key = {title}>
      <ListItemText primary={title} />
    </ListItem>
    )})

  return (
    <React.Fragment>
      <Box sx={{ width: '100%' }}>
      <ApiTabs
        value={api}
        onChange={event => setApi(event.target.textContent)}
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
      </Box>
      <Grid
        container
        spacing={6}
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{margin:0, width:"100%"}}>
      { api === "REST" ? (
      <StyledSwaggerUI value="REST">
        <SwaggerUI url="openml-api.json"/>
      </StyledSwaggerUI>
      ) : api !== "Others" ? (
        <Grid item sm={10} xs={12}>
        <HeroTitle variant="h2" align="center" id="licences">
          {api} API
        </HeroTitle>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Fab variant="extended" color="secondary" target="_blank" href={docs[api]}>
            <FixedIcon icon="paper-plane" l="40" t="40" mr="10" sizept="15"/>
            Full Documentation
          </Fab>
        </Box>
        <CardContent>
          {code(api)}
        </CardContent>
        <Box pb={5} display="flex" justifyContent="center" alignItems="center">
          You are learning fast, young apprentice!
          {"\u00A0\u00A0"}<FixedIcon icon={"thumbs-up"} size="2x" fixedWidth color={green[500]}/>{"\u00A0\u00A0"}
          Still, there is so much more to see...
        </Box>
        <Box pb={15} display="flex" justifyContent="center" alignItems="center">
          <Fab size="small" variant="extended" color="secondary" target="_blank" href={docs[api]}>
            <FixedIcon icon="location-arrow" l="60" t="40" mr="10" sizept="15" />
            See the complete guide
          </Fab>
        </Box>
        </Grid>
      ) : (
        <Grid item sm={10} xs={12}>
        <HeroTitle variant="h2" align="center" id="licences">
          Other APIs
        </HeroTitle>
        <Card style={{ marginTop: 0, opacity: 0.9}}>
          <CardContent>
            These are all APIs developed and maintained independently by others. As such, we can't offer any guarantees, but hope they might be useful to you.
            <List component="nav">
              {make_other()}
            </List>
          </CardContent>
        </Card>
        </Grid>
      )}
      </Grid>
      <Snackbar
          open={open}
          anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
          autoHideDuration={2000}
          message="Example code copied!"
          onClose={() => setOpen(false)}
        />
    </React.Fragment>
  );
}

export default OpenMLSwaggerUI;
