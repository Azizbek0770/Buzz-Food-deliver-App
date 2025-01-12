import * as Sentry from '@sentry/react';
import { logger } from './monitoring';

// Error types
export const ErrorTypes = {
  NETWORK: 'network',
  AUTH: 'auth',
  VALIDATION: 'validation',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
};

// Error severities
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Error handler class
class ErrorHandler {
  constructor() {
    this.errorListeners = new Set();
  }

  // Add error listener
  addListener(listener) {
    this.errorListeners.add(listener);
  }

  // Remove error listener
  removeListener(listener) {
    this.errorListeners.delete(listener);
  }

  // Handle error
  handleError(error, type = ErrorTypes.UNKNOWN, severity = ErrorSeverity.MEDIUM) {
    const errorInfo = this.normalizeError(error, type, severity);

    // Log error
    logger.error(errorInfo.message, errorInfo);

    // Notify listeners
    this.notifyListeners(errorInfo);

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        tags: {
          type: errorInfo.type,
          severity: errorInfo.severity,
        },
        extra: errorInfo.data,
      });
    }

    return errorInfo;
  }

  // Normalize error object
  normalizeError(error, type, severity) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      type,
      severity,
      message: error.message || 'An error occurred',
      stack: error.stack,
      data: {},
    };

    // Handle different error types
    switch (type) {
      case ErrorTypes.NETWORK:
        errorInfo.data = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method,
        };
        break;

      case ErrorTypes.VALIDATION:
        errorInfo.data = {
          fields: error.fields || {},
          value: error.value,
        };
        break;

      case ErrorTypes.AUTH:
        errorInfo.data = {
          code: error.code,
          userId: error.userId,
        };
        break;

      case ErrorTypes.API:
        errorInfo.data = {
          endpoint: error.endpoint,
          params: error.params,
          response: error.response?.data,
        };
        break;

      case ErrorTypes.UI:
        errorInfo.data = {
          component: error.component,
          props: error.props,
          state: error.state,
        };
        break;

      default:
        if (error.data) {
          errorInfo.data = error.data;
        }
    }

    return errorInfo;
  }

  // Notify error listeners
  notifyListeners(errorInfo) {
    this.errorListeners.forEach(listener => {
      try {
        listener(errorInfo);
      } catch (error) {
        console.error('Error in error listener:', error);
      }
    });
  }

  // Handle API errors
  handleApiError(error) {
    if (!error.response) {
      return this.handleError(error, ErrorTypes.NETWORK, ErrorSeverity.HIGH);
    }

    const status = error.response.status;
    let type = ErrorTypes.API;
    let severity = ErrorSeverity.MEDIUM;

    switch (status) {
      case 400:
        type = ErrorTypes.VALIDATION;
        severity = ErrorSeverity.LOW;
        break;
      case 401:
      case 403:
        type = ErrorTypes.AUTH;
        severity = ErrorSeverity.HIGH;
        break;
      case 404:
        severity = ErrorSeverity.LOW;
        break;
      case 500:
        severity = ErrorSeverity.CRITICAL;
        break;
    }

    return this.handleError(error, type, severity);
  }

  // Handle validation errors
  handleValidationError(error) {
    return this.handleError(error, ErrorTypes.VALIDATION, ErrorSeverity.LOW);
  }

  // Handle UI errors
  handleUIError(error, component) {
    const enhancedError = {
      ...error,
      component,
    };
    return this.handleError(enhancedError, ErrorTypes.UI, ErrorSeverity.MEDIUM);
  }

  // Clear error listeners
  clearListeners() {
    this.errorListeners.clear();
  }
}

export const errorHandler = new ErrorHandler();

// Error boundary HOC
export const withErrorBoundary = (Component, options = {}) => {
  return class ErrorBoundaryWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      errorHandler.handleUIError(error, {
        name: Component.displayName || Component.name,
        errorInfo,
      });
    }

    render() {
      if (this.state.hasError) {
        if (options.fallback) {
          return options.fallback;
        }

        return (
          <div className="error-boundary">
            <h3>Xatolik yuz berdi</h3>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="error-button"
            >
              Qayta urinish
            </button>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
};

// Xatoliklarni saqlash uchun
const errorLog = [];
const MAX_LOG_SIZE = 100;

class ErrorTracker {
  constructor() {
    this.listeners = new Set();
  }

  // Xatolikni qayd qilish
  handleError(error, type = ErrorTypes.UNKNOWN, context = {}) {
    const errorInfo = {
      type,
      timestamp: new Date().toISOString(),
      message: error.message || 'Noma\'lum xatolik',
      stack: error.stack,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context
      }
    };

    // Xatolikni logga qo'shish
    errorLog.unshift(errorInfo);
    if (errorLog.length > MAX_LOG_SIZE) {
      errorLog.pop();
    }

    // Tinglovchilarga xabar berish
    this.notifyListeners(errorInfo);

    // Agar development muhitida bo'lsa, konsolga chiqarish
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', errorInfo);
    }

    // Backend ga yuborish
    this.sendToBackend(errorInfo);
  }

  // API xatoliklarini qayd qilish
  handleApiError(error) {
    const type = this.getErrorType(error);
    const context = {
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    };

    this.handleError(error, type, context);
  }

  // Xatolik turini aniqlash
  getErrorType(error) {
    if (!error.response) {
      return ErrorTypes.NETWORK;
    }

    const status = error.response.status;
    if (status === 401 || status === 403) {
      return ErrorTypes.AUTH;
    }
    if (status === 422 || status === 400) {
      return ErrorTypes.VALIDATION;
    }
    if (status >= 500) {
      return ErrorTypes.SERVER;
    }
    return ErrorTypes.UNKNOWN;
  }

  // Tinglovchi qo'shish
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Tinglovchilarga xabar berish
  notifyListeners(errorInfo) {
    this.listeners.forEach(listener => {
      try {
        listener(errorInfo);
      } catch (error) {
        console.error('Error in error listener:', error);
      }
    });
  }

  // Backend ga yuborish
  async sendToBackend(errorInfo) {
    try {
      const response = await fetch('/api/errors/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorInfo)
      });

      if (!response.ok) {
        console.error('Error sending error log to backend:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to send error log:', error);
    }
  }

  // Xatoliklar logini olish
  getErrorLog() {
    return [...errorLog];
  }

  // Logni tozalash
  clearErrorLog() {
    errorLog.length = 0;
  }
}

export const errorTracker = new ErrorTracker(); 