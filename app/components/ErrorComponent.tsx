import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorComponent = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-red-300 via-purple-300 to-indigo-400 dark:from-gray-900 dark:via-gray-800 dark:to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-br from-pink-500 to-red-600 opacity-40 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 -left-1/3 top-1/4"></div>
        <div className="absolute w-72 h-72 bg-gradient-to-bl from-purple-500 to-blue-400 opacity-40 rounded-full filter blur-2xl transform translate-x-1/3 translate-y-1/4 right-1/4"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-tl from-yellow-400 to-orange-500 opacity-50 rounded-full filter blur-2xl transform -translate-x-1/4 translate-y-1/3 -bottom-1/4"></div>
      </div>

      <div className="relative flex flex-col items-center p-8 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 rounded-3xl shadow-2xl transform transition-transform duration-500 hover:scale-105 w-full max-w-md backdrop-filter backdrop-blur-lg border border-gray-300 dark:border-gray-700 h-96">
        <FaExclamationTriangle className="text-6xl text-red-600 dark:text-red-400 mb-6 animate-pulse" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
          Oops, something went wrong!
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 text-center mb-5">
          We encountered an issue. Don&apos;t worry, you can try refreshing the
          page.
        </p>
        <button
          onClick={handleRefresh}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-400 dark:focus:ring-red-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
