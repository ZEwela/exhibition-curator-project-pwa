import { normalizeClevelandArt, normalizeHarvardArt } from "@/lib/normalize";
import { NormalizedArtwork } from "@/types/artwork";
import axios from "axios";
import { NextResponse } from "next/server";

const CLEVELAND_API_URL =
  "https://openaccess-api.clevelandart.org/api/artworks";
const HARVARD_API_URL = "https://api.harvardartmuseums.org/object";
const HARVARD_API_KEY = process.env.HARVARD_ART_MUSEUMS_API;

const ARTWORKS_PER_PAGE = 20;
const ARTWORKS_PER_API = ARTWORKS_PER_PAGE / 2;

const clevelandAxios = axios.create({ baseURL: CLEVELAND_API_URL });
const harvardAxios = axios.create({
  baseURL: HARVARD_API_URL,
  params: { apikey: HARVARD_API_KEY },
});

interface FetchParams {
  page: number;
  search?: string;
  sortBy?: "medium" | "date";
  sortOrder?: "asc" | "desc";
  classifications?: string[];
}

interface APIResponse {
  artworks: NormalizedArtwork[];
  total: number;
}

async function fetchClevelandArtworks(
  fetchParams: FetchParams
): Promise<APIResponse> {
  const baseParams: Record<string, string | number> = {
    limit: 50,
    skip: (fetchParams.page - 1) * ARTWORKS_PER_API,
  };

  if (fetchParams.search) baseParams.q = fetchParams.search;
  if (fetchParams.sortBy === "medium") baseParams.sort = "technique";
  else if (fetchParams.sortBy === "date") baseParams.sort = "creation_date";
  if (fetchParams.sortOrder) baseParams.sort_order = fetchParams.sortOrder;

  let allArtworks: NormalizedArtwork[] = [];
  let totalArtworks = 0;

  if (fetchParams.classifications && fetchParams.classifications.length > 0) {
    const types = fetchParams.classifications.flatMap((c) => c.split("|"));
    for (const type of types) {
      const response = await clevelandAxios.get("", {
        params: { ...baseParams, type },
      });
      const artworks = (response.data.data || [])
        .map(normalizeClevelandArt)
        .filter(
          (art: NormalizedArtwork | null): art is NormalizedArtwork =>
            art !== null
        );
      allArtworks = allArtworks.concat(artworks);
      totalArtworks += response.data.info?.total || 0;
    }
  } else {
    const response = await clevelandAxios.get("", { params: baseParams });
    allArtworks = (response.data.data || [])
      .map(normalizeClevelandArt)
      .filter(
        (art: NormalizedArtwork | null): art is NormalizedArtwork =>
          art !== null
      );
    totalArtworks = response.data.info?.total || 0;
  }

  return {
    artworks: allArtworks.slice(0, ARTWORKS_PER_API),
    total: totalArtworks,
  };
}

async function fetchHarvardArtworks(
  fetchParams: FetchParams
): Promise<APIResponse> {
  const params: Record<string, string | number> = {
    size: ARTWORKS_PER_API,
    page: fetchParams.page,
  };

  if (fetchParams.search) params.q = fetchParams.search;
  if (fetchParams.sortBy === "medium") params.sort = "technique";
  else if (fetchParams.sortBy === "date") params.sort = "datebegin";
  if (fetchParams.sortOrder) params.sortorder = fetchParams.sortOrder;
  if (fetchParams.classifications && fetchParams.classifications.length > 0) {
    params.classification = fetchParams.classifications.join("|");
  }
  const response = await harvardAxios.get("", { params });
  const artworks = (response.data.records || [])
    .map(normalizeHarvardArt)
    .filter(
      (art: NormalizedArtwork | null): art is NormalizedArtwork => art !== null
    );

  return {
    artworks: artworks.slice(0, ARTWORKS_PER_API),
    total: response.data.info?.totalrecords || 0,
  };
}

