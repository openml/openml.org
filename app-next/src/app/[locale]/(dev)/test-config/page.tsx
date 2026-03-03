"use client";

import { useEffect, useState } from "react";

export default function TestConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    // Read config from window.__ENV__
    if (typeof window !== "undefined" && (window as any).__ENV__) {
      setConfig((window as any).__ENV__);
    }
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Runtime Configuration Test</h1>

      <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Environment Variables</h2>

        {Object.keys(config).length === 0 ? (
          <p className="text-red-500">
            No configuration found! Check window.__ENV__
          </p>
        ) : (
          <div className="space-y-2">
            {Object.entries(config).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {key}
                </span>
                <span className="ml-4 font-mono text-sm text-gray-700 dark:text-gray-300">
                  {value || "(empty)"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
        <h3 className="mb-2 font-semibold">Testing Instructions:</h3>
        <ol className="list-inside list-decimal space-y-1 text-sm">
          <li>Check that the URLs above match your docker run -e flags</li>
          <li>
            Open DevTools (F12) → Console → type:{" "}
            <code className="bg-gray-200 px-1 dark:bg-gray-700">
              window.__ENV__
            </code>
          </li>
          <li>Verify the values are correct</li>
        </ol>
      </div>

      <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
        <h3 className="mb-2 font-semibold">Expected Values (Current Test):</h3>
        <ul className="space-y-1 text-sm">
          <li>✅ NEXT_PUBLIC_OPENML_API_URL: https://test.openml.org</li>
          <li>✅ NEXT_PUBLIC_ELASTICSEARCH_URL: https://test.openml.org/es</li>
          <li>✅ NEXT_PUBLIC_URL_MINIO: https://test.openml.org/data</li>
        </ul>
      </div>
    </div>
  );
}
