import { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter out cross-origin third-party script noise (Disqus / Clarity / Analytics / AdBlock)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Cross-origin script errors or adblocker blocks for Disqus/Clarity
    if (
      event.message === 'Script error.' ||
      (event.filename && (event.filename.includes('disqus') || event.filename.includes('clarity') || event.filename.includes('doubleclick')))
    ) {
      // Prevent noisy external tracking/widget errors from halting the application
      event.preventDefault();
      console.warn('Caught and silenced non-critical third-party script event:', event.message);
    }
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WealthBuilder Error Boundary caught error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111316] text-[#f3dfd1] flex items-center justify-center p-6 font-mono">
          <div className="max-w-lg w-full bg-[#1e2023] border border-[#414754] rounded-lg p-6 shadow-2xl">
            <div className="w-10 h-10 rounded bg-[#ff8c00]/20 text-[#ff8c00] flex items-center justify-center mb-4 font-bold">
              !
            </div>
            <h2 className="text-xl font-bold text-[#f3dfd1] mb-2">Application Notice</h2>
            <p className="text-sm text-[#ddc1ae] mb-4">
              A minor runtime error occurred. You can reload the application or reset the state.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#ff8c00] hover:bg-[#e07b00] text-[#111316] font-bold text-sm rounded cursor-pointer transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);


