import { NormalizedArtwork } from "@/types/artwork";
import Image from "next/image";
import ShareOptions from "./ShareOptions";

const ArtworkDetails: React.FC<{ artwork: NormalizedArtwork }> = ({
  artwork,
}) => {
  return (
    <div className="text-center max-w-2xl mx-auto px-4">
      {artwork.image ? (
        <Image
          src={artwork.image}
          alt={artwork.title}
          width={600}
          height={600}
          className="mx-auto w-full h-auto max-w-sm sm:max-w-md object-contain rounded-lg shadow-lg"
        />
      ) : (
        <Image
          src="/placeholderWithText.png"
          alt="Placeholder"
          width={600}
          height={600}
          className="mx-auto w-full h-auto max-w-sm sm:max-w-md object-contain rounded-lg shadow-lg"
        />
      )}

      <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 dark:text-white mt-4">
        {artwork.title}
      </h2>

      <div className="mt-6 text-left text-gray-700 dark:text-gray-400 space-y-2">
        <p className="text-base">
          <strong>Artist:</strong> {artwork.artist}
        </p>
        <p className="text-base">
          <strong>Medium:</strong> {artwork.medium}
        </p>
        <p className="text-base">
          <strong>Type:</strong> {artwork.type}
        </p>
        <p className="text-base">
          <strong>Date:</strong> {artwork.date}
        </p>
        <p className="text-base">
          <strong>Department:</strong> {artwork.department}
        </p>
        <p className="text-base">
          <strong>Culture:</strong> {artwork.culture}
        </p>
        <p className="text-base">
          <strong>Credit Line:</strong> {artwork.creditline}
        </p>
        <p className="text-base">
          <strong>Description:</strong> {artwork.description}
        </p>

        <p className="text-base">
          <strong>Source:</strong> {artwork.source}{" "}
          {artwork.source_url && (
            <a
              href={artwork.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Check details
            </a>
          )}
        </p>

        <ShareOptions artwork={artwork} />
      </div>
    </div>
  );
};

export default ArtworkDetails;
