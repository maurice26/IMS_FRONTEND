import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0f0f',
          color: '#fff',
          flexDirection: 'column',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(45deg, #8e24aa, #6a1b9a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Something went wrong
          </h1>
          <p style={{ maxWidth: '500px', marginBottom: '2rem', opacity: 0.8 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #8e24aa, #6a1b9a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(138, 36, 170, 0.4)'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

