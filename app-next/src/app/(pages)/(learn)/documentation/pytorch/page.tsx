import React from "react";

export default function PytorchDocPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-4xl font-bold">
        PyTorch Extension for OpenML Python
      </h1>

      <p className="mb-6 text-lg">
        PyTorch extension for openml-python API. This library provides a simple
        way to run your PyTorch models on OpenML tasks.
      </p>

      <div className="mb-6 border-l-4 border-blue-500 bg-blue-50 p-4">
        <p>
          For a more native experience, PyTorch itself provides OpenML
          integrations for some tasks. You can find more information{" "}
          <a href="#" className="text-blue-600 hover:underline">
            here
          </a>
          .
        </p>
      </div>

      <h2 className="mb-4 text-3xl font-semibold">Installation Instructions</h2>

      <p className="mb-4">
        While this project does exist on PyPI, while everything is being
        finalized, it is recommended to install the package directly from the
        repository.
      </p>

      <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>pip install git+https://github.com/openml/openml-pytorch -U</code>
      </pre>

      <p className="mb-4">
        PyPI link:{" "}
        <a
          href="https://pypi.org/project/openml-pytorch/"
          className="text-blue-600 hover:underline"
        >
          https://pypi.org/project/openml-pytorch/
        </a>
      </p>

      <p className="mb-2">Set the API key for OpenML from the command line:</p>

      <pre className="mb-8 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>openml configure apikey &lt;your API key&gt;</code>
      </pre>

      <h2 className="mb-4 text-3xl font-semibold">Usage</h2>

      <h3 className="mb-3 text-2xl font-semibold">
        Load Data from OpenML and Train a Model
      </h3>

      <pre className="mb-8 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`# Import libraries
from sklearn.model_selection import train_test_split
from typing import Any
from tqdm import tqdm

from openml_pytorch import GenericDataset

# Get dataset by ID and split into train and test
dataset = openml.datasets.get_dataset(20)
X, y, _, _ = dataset.get_data(target=dataset.default_target_attribute)
X = X.to_numpy(dtype=np.float32)  
y = y.to_numpy(dtype=np.int64)    
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=1, stratify=y)

# Dataloaders
ds_train = GenericDataset(X_train, y_train)
ds_test = GenericDataset(X_test, y_test)
dataloader_train = torch.utils.data.DataLoader(ds_train, batch_size=64, shuffle=True)
dataloader_test = torch.utils.data.DataLoader(ds_test, batch_size=64, shuffle=False)

# Model Definition
class TabularClassificationModel(torch.nn.Module):
    def __init__(self, input_size, output_size):
        super(TabularClassificationModel, self).__init__()
        self.fc1 = torch.nn.Linear(input_size, 128)
        self.fc2 = torch.nn.Linear(128, 64)
        self.fc3 = torch.nn.Linear(64, output_size)
        self.relu = torch.nn.ReLU()
        self.softmax = torch.nn.Softmax(dim=1)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.relu(x)
        x = self.fc3(x)
        x = self.softmax(x)
        return x

# Train the model. Feel free to replace this with your own training pipeline. 
trainer = BasicTrainer(
    model = TabularClassificationModel(X_train.shape[1], len(np.unique(y_train))),
    loss_fn = torch.nn.CrossEntropyLoss(),
    opt = torch.optim.Adam,
    dataloader_train = dataloader_train,
    dataloader_test = dataloader_test,
    device= torch.device("mps")
)
trainer.fit(10)`}</code>
      </pre>

      <h3 className="mb-3 text-2xl font-semibold">
        More Complex Image Classification Example
      </h3>

      <h4 className="mb-2 text-xl font-semibold">Import openML libraries</h4>

      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`# openml imports
from openml_pytorch.callbacks import TestCallback
from openml_pytorch.metrics import accuracy
from openml_pytorch.trainer import convert_to_rgb

# pytorch imports
from torch.utils.tensorboard.writer import SummaryWriter
from torchvision.transforms import Compose, Resize, ToPILImage, ToTensor, Lambda

# other imports

