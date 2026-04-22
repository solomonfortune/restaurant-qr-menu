function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
}

export default LoadingSpinner;