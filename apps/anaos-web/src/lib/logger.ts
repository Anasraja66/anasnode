type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatMessage(level: LogLevel, message: string, context?: any) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, context?: any) {
    console.log(this.formatMessage('info', message, context));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, context?: any) {
    console.warn(this.formatMessage('warn', message, context));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, context?: any) {
    console.error(this.formatMessage('error', message, context));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, context?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

export const logger = new Logger();
