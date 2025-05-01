

// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualizează state-ul pentru a afișa UI de eroare
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Poți să loghezi eroarea
    console.error("Eroare prinsă de ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center my-10 mx-auto max-w-md p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <h2 className="text-xl font-bold mb-3">Oops! Ceva nu a funcționat corect.</h2>
          <p className="mb-4">Aplicația a întâmpinat o eroare neașteptată.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Reîncarcă pagina
          </button>
          <details className="mt-4 text-left">
            <summary className="cursor-pointer p-2 font-medium">Detalii eroare (pentru dezvoltatori)</summary>
            <p className="p-2 mt-2 bg-gray-100 rounded text-red-600 overflow-auto">
              {this.state.error && this.state.error.toString()}
            </p>
            <pre className="p-2 mt-2 bg-gray-100 rounded text-gray-700 text-xs overflow-auto whitespace-pre-wrap">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;