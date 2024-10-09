// app/gallery/page.tsx

"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";

import { NormalizedArtwork } from "../../types/artwork";
import Gallery from "../../components/gallery";
import Pagination from "../../components/pagination";
import styles from "./gallery.module.css";

const ITEMS_PER_PAGE = 20;

const GalleryPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [filterMedium, setFilterMedium] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [artworks, setArtworks] = useState<NormalizedArtwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  const debounceSearch = useCallback(
    debounce((term: string) => setDebouncedSearch(term), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value);
  };

  useEffect(() => {
    return () => {
      debounceSearch.cancel(); // Clean up the debounce on unmount
    };
  }, [debounceSearch]);

  // Fetch artworks on client side
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch("/api/artworks");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data: NormalizedArtwork[] = await response.json();
        setArtworks(data);
      } catch (err: any) {
        console.error("Error fetching artworks:", err);
        setError(err.message || "Failed to fetch artworks.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Parse creation date string to a sortable number (e.g., year)
  // Handles various formats like "c. 1765", "1925-1935"
  const parseDate = (dateStr: string | null): number => {
    if (!dateStr) return 0;
    const yearMatch = dateStr.match(/(\d{4})/);
    return yearMatch ? parseInt(yearMatch[1], 10) : 0;
  };

  // Extract unique mediums for filter options
  const mediums = useMemo(() => {
    const mediumSet = new Set<string>();
    artworks.forEach((art) => {
      if (art.medium) mediumSet.add(art.medium);
    });
    return Array.from(mediumSet).sort();
  }, [artworks]);

  // Filter and sort artworks
  const filteredArtworks = useMemo(() => {
    let filtered = artworks;

    // Search by title or artist
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (art) =>
          art.title.toLowerCase().includes(lowerSearch) ||
          art.artist.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by medium
    if (filterMedium) {
      filtered = filtered.filter((art) => art.medium === filterMedium);
    }

    // Sort by creation date
    filtered = filtered.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [artworks, debouncedSearch, filterMedium, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
  const paginatedArtworks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArtworks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArtworks, currentPage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Art Gallery</h1>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by title or artist"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />

        <select
          value={filterMedium}
          onChange={(e) => setFilterMedium(e.target.value)}
          className={styles.select}
        >
          <option value="">All Mediums</option>
          {mediums.map((medium) => (
            <option key={medium} value={medium}>
              {medium}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className={styles.select}
        >
          <option value="asc">Date: Ascending</option>
          <option value="desc">Date: Descending</option>
        </select>
      </div>

      <Gallery artworks={paginatedArtworks} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default GalleryPage;
