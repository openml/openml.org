// Installation
export const installation = `pip install openml`;

// Query and download data
export const data = `import openml

# List all datasets and their properties
openml.datasets.list_datasets(output_format="dataframe")

# Get dataset by ID
dataset = openml.datasets.get_dataset(61)

# Get dataset by name
dataset = openml.datasets.get_dataset('Fashion-MNIST')

# Get the data itself as a dataframe (or otherwise)
X, y, _, _ = dataset.get_data(dataset_format="dataframe")`;

// Run and publish models
export const run = `from sklearn import ensemble
from openml import tasks, runs

# Build any model you like
clf = ensemble.RandomForestClassifier()

# Download any OpenML task
task = tasks.get_task(3954)

# Run and evaluate your model on the task
run = runs.run_model_on_task(clf, task)

# Share the results on OpenML. Your API key can be found in your account.
# openml.config.apikey = 'YOUR_KEY'
run.publish()`;

// Using Benchmarks
export const benchmark = `# List all tasks in a benchmark
benchmark = openml.study.get_suite('OpenML-CC18')
tasks.list_tasks(output_format="dataframe", task_id=benchmark.tasks)

# Return benchmark results
openml.evaluations.list_evaluations(
    function="area_under_roc_curve",
    tasks=benchmark.tasks,
    output_format="dataframe"
)`;
