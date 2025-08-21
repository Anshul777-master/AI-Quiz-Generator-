
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin border-t-transparent"></div>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Generating your quiz...</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">This might take a moment.</p>
    </div>
  );
};

export default LoadingSpinner;
