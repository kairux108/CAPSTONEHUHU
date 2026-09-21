const LoadingSpinner = ({
  text = "Loading...",
}) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-500" />

      <p className="mt-4 text-sm font-semibold text-slate-400">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;