async function fetchCombinedArtworks(
  fetchParams: FetchParams
): Promise<APIResponse> {
  const [clevelandResponse, harvardResponse] = await Promise.all([
    fetchClevelandArtworks(fetchParams),
    fetchHarvardArtworks(fetchParams),
  ]);

  const combinedArtworks = [
    ...clevelandResponse.artworks,
    ...harvardResponse.artworks,
  ];

  // Client-side sorting
  if (fetchParams.sortBy) {
    combinedArtworks.sort((a, b) => {
      const parseDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return 0;

        // Remove "c." (circa) and other non-numeric prefixes
        dateStr = dateStr.replace(/^c\.\s*/i, "").trim();

        // Handle BCE range, e.g., "6500-5000 BCE"
        const bceRangeMatch = dateStr.match(/(\d+)-(\d+)\s*BCE/i);
        if (bceRangeMatch) {
          // Return the earlier year in the BCE range as a negative number
          return -parseInt(bceRangeMatch[2], 10);
        }

        // Handle BCE single year, e.g., "5000 BCE"
        const bceSingleMatch = dateStr.match(/(\d+)\s*BCE/i);
        if (bceSingleMatch) {
          return -parseInt(bceSingleMatch[1], 10);
        }

        // Handle centuries/millennia, e.g., "6th-5th millennium BCE"
        const millenniumMatch = dateStr.match(
          /(\d+)[a-z]*-(\d+)[a-z]* millennium BCE/i
        );
        if (millenniumMatch) {
          // Use the earlier millennium, converted to negative years (e.g., -6000)
          return -parseInt(millenniumMatch[2], 10) * 1000;
        }

        const centuryMatch = dateStr.match(/(\d+)[a-z]* century BCE/i);
        if (centuryMatch) {
          // Convert the century to an approximate year, e.g., "6th century BCE" -> -600
          return -parseInt(centuryMatch[1], 10) * 100;
        }

        // Handle CE range, e.g., "500-600 CE"
        const ceRangeMatch = dateStr.match(/(\d+)-(\d+)\s*CE/i);
        if (ceRangeMatch) {
          return parseInt(ceRangeMatch[1], 10); // Use the earlier year
        }

        // Handle CE single year, e.g., "500 CE"
        const ceSingleMatch = dateStr.match(/(\d+)\s*CE/i);
        if (ceSingleMatch) {
          return parseInt(ceSingleMatch[1], 10);
        }

        // Handle general range (without BCE or CE), e.g., "6500-5000"
        const generalRangeMatch = dateStr.match(/(\d+)-(\d+)/);
        if (generalRangeMatch) {
          return parseInt(generalRangeMatch[1], 10); // Use the earlier year
        }

        // Handle general single year, e.g., "500"
        const generalSingleMatch = dateStr.match(/(\d+)/);
        if (generalSingleMatch) {
          return parseInt(generalSingleMatch[1], 10);
        }

        return new Date(dateStr).getTime();
      };

      const dateA = parseDate(a.date ?? undefined); // Convert null to undefined
      const dateB = parseDate(b.date ?? undefined); // Convert null to undefined

      return dateA - dateB;
    });

    if (fetchParams.sortOrder === "desc") {
      combinedArtworks.reverse();
    }
  }

  return {
    artworks: combinedArtworks.slice(0, ARTWORKS_PER_PAGE),
    total: clevelandResponse.total + harvardResponse.total,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const search = url.searchParams.get("search") || undefined;
  const sortBy = url.searchParams.get("sortBy") as
    | "medium"
    | "date"
    | undefined;
  const sortOrder = url.searchParams.get("sortOrder") as
    | "asc"
    | "desc"
    | undefined;
  const classifications =
    url.searchParams.get("classifications")?.split(",") || undefined;

  try {
    const fetchParams: FetchParams = {
      page,
      search,
      sortBy,
      sortOrder,
      classifications,
    };
    const { artworks, total } = await fetchCombinedArtworks(fetchParams);

    const totalPages = Math.ceil(total / ARTWORKS_PER_PAGE);

    return NextResponse.json(
      { artworks, total, totalPages, currentPage: page },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks." },
      { status: 500 }
    );
  }
}
