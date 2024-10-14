import { normalizeClevelandArt, normalizeHarvardArt } from "@/lib/normalize";
import { NormalizedArtwork } from "@/types/artwork";
import axios, { AxiosInstance } from "axios";
import { NextResponse } from "next/server";

const CLEVELAND_API_URL =
  "https://openaccess-api.clevelandart.org/api/artworks";
const HARVARD_API_URL = "https://api.harvardartmuseums.org/object";
const HARVARD_API_KEY = process.env.HARVARD_ART_MUSEUMS_API;

const ARTWORKS_PER_PAGE = 20;

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
  classifications?: string;
}

const fetchArtworks = async <T>(
  axiosInstance: AxiosInstance,
  params: Record<string, string | number | undefined>,
  normalizeFunction: (item: T) => NormalizedArtwork | null,
  fetchParams: FetchParams
): Promise<{ artworks: NormalizedArtwork[]; total: number }> => {
  try {
    if (axiosInstance === clevelandAxios) {
      if (fetchParams.search) {
        params.q = fetchParams.search;
      }
      if (fetchParams.sortBy === "medium") {
        params.sort = "technique";
      } else if (fetchParams.sortBy === "date") {
        params.sort = "sortable_date";
      }
      if (fetchParams.sortOrder) {
        params.sort_order = fetchParams.sortOrder;
      }
      if (fetchParams.classifications) {
        params.type = fetchParams.classifications;
      }
    } else if (axiosInstance === harvardAxios) {
      if (fetchParams.search) {
        params.q = fetchParams.search;
      }
      if (fetchParams.sortBy === "medium") {
        params.sort = "technique";
      } else if (fetchParams.sortBy === "date") {
        params.sort = "datebegin";
      }
      if (fetchParams.sortOrder) {
        params.sort = `${params.sort} ${fetchParams.sortOrder}`;
      }
      if (fetchParams.classifications) {
        params.classification = fetchParams.classifications;
      }
    }

    const response = await axiosInstance.get("", { params });
    const artworks = response.data.data || response.data.records;

    return {
      artworks: artworks
        .map(normalizeFunction)
        .filter((art: NormalizedArtwork | null) => art !== null),
      total: response.data.info?.total || response.data.info?.totalrecords || 0,
    };
  } catch (error) {
    console.error(`Error fetching artworks:`, error);
    return { artworks: [], total: 0 };
  }
};

const fetchCombinedArtworks = async (
  fetchParams: FetchParams
): Promise<{ artworks: NormalizedArtwork[]; total: number }> => {
  const [clevelandResponse, harvardResponse] = await Promise.all([
    fetchArtworks(
      clevelandAxios,
      {
        limit: ARTWORKS_PER_PAGE,
        skip: (fetchParams.page - 1) * ARTWORKS_PER_PAGE,
      },
      normalizeClevelandArt,
      fetchParams
    ),
    fetchArtworks(
      harvardAxios,
      { size: ARTWORKS_PER_PAGE, page: fetchParams.page },
      normalizeHarvardArt,
      fetchParams
    ),
  ]);

  const combinedArtworks = [
    ...clevelandResponse.artworks,
    ...harvardResponse.artworks,
  ];

  if (fetchParams.sortBy) {
    combinedArtworks.sort((a, b) => {
      if (fetchParams.sortBy === "medium") {
        return (a.medium || "").localeCompare(b.medium || "");
      } else if (fetchParams.sortBy === "date") {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      }
      return 0;
    });

    if (fetchParams.sortOrder === "desc") {
      combinedArtworks.reverse();
    }
  }

  const clevelandTotal = clevelandResponse.total || 0;
  const harvardTotal = harvardResponse.total || 0;
  const total = clevelandTotal + harvardTotal;
  return {
    artworks: combinedArtworks,
    total: total,
  };
};

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

  const classifications = url.searchParams.get("classifications") || undefined;

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
      {
        artworks,
        total,
        totalPages,
        currentPage: page,
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
