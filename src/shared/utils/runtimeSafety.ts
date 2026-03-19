export const isBrowser = typeof window !== 'undefined';
export const isBrowserProduction = isBrowser && process.env.NODE_ENV === 'production';

type ConsoleMethod = 'debug' | 'error' | 'info' | 'log' | 'warn';

const safeConsoleCall = (method: ConsoleMethod, ...args: unknown[]) => {
  if (isBrowserProduction || typeof console === 'undefined') {
    return;
  }

  console[method](...args);
};

export const browserConsole = {
  debug: (...args: unknown[]) => safeConsoleCall('debug', ...args),
  error: (...args: unknown[]) => safeConsoleCall('error', ...args),
  info: (...args: unknown[]) => safeConsoleCall('info', ...args),
  log: (...args: unknown[]) => safeConsoleCall('log', ...args),
  warn: (...args: unknown[]) => safeConsoleCall('warn', ...args),
};

export const ensureClientContext = <T>(
  value: T | null | undefined,
  fallback: T,
  message: string,
): T => {
  if (value !== null && value !== undefined) {
    return value;
  }

  if (!isBrowserProduction) {
    throw new Error(message);
  }

  return fallback;
};

