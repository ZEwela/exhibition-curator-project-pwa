import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { useExhibition } from "../contexts/ExhibitionContext";
import { NormalizedArtwork } from "@/types/artwork";
import ArtworkDetails from "./ArtworkDetails";

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
                  className="w-full py-2 rounded transition-colors bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
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

export default Exhibition;
