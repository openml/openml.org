// Installation
export const installation = `// Download the jar file, or install via Maven. See the full docs.`;

// Query and download data
export const data = `// Create a client. Your API key can be found in your account.
OpenmlConnector openml = new OpenmlConnector("api_key");

// List all datasets and their properties
DataSet[] datasets = openml.dataList();

// Get dataset by ID
DataSetDescription data = openml.dataGet(40996);
String file_url = data.getUrl();`;

// Run and publish models
export const run = `// Build any model you like
Classifier model = new RandomForest();

// Download any OpenML task
Task t = openml.taskGet(3954);

// Load the data as WEKA Instances (optional)
Instances d = InstancesHelper.getDatasetFromTask(openml, t);

// Run and evaluate your model on the task, and upload to OpenML
Pair<Integer, Run> result = RunOpenmlJob.executeTask(openml, new WekaConfig(), 3954, model);`;

// Using Benchmarks
export const benchmark = `// List all tasks in a benchmark
Study benchmark = openml.studyGet("OpenML-CC18", "tasks");
Task[] tasks = benchmark.getTasks()

// Return benchmark results
EvaluationList el = openml.evaluationList(tasks, null, "area_under_roc_curve", 1000);`;
