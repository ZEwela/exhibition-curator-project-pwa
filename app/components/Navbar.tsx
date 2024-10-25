import Link from "next/link";

import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 md:px-20 bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/web-app-manifest-192x192.png"
            alt="Exhibition Curator"
            width={40}
            height={40}
            className="h-10 w-auto bg-white rounded-xl p-1"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/gallery"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          Gallery
        </Link>
        <Link
          href="/exhibition"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          Exhibition
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
