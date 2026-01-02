interface RunDetailsSectionProps {
  run: {
    parameters?: Array<{
      name: string;
      value: string;
    }>;
  };
}

export function RunDetailsSection({ run }: RunDetailsSectionProps) {
  if (!run.parameters || run.parameters.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No parameters available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left text-sm font-medium">Parameter</th>
            <th className="p-3 text-left text-sm font-medium">Value</th>
          </tr>
        </thead>
        <tbody>
          {run.parameters.map((param, index) => (
            <tr key={index} className="border-b">
              <td className="p-3 font-mono text-sm">{param.name}</td>
              <td className="p-3 font-mono text-sm">{param.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
