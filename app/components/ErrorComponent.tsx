import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorComponent = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 w-full max-w-md border border-gray-300 dark:border-gray-700">
        <FaExclamationTriangle className="text-5xl text-red-600 dark:text-red-400 mb-6 animate-pulse" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
          Oops, something went wrong!
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 text-center mb-5">
          We encountered an issue. Don't worry, you can try refreshing the page.
        </p>
        <button
          onClick={handleRefresh}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
