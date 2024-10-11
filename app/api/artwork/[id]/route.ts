import { NextResponse } from "next/server";
import { normalizeClevelandArt, normalizeHarvardArt } from "@/lib/normalize";
import {
  ClevelandArtResponse,
  HarvardArtResponse,
  NormalizedArtwork,
} from "@/types/artwork";

interface Params {
  id: string;
}

type NormalizeClevelandArtFunction = (
  data: ClevelandArtResponse
) => NormalizedArtwork | null;
type NormalizeHarvardArtFunction = (
  data: HarvardArtResponse
) => NormalizedArtwork | null;

export async function GET(request: Request, { params }: { params: Params }) {
  const id = params.id;
  const [source, artId] = id.split("-");

  try {
    let apiUrl: string;
    let normalizeFunction:
      | NormalizeClevelandArtFunction
      | NormalizeHarvardArtFunction;

    if (source === "cleveland") {
      apiUrl = `https://openaccess-api.clevelandart.org/api/artworks/${artId}`;
      normalizeFunction = normalizeClevelandArt;
    } else if (source === "harvard") {
      apiUrl = `https://api.harvardartmuseums.org/object/${artId}?apikey=${process.env.HARVARD_ART_MUSEUMS_API}`;
      normalizeFunction = normalizeHarvardArt;
    } else {
      return NextResponse.json(
        { error: "Invalid artwork source" },
        { status: 400 }
      );
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch artwork data" },
        { status: 404 }
      );
    }

    const data = await response.json();

    const normalizedArtwork = normalizeFunction(data.data || data);

    if (!normalizedArtwork) {
      return NextResponse.json(
        { error: "Failed to normalize artwork data" },
        { status: 500 }
      );
    }

    return NextResponse.json(normalizedArtwork);
  } catch (error) {
    console.error("Error fetching artwork details:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork details" },
      { status: 500 }
    );
  }
}
