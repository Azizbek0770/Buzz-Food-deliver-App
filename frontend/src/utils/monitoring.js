import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { measurePerformance } from './performance';

// Initialize Sentry
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    });
  }
};

// Custom logger
class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    // Add to local logs
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (process.env.NODE_ENV === 'development') {
      console[level](message, data);
    }

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      if (level === 'error') {
        Sentry.captureException(data.error || new Error(message));
      } else {
        Sentry.captureMessage(message, {
          level,
          extra: data,
        });
      }
    }
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, error) {
    this.log('error', message, { error });
  }

  debug(message, data) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

// Performance metrics
const metrics = {
  pageLoads: new Map(),
  apiCalls: new Map(),
  errors: new Map(),
  resources: new Map()
};

class PerformanceMonitor {
  constructor() {
    this.observers = new Set();
    this.isInitialized = false;
  }

  // Monitoring ni boshlash
  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Page load metrics
    this.observePageLoads();

    // API call metrics
    this.observeApiCalls();

    // Resource loading metrics
    this.observeResources();

    // Error metrics
    this.observeErrors();

    // Performance observer
    this.setupPerformanceObserver();
  }

  // Page load metrics ni kuzatish
  observePageLoads() {
    window.addEventListener('load', () => {
      const pageLoadTime = performance.now();
      const pathname = window.location.pathname;
      
      metrics.pageLoads.set(pathname, {
        timestamp: Date.now(),
        loadTime: pageLoadTime
      });

      this.notifyObservers('pageLoad', {
        pathname,
        loadTime: pageLoadTime
      });
    });
  }

  // API call metrics ni kuzatish
  observeApiCalls() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        this.recordApiCall(url, endTime - startTime, response.status);
        return response;
      } catch (error) {
        const endTime = performance.now();
        this.recordApiCall(url, endTime - startTime, 0, error);
        throw error;
      }
    };
  }

  // API call ni qayd qilish
  recordApiCall(url, duration, status, error = null) {
    const urlObj = new URL(url, window.location.origin);
    const endpoint = urlObj.pathname;

    const callData = {
      timestamp: Date.now(),
      duration,
      status,
      error: error ? error.message : null
    };

    if (!metrics.apiCalls.has(endpoint)) {
      metrics.apiCalls.set(endpoint, []);
    }
    metrics.apiCalls.get(endpoint).push(callData);

    this.notifyObservers('apiCall', {
      endpoint,
      ...callData
    });
  }

  // Resource loading metrics ni kuzatish
  observeResources() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.recordResourceTiming(entry);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  // Resource timing ni qayd qilish
  recordResourceTiming(entry) {
    const { name, initiatorType, duration } = entry;
    
    if (!metrics.resources.has(initiatorType)) {
      metrics.resources.set(initiatorType, []);
    }
    
    metrics.resources.get(initiatorType).push({
      url: name,
      duration,
      timestamp: Date.now()
    });

    this.notifyObservers('resource', {
      type: initiatorType,
      url: name,
      duration
    });
  }

  // Error metrics ni kuzatish
  observeErrors() {
    window.addEventListener('error', (event) => {
      this.recordError('runtime', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordError('promise', event.reason);
    });
  }

  // Error ni qayd qilish
  recordError(type, error) {
    if (!metrics.errors.has(type)) {
      metrics.errors.set(type, []);
    }

    metrics.errors.get(type).push({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now()
    });

    this.notifyObservers('error', {
      type,
      error
    });
  }

  // Performance observer ni sozlash
  setupPerformanceObserver() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.notifyObservers('performance', entry);
      });
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
  }

  // Kuzatuvchi qo'shish
  addObserver(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  // Kuzatuvchilarga xabar berish
  notifyObservers(type, data) {
    this.observers.forEach(observer => {
      try {
        observer(type, data);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });
  }

  // Metrics ni olish
  getMetrics() {
    return {
      pageLoads: Object.fromEntries(metrics.pageLoads),
      apiCalls: Object.fromEntries(metrics.apiCalls),
      resources: Object.fromEntries(metrics.resources),
      errors: Object.fromEntries(metrics.errors)
    };
  }

  // Metrics ni tozalash
  clearMetrics() {
    metrics.pageLoads.clear();
    metrics.apiCalls.clear();
    metrics.resources.clear();
    metrics.errors.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Error boundary for React components
export class ErrorBoundary extends Sentry.ErrorBoundary {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Xatolik yuz berdi</h1>
          <p>Iltimos, sahifani qayta yuklang yoki keyinroq urinib ko'ring</p>
          <button
            onClick={() => window.location.reload()}
            className="error-button"
          >
            Sahifani yangilash
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// API call monitoring
export const monitorApiCall = async (name, apiCall) => {
  try {
    performance.startMeasure(name);
    const result = await apiCall();
    performance.endMeasure(name);
    return result;
  } catch (error) {
    logger.error(`API Error: ${name}`, error);
    throw error;
  }
};

// User interaction monitoring
export const trackUserInteraction = (action, data = {}) => {
  logger.info('User Interaction', { action, ...data });
  
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    // Example: Google Analytics, Mixpanel, etc.
  }
}; 