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

/**
 * Fetch artworks from Cleveland Art API
 * @returns Promise<NormalizedArtwork[]>
 */
const fetchClevelandArtworks = async (): Promise<NormalizedArtwork[]> => {
  try {
    const response = await axios.get(CLEVELAND_API_URL, {
      params: {
        limit: 20,
      },
    });

    const artworks = response.data.data
      .map((item: ClevelandArtResponse) => normalizeClevelandArt(item))
      .filter((art: NormalizedArtwork | null) => art !== null);

    return artworks;
  } catch (error) {
    console.error("Error fetching Cleveland artworks:", error);
    return [];
  }
};

/**
 * Fetch artworks from Harvard Art Museums API
 * @returns Promise<NormalizedArtwork[]>
 */
const fetchHarvardArtworks = async (): Promise<NormalizedArtwork[]> => {
  try {
    const response = await axios.get(HARVARD_API_URL, {
      params: {
        apikey: HARVARD_API_KEY,
        size: 20,
      },
    });

    const artworks = response.data.records
      .map((record: HarvardArtResponse) => normalizeHarvardArt(record))
      .filter((art: NormalizedArtwork | null) => art !== null);

    return artworks;
  } catch (error) {
    console.error("Error fetching Harvard artworks:", error);
    return [];
  }
};

/**
 * Fetch and combine artworks from both APIs
 * @returns Promise<NormalizedArtwork[]>
 */
const fetchCombinedArtworks = async (): Promise<NormalizedArtwork[]> => {
  const [clevelandArt, harvardArt] = await Promise.all([
    fetchClevelandArtworks(),
    fetchHarvardArtworks(),
  ]);

  return [...clevelandArt, ...harvardArt];
};

export async function GET() {
  try {
    const artworks = await fetchCombinedArtworks();

    return NextResponse.json(artworks, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks." },
      { status: 500 }
    );
  }
}