# set up logging
openml.config.logger.setLevel(logging.DEBUG)
op.config.logger.setLevel(logging.DEBUG)
warnings.simplefilter(action='ignore')`}</code>
      </pre>

      <h4 className="mb-2 text-xl font-semibold">Data</h4>
      <h5 className="mb-2 text-lg font-semibold">
        Define image transformations
      </h5>

      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`transform = Compose(
    [
        ToPILImage(),  # Convert tensor to PIL Image to ensure PIL Image operations can be applied.
        Lambda(convert_to_rgb),  # Convert PIL Image to RGB if it's not already.
        Resize((64, 64)),  # Resize the image.
        ToTensor(),  # Convert the PIL Image back to a tensor.
    ]
)`}</code>
      </pre>

      <h5 className="mb-2 text-lg font-semibold">
        Configure the Data Module and Choose a Task
      </h5>

      <p className="mb-2 italic">
        Make sure the data is present in the file_dir directory, and the
        filename_col is correctly set along with this column correctly pointing
        to where your data is stored.
      </p>

      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`data_module = op.OpenMLDataModule(
    type_of_data="image",
    file_dir="datasets",
    filename_col="image_path",
    target_mode="categorical",
    target_column="label",
    batch_size=64,
    transform=transform,
)

# Download the OpenML task for tiniest imagenet
task = openml.tasks.get_task(363295)`}</code>
      </pre>

      <h4 className="mb-2 text-xl font-semibold">Model</h4>

      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`model = torchvision.models.resnet18(num_classes=200)`}</code>
      </pre>

      <h4 className="mb-2 text-xl font-semibold">
        Train your model on the data
      </h4>

      <p className="mb-2 italic">
        Note that by default, OpenML runs a 10 fold cross validation on the
        data. You cannot change this for now.
      </p>

      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`import torch

trainer = op.OpenMLTrainerModule(
    experiment_name= "Tiny ImageNet",
    data_module=data_module,
    verbose=True,
    epoch_count=2,
    metrics= [accuracy],
    # remove the TestCallback when you are done testing your pipeline. Having it here will make the pipeline run for a very short time.
    callbacks=[
        # TestCallback,
    ],
    opt = torch.optim.Adam,
)
op.config.trainer = trainer
run = openml.runs.run_model_on_task(model, task, avoid_duplicate_runs=False)`}</code>
      </pre>

      <h4 className="mb-2 text-xl font-semibold">
        View information about your run
      </h4>
      <h5 className="mb-2 text-lg font-semibold">
        Learning rate and loss plot
      </h5>

      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`trainer.plot_loss()
trainer.plot_lr()
trainer.plot_all_metrics()`}</code>
      </pre>

      <h5 className="mb-2 text-lg font-semibold">Class labels</h5>

      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`trainer.model_classes`}</code>
      </pre>

      <h4 className="mb-2 text-xl font-semibold">Model Visualization</h4>

      <p className="mb-2">
        Sometimes you may want to visualize the model. You can either use netron
        or tensorboard for this purpose.
      </p>

      <h5 className="mb-2 text-lg font-semibold">Netron</h5>

      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`trainer.export_to_netron()`}</code>
      </pre>

      <h5 className="mb-2 text-lg font-semibold">Tensorboard</h5>

      <p className="mb-2">
        By default, openml will log the tensorboard logs in the tensorboard_logs
        directory. You can view the logs by running{" "}
        <code className="rounded bg-gray-200 px-2 py-1">
          tensorboard --logdir tensorboard_logs
        </code>{" "}
        in the terminal.
      </p>

      <h4 className="mt-6 mb-2 text-xl font-semibold">
        Publish your model to OpenML
      </h4>

      <p className="mb-2">
        This is optional, but publishing your model to OpenML will allow you to
        track your experiments and compare them with others. Make sure to set
        your apikey first. You can find your apikey on your OpenML account page.
      </p>

      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`trainer.plot_all_metrics()
openml.config.apikey = ''
run = op.add_experiment_info_to_run(run=run, trainer=trainer) 
run.publish()`}</code>
      </pre>
    </div>
  );
}
