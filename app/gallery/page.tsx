"use client";

import React, { useState, useEffect, Suspense } from "react";

import CustomSelect, { Option } from "@/app/components/CustomSelect";
import { SingleValue } from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import Gallery from "@/app/components/Gallery";
import Pagination from "@/app/components/Pagination";
import { NormalizedArtwork } from "@/types/artwork";

interface ApiResponse {
  artworks: NormalizedArtwork[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const GalleryPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [artworks, setArtworks] = useState<NormalizedArtwork[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const sortBy = (searchParams.get("sortBy") as "medium" | "date") || "date";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams(searchParams);
        const response = await fetch(`/api/artworks?${queryParams}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        setArtworks(data.artworks);
        setTotalPages(data.totalPages);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching artworks:", err);
          setError(err.message);
        } else {
          console.error("Unknown error fetching artworks:", err);
          setError("Failed to fetch artworks.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
        Art Gallery
      </h1>

      <div className="flex flex-wrap gap-4 justify-center mb-8 w-full">
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 min-w-[250px] max-w-[400px]"
        >
          <input
            type="text"
            placeholder="Search by title or artist"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
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
        />
      </div>

      <Gallery artworks={artworks} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) =>
          updateQueryParams({ page: newPage.toString() })
        }
      />
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
