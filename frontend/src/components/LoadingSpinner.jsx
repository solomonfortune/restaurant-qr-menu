const LoadingSpinner = ({ label = 'Loading...', fullScreen = false }) => {
  const classes = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-10';

  return (
    <div className={classes}>
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
        <p className="text-sm font-medium text-stone-600">{label}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
