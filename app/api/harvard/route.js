export async function GET(request) {
  const apiKey = process.env.HARVARD_ART_MUSEUMS_API;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API key is not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const response = await fetch(
      `https://api.harvardartmuseums.org/object?apikey=${apiKey}`
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      return new Response(
        JSON.stringify({
          error: `Error ${response.status}: ${response.statusText} - ${errorDetails}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
