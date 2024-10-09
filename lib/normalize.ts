// lib/normalize.ts

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
  const dimensions = data.dimensions.framed
    ? `${data.dimensions.framed.height} x ${data.dimensions.framed.width} x ${
        data.dimensions.framed.depth || ""
      } m (Framed)`
    : data.dimensions.unframed
    ? `${data.dimensions.unframed.height} x ${data.dimensions.unframed.width} m (Unframed)`
    : null;

  return {
    id: `cleveland-${data.id}`,
    title: data.title || "Untitled",
    artist: data.artists_tags?.join(", ") || "Unknown",
    date: data.creation_date || null,
    medium: data.technique || null,
    dimensions: dimensions,
    department: data.department || null,
    culture: data.culture?.join(", ") || null,
    image: data.image_url || null, // Assuming image_url exists
    location: data.current_location || null,
    creditline: data.tombstone || null,
    description: data.tombstone || "",
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
  const dimensions = data.dated
    ? `${data.datebegin || ""} - ${data.dateend || ""}`
    : null;

  return {
    id: `harvard-${data.id}`,
    title: data.title || "Untitled",
    artist: artists,
    date: data.dated || null,
    medium: data.medium || null,
    dimensions: dimensions,
    department: data.department || null,
    culture: data.culture || null,
    image: data.primaryimageurl || null,
    location: null, // Harvard API doesn't provide location
    creditline: data.creditline || null,
    description: data.description || "",
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
