// Installation
export const InstallationExample = `using Pkg
Pkg.add("OpenML")`;

// Query and download data
export const DataExample = `using OpenML
using DataFrames

# List all datasets and their properties
ds = OpenML.list_datasets(output_format = DataFrame)

# Get dataset by ID
OpenML.describe_dataset(40996)

# Get the data itself as a dataframe (or otherwise)
table = OpenML.load(40996)
df = DataFrame(table)`;
