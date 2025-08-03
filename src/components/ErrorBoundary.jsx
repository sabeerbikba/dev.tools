import { Component } from "react";
import NavBar from "./Nav";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PWA App Error:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.props.locationKey !== prevProps.locationKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <NavBar />
          <div className="fixed inset-0 flex items-center justify-center flex-col text-center p-8 ml-[210px]">
            {this.state.error?.message.startsWith(
              "Failed to fetch dynamically imported module"
            ) ? (
              <p className="text-white p-3 text-xl">
                You're offline. Check your internet connection and reload the
                page.
              </p>
            ) : (
              <p className="text-white p-3 text-xl">
                Something went wrong. Please try reloading the page.
              </p>
            )}
            <p className="text-red-400">Error: "{this.state.error?.message}"</p>
            <button
              className="block p-1 px-3 mt-7 border border-blue-700 text-white/90 rounded-sm"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
