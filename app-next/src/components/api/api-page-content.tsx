"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Code,
  Database,
  Zap,
  Terminal,
  Key,
  BookOpen,
  ExternalLink,
  Cpu,
  FlaskConical,
  BarChart3,
  GitBranch,
} from "lucide-react";
import {
  PythonIcon,
  RCodeIcon,
  JavaCodeIcon,
} from "@/components/code-language-svg/logo-svg";
import { APICodeBlock } from "./api-code-block";
import { LanguageSelector, type LanguageExample } from "./language-selector";
import { TableOfContents } from "@/components/about/table-of-contents";

// Define code examples for different languages
const installExamples: LanguageExample[] = [
  {
    language: "python",
    icon: "python",
    installCommand: "pip install openml",
    description:
      "The Python API provides the most comprehensive access to OpenML functionality, with full support for scikit-learn, PyTorch, and TensorFlow.",
    code: `import openml

# Configure your API key (optional for read-only access)
openml.config.apikey = 'YOUR_API_KEY'

# Verify installation
print(f"OpenML version: {openml.__version__}")`,
  },
  {
    language: "r",
    icon: "r",
    installCommand: 'install.packages("OpenML")',
    description:
      "The R package integrates seamlessly with mlr3 and provides access to all OpenML resources.",
    code: `library(OpenML)

# Configure your API key
setOMLConfig(apikey = "YOUR_API_KEY")

# Verify installation
print(packageVersion("OpenML"))`,
  },
  {
    language: "java",
    icon: "java",
    installCommand: `<!-- Add to pom.xml -->
<dependency>
  <groupId>org.openml</groupId>
  <artifactId>apiconnector</artifactId>
  <version>1.0.30</version>
</dependency>`,
    description:
      "The Java API connector provides programmatic access to OpenML for JVM-based applications.",
    code: `import org.openml.apiconnector.io.OpenmlConnector;

// Initialize connector
OpenmlConnector client = new OpenmlConnector();

// Authenticate with API key
client.setApiKey("YOUR_API_KEY");`,
  },
  {
    language: "julia",
    icon: "julia",
    installCommand: 'using Pkg; Pkg.add("OpenML")',
    description:
      "The Julia package provides high-performance access to OpenML datasets and tasks.",
    code: `using OpenML

# Load a dataset
dataset = OpenML.load(31)  # credit-g dataset

# Access data
X, y = dataset.data, dataset.target`,
  },
  {
    language: "rest",
    icon: "rest",
    description:
      "Access OpenML directly through our REST API for any programming language or environment.",
    code: `# Base URL
https://www.openml.org/api/v1/

# Example: Get dataset info
curl -X GET "https://www.openml.org/api/v1/data/31" \\
  -H "Accept: application/json"

# With authentication
curl -X GET "https://www.openml.org/api/v1/data/list" \\
  -H "Accept: application/json" \\
  -H "Api-Key: YOUR_API_KEY"`,
  },
];

// Dataset examples
const datasetExamples: LanguageExample[] = [
  {
    language: "python",
    icon: "python",
    code: `import openml

# Get a dataset by name or ID
dataset = openml.datasets.get_dataset("credit-g")  # or get_dataset(31)

# Access the data
X, y, categorical_indicator, attribute_names = dataset.get_data(
    target="class"
)

# List available datasets
datasets = openml.datasets.list_datasets(output_format="dataframe")
print(f"Found {len(datasets)} datasets")

# Search for specific datasets
filtered = datasets[datasets['NumberOfInstances'] > 1000]`,
  },
  {
    language: "r",
    icon: "r",
    code: `library(OpenML)

# Get a dataset by ID
dataset <- getOMLDataSet(data.id = 31)

# Access the data
data <- dataset$data
target <- dataset$target.features

# List available datasets
datasets <- listOMLDataSets()

# Filter datasets
filtered <- subset(datasets, number.of.instances > 1000)`,
  },
  {
    language: "rest",
    icon: "rest",
    code: `# Get dataset metadata
GET /api/v1/data/31

# Get dataset features
GET /api/v1/data/features/31

# List datasets with filters
GET /api/v1/data/list?status=active&limit=100

# Download dataset file
GET /api/v1/data/get_csv/31`,
  },
];

