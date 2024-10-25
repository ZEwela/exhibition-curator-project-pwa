"use client";

import { Chip } from "@/app/components/Chip";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useState } from "react";
import { Loading } from "./components/Loading";
import { ErrorComponent } from "./components/ErrorComponent";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<string[]>([]);

  const {
    data: classifications,
    error,
    isLoading,
  } = useSWR<string[]>("/api/classification", fetcher);

  const handleChipClick = (label: string, selected: boolean) => {
    setPreferences((prev) =>
      selected ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const handleNavigation = () => {
    try {
      const queryParams = new URLSearchParams({
        classifications: preferences.join("|"),
      }).toString();

      router.push(`/gallery?${queryParams}`);
    } catch (error) {
      console.error("Error navigating to gallery:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20 gap-16 font-geist">
      <div className="flex flex-col gap-8 items-center w-full">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Exhibition Curator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome, Art Enthusiast!
        </p>
        <p className="text-base text-gray-700 dark:text-gray-400">
          Select from categories or go straight to the gallery to see all works:
        </p>

        {error || isLoading ? (
          <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-3xl shadow-2xl relative overflow-hidden h-96 flex justify-center items-center">
            {error && !isLoading && <ErrorComponent />}
            {isLoading && !error && (
              <Loading
                loadingTitle={"Preparing categories"}
                loadingText={"Adjusting categories for you"}
              />
            )}
          </div>
        ) : !isLoading && !error ? (
          <div className="flex flex-col gap-7 w-full items-center overflow-y-scroll scrollbar-hide">
            <div className="flex flex-col gap-7 px-4 py-5 w-full items-start">
              <div className="flex flex-wrap gap-2 justify-center">
                {classifications?.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    onClick={(selected) => handleChipClick(category, selected)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <button
        onClick={() => handleNavigation()}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300 transition-colors"
      >
        Go to Gallery
      </button>
    </div>
  );
}
