interface ParameterSetting {
  name: string;
  value: string | number | boolean | null;
}

interface Run {
  parameter_setting?: ParameterSetting[];
}

interface RunParametersSectionProps {
  run: Run;
}

export function RunParametersSection({ run }: RunParametersSectionProps) {
  const parameters = run.parameter_setting || [];

  if (parameters.length === 0) {
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
          {parameters.map((param: any, index: number) => (
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