// Task examples
const taskExamples: LanguageExample[] = [
  {
    language: "python",
    icon: "python",
    code: `import openml

# Get a task (supervised classification on credit-g)
task = openml.tasks.get_task(31)

# Access task properties
print(f"Task type: {task.task_type}")
print(f"Dataset: {task.dataset_id}")
print(f"Target: {task.target_name}")

# Get train/test splits
train_indices, test_indices = task.get_train_test_split_indices(fold=0)

# List available tasks
tasks = openml.tasks.list_tasks(output_format="dataframe")`,
  },
  {
    language: "r",
    icon: "r",
    code: `library(OpenML)

# Get a task
task <- getOMLTask(task.id = 31)

# Access task properties
print(task$task.type)
print(task$input$data.set$desc)

# List available tasks
tasks <- listOMLTasks()`,
  },
  {
    language: "rest",
    icon: "rest",
    code: `# Get task metadata
GET /api/v1/task/31

# List tasks with filters
GET /api/v1/task/list?type=1&limit=100

# Get task splits
GET /api/v1/task/split/31`,
  },
];

// Run examples
const runExamples: LanguageExample[] = [
  {
    language: "python",
    icon: "python",
    code: `import openml
from sklearn.ensemble import RandomForestClassifier

# Get a task
task = openml.tasks.get_task(31)

# Create and run a model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
run = openml.runs.run_model_on_task(clf, task)

# Upload results to OpenML
run.publish()
print(f"Run ID: {run.run_id}")

# View evaluation results
for metric, value in run.fold_evaluations.items():
    print(f"{metric}: {value}")`,
  },
  {
    language: "r",
    icon: "r",
    code: `library(OpenML)
library(mlr3)

# Get a task
task <- getOMLTask(31)

# Create a learner
learner <- lrn("classif.rpart")

# Run the experiment
run <- runTaskMlr(task, learner)

# Upload to OpenML
uploadOMLRun(run)`,
  },
  {
    language: "rest",
    icon: "rest",
    code: `# Get run details
GET /api/v1/run/123456

# List runs for a task
GET /api/v1/run/list?task=31&limit=100

# Upload a run (POST)
POST /api/v1/run
Content-Type: multipart/form-data`,
  },
];

// Benchmark suite examples
const benchmarkExamples: LanguageExample[] = [
  {
    language: "python",
    icon: "python",
    code: `import openml

# Get a benchmark suite
suite = openml.study.get_suite("OpenML-CC18")  # Classification benchmark

# Iterate over tasks in the suite
for task_id in suite.tasks:
    task = openml.tasks.get_task(task_id)
    print(f"Task {task_id}: {task.get_dataset().name}")

# Run your model on the entire benchmark
from sklearn.ensemble import GradientBoostingClassifier

for task_id in suite.tasks[:5]:  # First 5 tasks
    task = openml.tasks.get_task(task_id)
    clf = GradientBoostingClassifier()
    run = openml.runs.run_model_on_task(clf, task)
    run.publish()`,
  },
  {
    language: "r",
    icon: "r",
    code: `library(OpenML)

# Get a benchmark suite
suite <- getOMLStudy(study = "OpenML-CC18")

# List tasks in the suite
task_ids <- suite$tasks$task.id

# Run experiments on benchmark
for (tid in task_ids[1:5]) {
  task <- getOMLTask(tid)
  # Run your model...
}`,
  },
];

