const LoadingSpinner = () => {
  return (
    // <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="fixed inset-0 z-140 absolute flex items-center justify-center bg-white/50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
    </div>
  );
};

export default LoadingSpinner;