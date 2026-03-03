"use client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SectionContainer } from "@/components/layout/section-container";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  InteractiveCodeSnippet,
  CodeExample,
} from "@/components/interactive-code-snippet";
import { useTranslations } from "next-intl";

export function AccessibilitySection() {
  const t = useTranslations("home.accessibility");

  return (
    <SectionContainer id="explore" className="bg-muted/20">
      <div className="mb-8 text-center">
        <h1 className="from-foreground to-foreground/70 light:text-slate-950 mb-6 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight md:text-6xl dark:bg-[linear-gradient(15deg,#ec4899,#6366f1,#ec4899,#8b5cf6,#ec4899)] dark:bg-clip-text dark:text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-center text-3xl md:text-2xl md:text-pretty">
          {t("subtitle")}
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:grid md:grid-cols-2">
        {/* Website Option - 1/3 width on desktop */}
        <div className="w-full min-w-full flex-1 md:col-span-1">
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="mb-4 text-2xl">
                {t("webInterface.title")}
              </CardTitle>
              <CardDescription className="space-y-1.5 text-lg/7">
                <p>{t("webInterface.description")}</p>
                <ul className="mx-3 list-disc space-y-[0.2rem] pl-4 leading-7">
                  <li>{t("webInterface.features.0")}</li>
                  <li>{t("webInterface.features.1")}</li>
                  <li>{t("webInterface.features.2")}</li>
                </ul>
                <p>{t("webInterface.summary")}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="relative -mt-6 h-82">
              <Image
                src="/dataset-distribution-plot.jpg"
                alt="Diagram illustrating the scientific machine learning workflow and data lifecycle"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover p-6"
              />
            </CardContent>
            <CardFooter className="-mt-6 flex justify-end">
              <Link
                href="/datasets"
                className="text-primary flex items-center font-medium hover:underline"
              >
                {t("webInterface.button")} <ArrowRight className="ml-2" />
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Code Option - 2/3 width on desktop */}
        <div className="md:w-full] w-full min-w-full flex-1">
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="mb-4 text-2xl md:text-3xl">
                {t("codeApis.title")}
              </CardTitle>
              <CardDescription className="space-y-2 text-lg/7">
                <p className="mb-1">{t("codeApis.description")}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="h-auto">
              <InteractiveCodeSnippet
                examples={codeExamples}
                githubUrl="https://github.com/openml/openml-python"
                downloadUrl="https://docs.openml.org"
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link
                href="/datasets"
                className="text-primary flex items-center font-medium hover:underline"
              >
                {t("codeApis.button")} <ArrowRight className="ml-2" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SectionContainer>
  );
}

const codeExamples: CodeExample[] = [
  {
    language: "Python",
    iconName: "python",
    code: `import openml

# Load the diabetes dataset by ID
dataset = openml.datasets.get_dataset(37)
X, y, categorical_indicator, attribute_names = dataset.get_data(
  target=dataset.default_target_attribute
)

# Print dataset information
print(f"Dataset: {dataset.name}")
print(f"Features: {len(attribute_names)}")
print(f"Instances: {len(X)}")`,
  },
  {
    language: "R",
    iconName: "r",
    code: `library(OpenML)

# Load the diabetes dataset by ID
dataset <- getOMLDataSet(data.id = 37)

# Access the data
data <- dataset$data
target <- dataset$target.features

# Print dataset information
cat("Dataset:", dataset$desc$name, "\\n")
cat("Features:", ncol(data), "\\n")
cat("Instances:", nrow(data), "\\n")`,
  },
  {
    language: "Julia",
    iconName: "julia",
    code: `using OpenML

# Load the diabetes dataset by ID
dataset = OpenML.load(37)

# Access the data
X, y = dataset.data, dataset.target

# Print dataset information
println("Dataset: ", dataset.name)
println("Features: ", size(X, 2))
println("Instances: ", size(X, 1))`,
  },
  {
    language: "Java",
    iconName: "java",
    code: `import org.openml.apiconnector.*;
import org.openml.apiconnector.io.*;

// Initialize OpenML connector
OpenmlConnector client = new OpenmlConnector();

// Load the diabetes dataset by ID
DataSetDescription dataset = client.dataGet(37);

// Download and process the data
File dataFile = client.getDatasetFile(dataset);

System.out.println("Dataset: " + dataset.getName());
System.out.println("Format: " + dataset.getFormat());`,
  },
  {
    language: "C#",
    iconName: "csharp",
    code: `using OpenML;

// Initialize OpenML client
var client = new OpenMLConnector();

// Load the diabetes dataset by ID
var dataset = await client.GetDatasetAsync(37);

// Access the data
var data = await dataset.GetDataAsync();

// Print dataset information
Console.WriteLine($"Dataset: {dataset.Name}");
Console.WriteLine($"Features: {dataset.NumberOfFeatures}");
Console.WriteLine($"Instances: {dataset.NumberOfInstances}");`,
  },
  {
    language: "Jupyter",
    iconName: "jupyter",
    code: `# Install OpenML in Jupyter
!pip install openml

import openml

# Load dataset
dataset = openml.datasets.get_dataset(37)
X, y, _, _ = dataset.get_data(
  target=dataset.default_target_attribute
)

# Display dataset info
display(dataset)
print(f"Shape: {X.shape}")`,
  },
  {
    language: "TensorFlow",
    iconName: "tensorflow",
    code: `import openml
import tensorflow as tf

# Load dataset from OpenML
dataset = openml.datasets.get_dataset(37)
X, y, _, _ = dataset.get_data(
  target=dataset.default_target_attribute
)

# Convert to TensorFlow dataset
tf_dataset = tf.data.Dataset.from_tensor_slices((X, y))
tf_dataset = tf_dataset.batch(32)

print(f"Dataset ready for TensorFlow training")`,
  },
  {
    language: "mlr",
    iconName: "mlr",
    code: `library(mlr)
library(OpenML)

# Load dataset from OpenML
oml_data <- getOMLDataSet(data.id = 37)

# Create mlr task
task <- makeClassifTask(
data = oml_data$data,
target = oml_data$target.features
)

# Print task information
print(task)`,
  },
  {
    language: "Ruby",
    iconName: "ruby",
    code: `require 'openml'

# Initialize OpenML client
client = OpenML::Client.new

# Load the diabetes dataset by ID
dataset = client.dataset(37)

# Access dataset information
puts "Dataset: #{dataset.name}"
puts "Features: #{dataset.features.count}"
puts "Instances: #{dataset.instances}"`,
  },
];
