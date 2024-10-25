"use client";

import React, { useState, useEffect, Suspense } from "react";
import CustomSelect, { Option } from "@/app/components/CustomSelect";
import { SingleValue } from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import Gallery from "@/app/components/Gallery";
import { NormalizedArtwork } from "@/types/artwork";
import { useTheme } from "../components/ThemeProvider";
import { Loading } from "../components/Loading";
import { ErrorComponent } from "../components/ErrorComponent";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ApiResponse {
  artworks: NormalizedArtwork[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const GalleryPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = (searchParams.get("sortBy") as "medium" | "date") || "date";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
  const search = searchParams.get("search") || "";
  const classifications = searchParams.get("classifications") || "";

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/artworks?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&classifications=${classifications}`,
    fetcher
  );

  const updateQueryParams = (newParams: Record<string, string>) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });
    router.push(`?${updatedParams.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    updateQueryParams({ search: "", page: "1" });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateQueryParams({ search: searchTerm, page: "1" });
  };

  const handleSortChange = (selected: SingleValue<Option>) => {
    if (selected) {
      const [newSortBy, newSortOrder] = selected.value.split("-");
      updateQueryParams({
        sortBy: newSortBy,
        sortOrder: newSortOrder,
        page: "1",
      });
    }
  };

  if (error) {
    return <ErrorComponent />;
  }

  if (isLoading) {
    return (
      <Loading
        loadingTitle={"Loading artwork details..."}
        loadingText={"Please wait a moment while we fetch the information."}
      />
    );
  }

  const { artworks = [], totalPages = 1 } = data || {};

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Gallery</h1>

      <div className="flex flex-col items-center gap-6 mb-8 w-full">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-center justify-between w-full max-w-lg bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-shadow duration-300 ease-in-out"
        >
          <label htmlFor="search" className="sr-only">
            Search by keyword
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by keyword"
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition duration-200 ease-in-out"
          />
          <div className="flex mt-2 sm:mt-0 sm:ml-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-400"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleClearSearch}
              className="ml-2 px-2 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-400"
              aria-label="Clear Search"
            >
              Clear
            </button>
          </div>
        </form>

        <CustomSelect
          options={[
            { value: "date-asc", label: "Date: Ascending" },
            { value: "date-desc", label: "Date: Descending" },
            { value: "medium-asc", label: "Medium: A-Z" },
            { value: "medium-desc", label: "Medium: Z-A" },
          ]}
          value={{
            value: `${sortBy}-${sortOrder}`,
            label: `${sortBy}: ${
              sortOrder === "asc" ? "Ascending" : "Descending"
            }`,
          }}
          onChange={handleSortChange}
          theme={theme}
        />
      </div>

      <Gallery artworks={artworks} totalPages={totalPages} />
    </div>
  );
};

const GalleryPageWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <GalleryPage />
    </Suspense>
  );
};

export default GalleryPageWithSuspense;
