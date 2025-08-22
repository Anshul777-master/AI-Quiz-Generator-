import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Consulting with the AI mastermind...",
  "Crafting challenging questions...",
  "Polishing the multiple choices...",
  "Making sure the 'false' is truly false...",
  "Assembling your unique challenge...",
  "Just a few more moments...",
];

const LoadingSpinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin border-t-transparent"></div>
      <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This AI magic takes a moment.</p>
    </div>
  );
};

export default LoadingSpinner;