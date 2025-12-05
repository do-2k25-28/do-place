type LogLevel = 'info' | 'debug' | 'warn' | 'error';

export class Logger {
  public constructor(
    private label: string,
    private readonly color: string,
  ) {}

  public info(...data: any[]) {
    this.log('info', ...data);
  }

  public debug(...data: any[]) {
    this.log('debug', ...data);
  }

  public warn(...data: any[]) {
    this.log('warn', ...data);
  }

  public error(...data: any[]) {
    this.log('error', ...data);
  }

  private log(level: LogLevel, ...data: any) {
    console[level](`%c[${this.label}]`, `color: ${this.color};`, ...data);
  }
}
