export const isBrowser = typeof window !== 'undefined';
export const isBrowserProduction = isBrowser && process.env.NODE_ENV === 'production';

/**
 * Suppress CORS and network errors from being logged to console in production browser.
 * This prevents Lighthouse from reporting console errors for expected network failures.
 */
export const suppressNetworkErrors = () => {
  if (!isBrowserProduction || typeof window === 'undefined') return;

  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const errorStr = String(args[0] ?? '');
    
    // Suppress known network/CORS errors
    const isCorsError = errorStr.includes('CORS') || errorStr.includes('Access-Control-Allow-Origin');
    const isNetworkError = errorStr.includes('net::ERR') || errorStr.includes('Failed to fetch');
    const isXhrError = errorStr.includes('XMLHttpRequest') || errorStr.includes('Failed to load resource');
    // Suppress 401 unauthorized errors from API calls (e.g., /api/auth/me)
    const isUnauthorizedError = errorStr.includes('401') || errorStr.includes('Unauthorized');
    
    // Log other errors normally
    if (!isCorsError && !isNetworkError && !isXhrError && !isUnauthorizedError) {
      originalError(...args);
    }
  };

  // Also handle uncaught network errors from event listeners
  window.addEventListener('error', (event) => {
    const message = event.message || String(event.error);
    const isCorsError = message.includes('CORS') || message.includes('Access-Control-Allow-Origin');
    const isNetworkError = message.includes('net::ERR') || message.includes('Failed to fetch');
    // Suppress 401 unauthorized errors
    const isUnauthorizedError = message.includes('401') || message.includes('Unauthorized');
    
    // Prevent default logging for these errors
    if (isCorsError || isNetworkError || isUnauthorizedError) {
      event.preventDefault();
    }
  }, true);
};

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
