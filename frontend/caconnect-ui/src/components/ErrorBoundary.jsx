/**
 * ErrorBoundary.jsx
 * ─────────────────────────────────────────────────────────────────
 * React Error Boundary component for catching and handling errors:
 * - Catches JavaScript errors in component tree
 * - Provides user-friendly error messages
 * - Offers recovery options
 * - Logs errors for debugging
 */

import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

// CSS Styles
const css = `
  .error-boundary {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1e3a5f 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .error-container {
    max-width: 600px;
    text-align: center;
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 48px 32px;
    backdrop-filter: blur(10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 24px;
    color: #f77f00;
  }

  .error-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 16px;
    line-height: 1.2;
  }

  .error-description {
    font-size: 1rem;
    color: #7a8fa6;
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .error-details {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 32px;
    text-align: left;
  }

  .error-details-toggle {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #7a8fa6;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 16px;
  }

  .error-details-toggle:hover {
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .error-message {
    color: #ef4444;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    line-height: 1.5;
    word-break: break-all;
    margin-bottom: 16px;
  }

  .error-stack {
    color: #7a8fa6;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    line-height: 1.4;
    white-space: pre-wrap;
    max-height: 200px;
    overflow-y: auto;
    padding: 12px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  .error-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .error-btn {
    padding: 14px 28px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .error-btn-primary {
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
    border: none;
    color: #0a1628;
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.3);
  }

  .error-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(201, 168, 76, 0.45);
  }

  .error-btn-secondary {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  .error-btn-secondary:hover {
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .error-info {
    font-size: 0.8rem;
    color: #7a8fa6;
    margin-top: 24px;
    padding: 16px;
    background: rgba(201, 168, 76, 0.05);
    border: 1px solid rgba(201, 168, 76, 0.1);
    border-radius: 12px;
  }

  @media (max-width: 600px) {
    .error-container {
      padding: 32px 24px;
    }

    .error-title {
      font-size: 1.5rem;
    }

    .error-actions {
      flex-direction: column;
    }

    .error-btn {
      width: 100%;
      justify-content: center;
    }
  }
`;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to external service (in production)
    this.logErrorToService(error, errorInfo);
    
    // Store error details in state
    this.setState({
      error,
      errorInfo
    });
  }

  logErrorToService = (error, errorInfo) => {
    // In production, you would send this to an error reporting service
    // like Sentry, LogRocket, or your own logging endpoint
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Example: Send to logging service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // });

      // For now, just log to console
      console.error('Error logged:', errorData);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <style>{css}</style>
          <div className="error-boundary">
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              
              <h1 className="error-title">
                Oops! Something went wrong
              </h1>
              
              <p className="error-description">
                We're sorry, but something unexpected happened. 
                Our team has been notified and is working to fix this issue.
              </p>

              {this.state.error && (
                <>
                  <button
                    className="error-details-toggle"
                    onClick={this.toggleDetails}
                  >
                    {this.state.showDetails ? 'Hide' : 'Show'} Error Details
                  </button>
                  
                  {this.state.showDetails && (
                    <div className="error-details">
                      <div className="error-message">
                        <strong>Error:</strong> {this.state.error.toString()}
                      </div>
                      {this.state.errorInfo && (
                        <div className="error-stack">
                          <strong>Component Stack:</strong><br />
                          {this.state.errorInfo.componentStack}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="error-actions">
                <button
                  className="error-btn error-btn-primary"
                  onClick={this.handleRetry}
                >
                  🔄 Try Again
                </button>
                <button
                  className="error-btn error-btn-secondary"
                  onClick={this.handleGoHome}
                >
                  🏠 Go Home
                </button>
              </div>

              <div className="error-info">
                <strong>Need help?</strong><br />
                If this problem persists, please contact our support team at 
                <a href="mailto:support@caconnect.com" style={{ color: '#c9a84c', marginLeft: '4px' }}>
                  support@caconnect.com
                </a>
              </div>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper component for use with hooks
const ErrorBoundaryWrapper = ({ children }) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary navigate={navigate}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
export { ErrorBoundaryWrapper };
