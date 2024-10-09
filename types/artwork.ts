export interface NormalizedArtwork {
  id: string;
  title: string;
  artist: string;
  date: string | null;
  medium: string | null;
  dimensions: string | null;
  department: string | null;
  culture: string | null;
  image: string | null;
  location: string | null;
  creditline: string | null;
  description?: string;
  source: string; // Indicates the API source
}

export interface ClevelandArtResponse {
  id: number;
  title: string;
  creation_date: string;
  artists_tags: string[];
  technique: string;
  dimensions: {
    framed?: {
      height: number;
      width: number;
      depth?: number;
    };
    unframed?: {
      height: number;
      width: number;
    };
  };
  department: string;
  culture: string[];
  current_location: string;
  tombstone: string;
  image_url?: string; // Assuming Cleveland API provides image URLs
}

export interface HarvardArtResponse {
  id: number;
  title: string;
  people?: { name: string }[];
  dated: string;
  technique: string;
  classification: string;
  culture: string;
  department: string;
  division: string;
  medium: string | null;
  datebegin: number | null;
  dateend: number | null;
  primaryimageurl: string | null;
  creditline: string | null;
  description?: string | null;
}
