import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error,
    info
  ) {
    console.error(
      "CURA Error:",
      error,
      info
    );
  }

  render() {
    if (
      this.state.hasError
    ) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#f4f8fb] p-6">
          <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 text-center shadow-lg">
            <h1 className="text-2xl font-extrabold text-[#153a5d]">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              CURA encountered an unexpected error.
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-[#3185e8] px-5 py-3 text-sm font-bold text-white"
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

export default ErrorBoundary;