import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = [];

  const maxVisible = 5;
  let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
  let end = start + maxVisible - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - maxVisible + 1, 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return (
    <div className="flex justify-center gap-2 my-5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-md transition 
        bg-gray-200 dark:bg-gray-700 
        text-gray-700 dark:text-gray-300 
        hover:bg-gray-300 dark:hover:bg-gray-600 
        disabled:bg-gray-100 dark:disabled:bg-gray-800 
        disabled:text-gray-400 dark:disabled:text-gray-500 
        cursor-pointer disabled:cursor-not-allowed 
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md transition 
          ${
            page === currentPage
              ? "bg-blue-600 dark:bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-md transition 
        bg-gray-200 dark:bg-gray-700 
        text-gray-700 dark:text-gray-300 
        hover:bg-gray-300 dark:hover:bg-gray-600 
        disabled:bg-gray-100 dark:disabled:bg-gray-800 
        disabled:text-gray-400 dark:disabled:text-gray-500 
        cursor-pointer disabled:cursor-not-allowed 
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
