import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
        Page Not Found
      </h2>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
