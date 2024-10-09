"use client";
import { Chip } from "@/components/chip";
import { useRouter } from "next/navigation";
import { useState } from "react";

const exhibitionCategories = [
  "Contemporary Art",
  "Classical Art",
  "Photography Exhibitions",
  "Interactive Installations",
  "Historical Collections",
  "Nature and Wildlife",
  "Science and Technology",
  "Cultural Heritage",
  "Fashion and Textiles",
  "Sculpture",
  "Digital Art",
  "Street Art",
  "Printmaking",
  "Mixed Media",
  "Film and Video Art",
  "Installation Art",
  "Performance Art",
];

export default function Home() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<string[]>([]);

  const handleChipClick = (label: string, selected: boolean) => {
    setPreferences((prev) =>
      selected ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const handleNavigation = (path: string) => {
    console.log(preferences, path);

    router.push(path);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Exhibition Curator</h1>
        <p>Hello You</p>
        <div className="flex  flex-col gap-7 w-[342px] h-[512px] items-center scrollbar-hide overflow-y-scroll">
          <div className="flex flex-col gap-7 px-4 items-start py-5 ">
            <p className="text-body-regular">
              Select at least 3 categories you would be interested in
            </p>
            <div className="flex flex-wrap gap-2">
              {exhibitionCategories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  onClick={(selected) => handleChipClick(category, selected)}
                />
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => handleNavigation("/gallery")}>
          Go to Some Path
        </button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>Created by Ewelina Zawol</p>
      </footer>
    </div>
  );
}
