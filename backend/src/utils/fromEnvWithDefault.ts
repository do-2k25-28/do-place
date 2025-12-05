import process from 'node:process';
export function fromEnvWithDefault(
  variableName: string,
  defaultValue: string,
  message?: string
): string {
  const env = process.env[variableName] as string;

  if (typeof env !== 'string') {
    if (typeof message === 'string') console.warn(message);

    return defaultValue;
  }

  return env;
}
