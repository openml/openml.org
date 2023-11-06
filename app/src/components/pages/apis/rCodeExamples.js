// Installation
export const InstallationExample = `# Note: The old OpenML package is superseded by the mlr3oml package.
# The documentation of the OpenML package can be found here: http://openml.github.io/openml-r/.
install.packages("mlr3oml")`;

// Query and download data
export const DataExample = `library(mlr3oml)
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
tsk_adult = as_task(odata, target = "class")`;

// Run and publish models
export const RunExample = `# create an mlr3 Learner and Resampling and run a resample experiment

rr = resample(
  task = tsk_adult,
  learner = lrn("classif.rpart"),
  resampling = rsmp("cv", folds = 10)
)`;

// Using Benchmarks
export const BenchmarkExample = `# Access a Benchmark Suite
ocollection = ocl(353)

# The IDs
ocollection$task_ids
id = ocollection$task_ids[1L]

# Create mlr3 Task and Resampling from the OpenML Task
task = tsk("oml", task_id = id)
resampling = rsmp("oml", task_id = id)`;
