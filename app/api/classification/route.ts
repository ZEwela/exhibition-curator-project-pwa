import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.HARVARD_ART_MUSEUMS_API;

interface Classification {
  objectcount: number;
  name: string;
  id: number;
  lastupdate: string;
  classificationid: number;
}

interface ApiResponse {
  info: {
    totalrecordsperquery: number;
    totalrecords: number;
    pages: number;
    page: number;
    next?: string;
    prev?: string;
    responsetime: string;
  };
  records: Classification[];
}

export async function GET() {
  try {
    let allClassifications: Classification[] = [];
    let page = 1;
    let totalPages: number;

    do {
      const response = await axios.get<ApiResponse>(
        `https://api.harvardartmuseums.org/classification`,
        {
          params: {
            apikey: API_KEY,
            page: page,
            size: 100, // Increase this to reduce the number of API calls
          },
        }
      );
      const data = response.data;

      allClassifications = allClassifications.concat(data.records);
      totalPages = data.info.pages;
      page++;
    } while (page <= totalPages);

    const classificationLabels = allClassifications.map((item) => item.name);

    return NextResponse.json(classificationLabels, { status: 200 });
  } catch (error) {
    console.error("Error fetching classifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
