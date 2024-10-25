import React from "react";
import { FaSpinner } from "react-icons/fa";

export const Loading: React.FC<{
  loadingTitle: string;
  loadingText: string;
}> = ({ loadingTitle, loadingText }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-400 dark:from-gray-900 dark:via-gray-800 dark:to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-30 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 -left-1/4 top-1/4"></div>
        <div className="absolute w-72 h-72 bg-gradient-to-bl from-pink-500 to-red-400 opacity-40 rounded-full filter blur-2xl transform translate-x-1/3 translate-y-1/4 right-1/4"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-tl from-yellow-300 to-orange-500 opacity-50 rounded-full filter blur-2xl transform -translate-x-1/4 translate-y-1/3 -bottom-1/4"></div>
      </div>

      <div className="relative flex flex-col items-center p-8 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 rounded-3xl shadow-2xl transform transition-transform duration-500 hover:scale-105 w-full max-w-md backdrop-filter backdrop-blur-lg border border-gray-300 dark:border-gray-700 h-96">
        <FaSpinner className="animate-spin text-6xl text-indigo-600 dark:text-indigo-400 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
          {loadingTitle}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 text-center mb-5">
          {loadingText}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-300 italic text-center">
          Please hold on, we&apos;re curating the best for you...
        </p>
      </div>
    </div>
  );
};
