import React from "react";
import { FaSpinner } from "react-icons/fa";

export const Loading: React.FC<{
  loadingTitle: string;
  loadingText: string;
}> = ({ loadingTitle, loadingText }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 w-full max-w-md border border-gray-300 dark:border-gray-700">
        <FaSpinner className="animate-spin text-5xl text-indigo-600 dark:text-indigo-400 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
          {loadingTitle}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 text-center mb-5">
          {loadingText}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-300 italic text-center">
          Please hold on, we're curating the best for you...
        </p>
      </div>
    </div>
  );
};
