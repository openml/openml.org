// app-next/src/app/test-config/page.tsx
// Test page to verify runtime configuration works across environments

export default async function TestConfigPage() {
  // Server Component - reads env vars at RUNTIME
  const config = {
    apiUrl: process.env.API_URL || "https://www.openml.org",
    elasticsearchUrl:
      process.env.ELASTICSEARCH_URL || "https://www.openml.org/es",
    minioUrl: process.env.MINIO_URL || "https://www.openml.org/data",
    nodeEnv: process.env.NODE_ENV,
    // Show all env vars starting with API_, ELASTICSEARCH_, MINIO_
    allEnvVars: Object.entries(process.env)
      .filter(
        ([key]) =>
          key.startsWith("API_") ||
          key.startsWith("ELASTICSEARCH_") ||
          key.startsWith("MINIO_"),
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  };

  const timestamp = new Date().toISOString();

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1 style={{ color: "#2563eb" }}>🧪 Runtime Configuration Test</h1>

      <div
        style={{
          background: "#f1f5f9",
          padding: "1.5rem",
          borderRadius: "8px",
          marginTop: "1rem",
        }}
      >
        <h2>Configuration Values (Read at Runtime)</h2>
        <pre
          style={{
            background: "#1e293b",
            color: "#f1f5f9",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#fef3c7",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>⏰ Generated at:</strong> {timestamp}
        </p>
        <p>
          <strong>🐳 Docker Image:</strong> Same image for all environments
        </p>
        <p>
          <strong>🔧 Environment:</strong> {config.nodeEnv}
        </p>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#d1fae5",
          borderRadius: "8px",
        }}
      >
        <h3>✅ How to Test:</h3>
        <ol>
          <li>
            <strong>Build once:</strong> <code>docker build -t test:v1 .</code>
          </li>
          <li>
            <strong>Deploy to dev:</strong>{" "}
            <code>kubectl apply -f k8s/dev/</code>
          </li>
          <li>
            <strong>Visit:</strong> <code>test.openml.org/test-config</code> →
            See dev config
          </li>
          <li>
            <strong>Deploy to prod:</strong>{" "}
            <code>kubectl apply -f k8s/prod/</code>
          </li>
          <li>
            <strong>Visit:</strong> <code>www.openml.org/test-config</code> →
            See prod config
          </li>
          <li>
            <strong>Same Docker image, different configs!</strong> 🎉
          </li>
        </ol>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#e0e7ff",
          borderRadius: "8px",
        }}
      >
        <h3>🔍 What This Proves:</h3>
        <ul>
          <li>
            ✅ Environment variables are read at <strong>runtime</strong>, not
            build time
          </li>
          <li>✅ K8s ConfigMaps inject different values per environment</li>
          <li>✅ Same Docker image works across dev/staging/prod</li>
          <li>✅ No rebuild needed to change configuration</li>
        </ul>
      </div>
    </div>
  );
}
