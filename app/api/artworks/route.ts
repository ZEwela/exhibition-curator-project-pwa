// app/api/artworks/route.ts

import { normalizeClevelandArt, normalizeHarvardArt } from "@/lib/normalize";
import {
  ClevelandArtResponse,
  HarvardArtResponse,
  NormalizedArtwork,
} from "@/types/artwork";
import axios from "axios";
import { NextResponse } from "next/server";

// API Endpoints and Keys
const CLEVELAND_API_URL =
  "https://openaccess-api.clevelandart.org/api/artworks";
const HARVARD_API_URL = "https://api.harvardartmuseums.org/object";
const HARVARD_API_KEY = process.env.HARVARD_ART_MUSEUMS_API;

const ARTWORKS_PER_PAGE = 20;

/**
 * Fetch artworks from Cleveland Art API
 * @returns Promise<NormalizedArtwork[]>
 */
const fetchClevelandArtworks = async (
  page: number
): Promise<{ artworks: NormalizedArtwork[]; total: number }> => {
  try {
    const response = await axios.get(CLEVELAND_API_URL, {
      params: {
        limit: ARTWORKS_PER_PAGE,
        skip: (page - 1) * ARTWORKS_PER_PAGE,
      },
    });

    const artworks = response.data.data
      .map((item: ClevelandArtResponse) => normalizeClevelandArt(item))
      .filter((art: NormalizedArtwork | null) => art !== null);

    return {
      artworks,
      total: response.data.info.total,
    };
  } catch (error) {
    console.error("Error fetching Cleveland artworks:", error);
    return { artworks: [], total: 0 };
  }
};

/**
 * Fetch artworks from Harvard Art Museums API
 * @returns Promise<NormalizedArtwork[]>
 */
const fetchHarvardArtworks = async (
  page: number
): Promise<{ artworks: NormalizedArtwork[]; total: number }> => {
  try {
    const response = await axios.get(HARVARD_API_URL, {
      params: {
        apikey: HARVARD_API_KEY,
        size: ARTWORKS_PER_PAGE,
        page: page,
      },
    });

    const artworks = response.data.records
      .map((record: HarvardArtResponse) => normalizeHarvardArt(record))
      .filter((art: NormalizedArtwork | null) => art !== null);

    return {
      artworks,
      total: response.data.info.totalrecords,
    };
  } catch (error) {
    console.error("Error fetching Harvard artworks:", error);
    return { artworks: [], total: 0 };
  }
};

/**
 * Fetch and combine artworks from both APIs
 * @returns Promise<NormalizedArtwork[]>
 */
const fetchCombinedArtworks = async (
  page: number
): Promise<{ artworks: NormalizedArtwork[]; total: number }> => {
  const [clevelandResponse, harvardResponse] = await Promise.all([
    fetchClevelandArtworks(page),
    fetchHarvardArtworks(page),
  ]);

  const combinedArtworks = [
    ...clevelandResponse.artworks,
    ...harvardResponse.artworks,
  ];

  const total = clevelandResponse.total + harvardResponse.total;

  return { artworks: combinedArtworks, total };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page"));

  try {
    const { artworks, total } = await fetchCombinedArtworks(page);
    const totalPages = Math.ceil(total / ARTWORKS_PER_PAGE);

    return NextResponse.json(
      {
        artworks,
        total,
        totalPages,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks." },
      { status: 500 }
    );
  }
}
