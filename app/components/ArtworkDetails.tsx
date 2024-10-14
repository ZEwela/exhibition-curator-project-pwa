import { NormalizedArtwork } from "@/types/artwork";
import Image from "next/image";
import { useEffect, useState } from "react";
import ShareOptions from "./ShareOptions";

const ArtworkDetails: React.FC<{ artwork: NormalizedArtwork }> = ({
  artwork,
}) => {
  const [details, setDetails] = useState<NormalizedArtwork | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/artwork/${artwork.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch artwork details");
        }
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError("Error fetching artwork details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [artwork.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!details) return <div>No details available</div>;

  return (
    <div className="text-center">
      {details.image ? (
        <Image
          src={details.image}
          alt={details.title}
          width={600}
          height={600}
          className="mx-auto w-full h-auto max-w-sm sm:max-w-md object-contain"
        />
      ) : (
        <Image
          src="/placeholder.png"
          alt="Placeholder"
          width={600}
          height={600}
          className="mx-auto w-full h-auto max-w-sm sm:max-w-md object-contain"
        />
      )}
      <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white mt-4">
        {details.title}
      </h2>
      <div className="mt-4 text-left text-gray-700 dark:text-gray-400">
        <p>
          <strong>Artist:</strong> {details.artist}
        </p>
        <p>
          <strong>Medium:</strong> {details.medium}
        </p>
        <p>
          <strong>Type:</strong> {details.type}
        </p>
        <p>
          <strong>Date:</strong> {details.date}
        </p>
        <p>
          <strong>Department:</strong> {details.department}
        </p>
        <p>
          <strong>Culture:</strong> {details.culture}
        </p>
        <p>
          <strong>Creditline:</strong> {details.creditline}
        </p>
        <p>
          <strong>Description:</strong> {details.description}
        </p>
        <p>
          <strong>Source:</strong> {details.source}{" "}
          <a
            href={details.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Check details
          </a>
        </p>
        <ShareOptions artwork={artwork} />
      </div>
    </div>
  );
};

export default ArtworkDetails;
