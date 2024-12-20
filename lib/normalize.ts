import {
  NormalizedArtwork,
  ClevelandArtResponse,
  HarvardArtResponse,
} from "../types/artwork";

/**
 * Normalize Cleveland Art API data
 * @param data - Single artwork object from Cleveland API
 * @returns NormalizedArtwork
 */
export const normalizeClevelandArt = (
  data: ClevelandArtResponse
): NormalizedArtwork => {
  const artists =
    data.creators?.map((creator) => creator.description).join(", ") ||
    "Unknown";

  return {
    id: `cleveland-${data.id}`,
    title: data.title || "Untitled",
    artist: artists,
    date: data.creation_date || null,
    medium: data.technique || null,
    department: data.department || null,
    culture: data.culture?.join(", ") || null,
    image: data.images?.web?.url || null,
    location: data.current_location || null,
    creditline: data.tombstone || null,
    description: data.description || "",
    type: data.type,
    source_url: data.url,

    source: "Cleveland Museum of Art",
  };
};

/**
 * Normalize Harvard Art Museums API data
 * @param data - Single artwork object from Harvard API
 * @returns NormalizedArtwork
 */
export const normalizeHarvardArt = (
  data: HarvardArtResponse
): NormalizedArtwork => {
  const artists =
    data.people?.map((person) => person.name).join(", ") || "Unknown";

  return {
    id: `harvard-${data.id}`,
    title: data.title || "Untitled",
    artist: artists,
    date: data.dated || null,
    medium: data.medium || null,
    department: data.department || null,
    culture: data.culture || null,
    image: data.primaryimageurl || null,
    location: null,
    creditline: data.creditline || null,
    description: data.description || "",
    type: data.classification,
    source_url: data.url,
    source: "Harvard Art Museums",
  };
};

/**
 * Function to normalize any artwork API response based on the source
 * @param data - Single artwork object from any API
 * @param source - String indicating the API source
 * @returns NormalizedArtwork | null
 */
export const normalizeArtwork = (
  data: ClevelandArtResponse | HarvardArtResponse,
  source: string
): NormalizedArtwork | null => {
  switch (source) {
    case "Cleveland Museum of Art":
      return normalizeClevelandArt(data as ClevelandArtResponse);
    case "Harvard Art Museums":
      return normalizeHarvardArt(data as HarvardArtResponse);
    default:
      console.warn(`Unknown source: ${source}`);
      return null;
  }
};