export function APIPageContent() {
  const tocItems = [
    { id: "getting-started", title: "Getting Started", level: 2 },
    { id: "installation", title: "Installation", level: 3 },
    { id: "authentication", title: "Authentication", level: 3 },
    { id: "client-libraries", title: "Client Libraries", level: 2 },
    { id: "python", title: "Python", level: 3 },
    { id: "r-lang", title: "R", level: 3 },
    { id: "java", title: "Java", level: 3 },
    { id: "working-with-data", title: "Working with Data", level: 2 },
    { id: "datasets", title: "Datasets", level: 3 },
    { id: "tasks", title: "Tasks", level: 3 },
    { id: "runs", title: "Runs & Experiments", level: 3 },
    { id: "benchmarking", title: "Benchmarking", level: 2 },
    { id: "rate-limits", title: "Rate Limits", level: 2 },
    { id: "rest-api", title: "REST API", level: 2 },
    { id: "resources", title: "Additional Resources", level: 2 },
  ];

  return (
    <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative flex min-h-screen gap-8">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="text-xs">
                v1.0
              </Badge>
            </div>
            <h1 className="gradient-text mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              OpenML APIs
            </h1>
            <p className="text-muted-foreground mb-8 max-w-3xl text-xl">
              OpenML provides a unified interface to access machine learning
              resources across multiple programming languages. Whether
              you&apos;re exploring datasets, running experiments, or
              benchmarking algorithms, our APIs make it easy to integrate OpenML
              into your workflow.
            </p>

            {/* Stats in Hero */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Database,
                  title: "10,000+ Datasets",
                  description: "Access curated ML datasets with rich metadata",
                },
                {
                  icon: FlaskConical,
                  title: "50,000+ Tasks",
                  description:
                    "Pre-defined ML tasks with standardized evaluation",
                },
                {
                  icon: BarChart3,
                  title: "10M+ Runs",
                  description: "Reproducible experiments and benchmarks",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-card flex items-start gap-3 rounded-lg border p-4"
                >
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <item.icon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Getting Started */}
          <section id="getting-started" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Getting Started</h2>

            {/* Installation */}
            <div id="installation" className="mb-8 scroll-mt-20">
              <h3 className="mb-4 text-xl font-semibold">Installation</h3>
              <LanguageSelector examples={installExamples} />
            </div>

            {/* Authentication */}
            <div id="authentication" className="mb-8 scroll-mt-20">
              <h3 className="mb-4 text-xl font-semibold">Authentication</h3>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <Alert>
                    <Key className="h-4 w-4" />
                    <AlertTitle>API Key Required for Uploads</AlertTitle>
                    <AlertDescription>
                      Reading public data doesn&apos;t require authentication.
                      However, to upload datasets, runs, or access private
                      resources, you&apos;ll need an API key.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h4 className="font-medium">How to get your API key:</h4>
                    <ol className="text-muted-foreground space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                          1
                        </span>
                        <span>
                          <Link
                            href="/auth/sign-up"
                            className="text-primary hover:underline"
                          >
                            Create an OpenML account
                          </Link>{" "}
                          or{" "}
                          <Link
                            href="/auth/sign-in"
                            className="text-primary hover:underline"
                          >
                            sign in
                          </Link>{" "}
                          if you already have one
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                          2
                        </span>
                        <span>
                          Go to your{" "}
                          <Link
                            href="/auth/api-key"
                            className="text-primary hover:underline"
                          >
                            API Key page
                          </Link>{" "}
                          in your account settings
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                          3
                        </span>
                        <span>
                          Copy your API key and store it securely (never share
                          it publicly!)
                        </span>
                      </li>
                    </ol>
                  </div>

                  <APICodeBlock
                    code={`# Store your API key securely
# Option 1: Environment variable (recommended)
export OPENML_APIKEY="your_api_key_here"

# Option 2: Config file (~/.openml/config)
apikey = your_api_key_here

# Option 3: Set in code (not recommended for shared code)
import openml
openml.config.apikey = "your_api_key_here"`}
                    language="bash"
                    filename="Configuration"
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Client Libraries */}
          <section id="client-libraries" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Client Libraries</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Python */}
              <Card id="python" className="scroll-mt-20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-yellow-400 to-blue-500 shadow-sm">
                      <PythonIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Python</CardTitle>
                      <CardDescription>Most comprehensive API</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">scikit-learn</Badge>
                    <Badge variant="secondary">PyTorch</Badge>
                    <Badge variant="secondary">TensorFlow</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Full-featured Python client with integrations for popular ML
                    frameworks. Best choice for most users.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link
                        href="https://openml.github.io/openml-python/"
                        target="_blank"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Docs
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href="https://github.com/openml/openml-python"
                        target="_blank"
                      >
                        <GitBranch className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* R */}
              <Card id="r-lang" className="scroll-mt-20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-400 to-blue-600 shadow-sm">
                      <RCodeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>R</CardTitle>
                      <CardDescription>Statistical computing</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">mlr3</Badge>
                    <Badge variant="secondary">tidymodels</Badge>
                    <Badge variant="secondary">CRAN</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    R package with seamless integration for mlr3 and the R
                    machine learning ecosystem.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link href="https://docs.openml.org/r/" target="_blank">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Docs
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href="https://github.com/openml/openml-r"
                        target="_blank"
                      >
                        <GitBranch className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Java */}
              <Card id="java" className="scroll-mt-20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-orange-400 to-red-500 shadow-sm">
                      <JavaCodeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Java</CardTitle>
                      <CardDescription>JVM applications</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Weka</Badge>
                    <Badge variant="secondary">MOA</Badge>
                    <Badge variant="secondary">Maven</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Java connector for enterprise applications and Weka/MOA
                    integration.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link
                        href="https://docs.openml.org/ecosystem/Java/"
                        target="_blank"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Docs
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href="https://github.com/openml/openml-java"
                        target="_blank"
                      >
                        <GitBranch className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Working with Data */}
          <section id="working-with-data" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Working with Data</h2>

            {/* Datasets */}
            <div id="datasets" className="mb-8 scroll-mt-20">
              <h3 className="mb-4 text-xl font-semibold">Datasets</h3>
              <p className="text-muted-foreground mb-4">
                OpenML hosts thousands of curated ML datasets. Each dataset
                includes rich metadata, feature descriptions, and quality
                metrics.
              </p>
              <LanguageSelector examples={datasetExamples} />
            </div>

            {/* Tasks */}
            <div id="tasks" className="mb-8 scroll-mt-20">
              <h3 className="mb-4 text-xl font-semibold">Tasks</h3>
              <p className="text-muted-foreground mb-4">
                Tasks combine a dataset with a problem type (classification,
                regression, etc.) and evaluation procedure (cross-validation
                folds).
              </p>
              <LanguageSelector examples={taskExamples} />
            </div>

            {/* Runs */}
            <div id="runs" className="mb-8 scroll-mt-20">
              <h3 className="mb-4 text-xl font-semibold">Runs & Experiments</h3>
              <p className="text-muted-foreground mb-4">
                Runs capture the complete record of an ML experiment: the
                algorithm used, hyperparameters, predictions, and evaluation
                metrics.
              </p>
              <LanguageSelector examples={runExamples} />
            </div>
          </section>

          {/* Benchmarking */}
          <section id="benchmarking" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Benchmarking</h2>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  OpenML provides curated benchmark suites for standardized
                  algorithm evaluation. Run your models on established
                  benchmarks to compare with state-of-the-art methods.
                </p>

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      name: "OpenML-CC18",
                      description: "72 classification datasets",
                      tasks: 72,
                    },
                    {
                      name: "AutoML Benchmark",
                      description: "Standard AutoML evaluation",
                      tasks: 104,
                    },
                  ].map((suite) => (
                    <div
                      key={suite.name}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <h4 className="font-semibold">{suite.name}</h4>
                        <p className="text-muted-foreground text-sm">
                          {suite.description}
                        </p>
                      </div>
                      <Badge variant="outline">{suite.tasks} tasks</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <LanguageSelector examples={benchmarkExamples} />
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Rate Limits</h2>

            <Card>
              <CardContent className="pt-6">
                <Alert className="mb-4">
                  <Zap className="h-4 w-4" />
                  <AlertTitle>Fair Use Policy</AlertTitle>
                  <AlertDescription>
                    OpenML uses dynamic rate limiting to ensure fair access for
                    all users. If you encounter a 429 error, wait a moment and
                    retry.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm">Read operations</span>
                    <Badge variant="secondary">~1000 requests/hour</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm">Write operations</span>
                    <Badge variant="secondary">~100 requests/hour</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm">Bulk downloads</span>
                    <Badge variant="secondary">
                      Contact us for higher limits
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* REST API */}
          <section id="rest-api" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">REST API</h2>
            <p className="text-muted-foreground mb-4">
              For advanced users who need direct HTTP access, OpenML provides a
              comprehensive REST API. The API is language-agnostic and can be
              used from any environment.
            </p>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 space-y-2">
                  <p className="text-sm">
                    <strong>Base URL:</strong>{" "}
                    <code className="bg-muted rounded px-1">
                      https://www.openml.org/api/v1/
                    </code>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Supports both JSON and XML response formats. Authentication
                    via API key is required for write operations.
                  </p>
                </div>
                <Button asChild>
                  <Link href="https://www.openml.org/apis" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Swagger Documentation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Additional Resources */}
          <section id="resources" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Additional Resources</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: "Full Documentation",
                  description: "In-depth guides and tutorials",
                  href: "https://docs.openml.org/",
                },
                {
                  icon: GitBranch,
                  title: "GitHub",
                  description: "Source code and issues",
                  href: "https://github.com/openml",
                },
                {
                  icon: Terminal,
                  title: "REST API Reference",
                  description: "Swagger documentation",
                  href: "https://www.openml.org/apis",
                },
                {
                  icon: Database,
                  title: "Browse Datasets",
                  description: "Explore available datasets",
                  href: "/datasets",
                },
                {
                  icon: FlaskConical,
                  title: "Browse Tasks",
                  description: "Find ML tasks to solve",
                  href: "/tasks",
                },
                {
                  icon: Cpu,
                  title: "Browse Flows",
                  description: "Discover algorithms",
                  href: "/flows",
                },
              ].map((resource) => (
                <Link
                  key={resource.title}
                  href={resource.href}
                  target={
                    resource.href.startsWith("http") ? "_blank" : undefined
                  }
                  className="group bg-card hover:border-primary/50 flex items-start gap-4 rounded-lg border p-4 transition-all hover:shadow-md"
                >
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <resource.icon className="text-primary h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="group-hover:text-primary font-semibold">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {resource.description}
                    </p>
                  </div>
                  <ExternalLink className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Table of Contents */}
        <div className="hidden shrink-0 lg:block">
          <TableOfContents items={tocItems} />
        </div>
      </div>
    </div>
  );
}
