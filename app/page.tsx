"use client";
import { Chip } from "@/components/Chip";
import { useEffect, useState } from "react";

export default function Home() {
  const [preferences, setPreferences] = useState<string[]>([]);

  const [classifications, setClassifications] = useState<string[]>([]);

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const response = await fetch("/api/classification");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: string[] = await response.json();
        setClassifications(data);
      } catch (error) {
        console.error("Error fetching classifications:", error);
      }
    };

    fetchClassifications();
  }, []);

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

      window.location.href = `/gallery?${queryParams}`;
    } catch (error) {
      console.error("Error navigating to gallery:", error);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 gap-16 font-geist">
      <div className="flex flex-col gap-8 items-center sm:items-start w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Exhibition Curator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Hello You</p>

        <div className="flex flex-col gap-7 w-full h-[512px] items-center overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col gap-7 px-4 py-5 w-full items-start">
            <p className="text-base text-gray-700 dark:text-gray-400">
              Select from categories or go straight to gallery to see all works:
            </p>
            <div className="flex flex-wrap gap-2">
              {classifications.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  onClick={(selected) => handleChipClick(category, selected)}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleNavigation()}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300 transition-colors"
        >
          Go to Gallery
        </button>
      </div>
    </div>
  );
}
