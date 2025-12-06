import React from "react";

function AuthPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-4xl font-bold">
        Avatar OpenML user
      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
        <code>{`trainer.plot_all_metrics()
openml.config.apikey = ''
run = op.add_experiment_info_to_run(run=run, trainer=trainer) 
run.publish()`}</code>
      </pre>
    </div>
  );
}

export default AuthPage;
