import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { useExhibition } from "../contexts/ExhibitionContext";
import { NormalizedArtwork } from "@/types/artwork";

const Exhibition: React.FC = () => {
  const { exhibitionArtworks, removeFromExhibition } = useExhibition();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedArt, setSelectedArt] = useState<NormalizedArtwork | null>(
    null
  );

  const openModal = (art: NormalizedArtwork) => {
    setSelectedArt(art);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedArt(null);
  };

  return (
    <div>
      {exhibitionArtworks.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Your exhibition is empty. Add some artworks!
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {exhibitionArtworks.map((art) => (
            <div
              key={art.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform transform hover:-translate-y-1"
            >
              <div onClick={() => openModal(art)}>
                {art.image ? (
                  <Image
                    src={art.image}
                    alt={art.title}
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
                  />
                ) : (
                  <Image
                    src="/placeholder.png"
                    alt="Placeholder"
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {art.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Artist:</strong> {art.artist}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Medium:</strong> {art.medium}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Date:</strong> {art.date}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => removeFromExhibition(art.id)}
                  className="w-full py-2 rounded transition-colors bg-red-500 hover:bg-red-600 text-white"
                >
                  Remove from Exhibition
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedArt && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Artwork Details"
          className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg w-full max-w-lg sm:max-w-3xl mx-auto my-8 max-h-[90vh] overflow-y-auto"
          overlayClassName="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
          ariaHideApp={false}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-6 text-2xl sm:text-4xl font-bold text-gray-600 dark:text-gray-300 cursor-pointer focus:outline-none"
          >
            &times;
          </button>
          <ArtworkDetails artwork={selectedArt} />
        </Modal>
      )}
    </div>
  );
};

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
      </div>
    </div>
  );
};

export default Exhibition;
