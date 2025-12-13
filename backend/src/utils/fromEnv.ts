import process from 'node:process';

export type FromEnvWithDefaultOptions<T> = {
  /**
   * Fallback to this value is none is found.
   */
  defaultValue?: T;
  /**
   * Warning message to display when falling back
   * to the default value. If unset, no message
   * will be printed.
   */
  warningMessage?: string;
  /**
   * Whether or not to read the content of the file
   * located `${variableName}_FILE` if `${variableName}`
   * does not exist.
   * @default false
   * @example
   * `index.ts`:
   * ```ts
   * const test = fromEnv('TEST', {
   *   fileExtension: true
   * });
   * console.log('content of test:', test);
   * ```
   * Bash:
   * ```bash
   * echo myTestVar > myTestFile.txt
   * unset TEST # Make sure the TEST env var doesn't exist
   * export TEST_FILE=./myTestFile.txt
   * node index.js
   * # content of test: myTestVar
   * ```
   */
  fileExtension?: boolean;
  type?: (value: string) => T;
  /**
   * Whether or not to allow falling back
   * to the default value in a production
   * environment.
   *
   * @default false
   */
  allowDefaultValueInProd?: boolean;
};

export function fromEnv<T = string>(
  variableName: string,
  options: FromEnvWithDefaultOptions<T> = {}
): T {
  const env = process.env[variableName];
  const fileEnv = process.env[`${variableName}_FILE`];

  // @ts-ignore Typescript doesn't know the default type is string apparently
  const type: (value: string) => T = options.type ?? ((value: string) => value);

  if (typeof env === 'string') return type(env);

  if (options.fileExtension === true && typeof fileEnv === 'string') {
    const file = Deno.readTextFileSync(fileEnv);
    return type(file.trim());
  }

  if (options.defaultValue !== undefined) {
    if (
      process.env['MODE'] === 'production' &&
      options.allowDefaultValueInProd !== true
    ) {
      console.error(
        `Usage of default value for environment variable ${variableName} in production is forbidden. Please provide a value.`
      );
      process.exit(1);
    }

    if (typeof options.warningMessage === 'string')
      console.warn(options.warningMessage);

    return options.defaultValue;
  }

  throw new Error(`Value for environment variable ${variableName} not found.`);
}

export function Boolean(value: string): boolean {
  if (value === 'true' || value === '1') return true;
  return false;
}
