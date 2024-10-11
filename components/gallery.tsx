"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { NormalizedArtwork } from "../types/artwork";
import Modal from "react-modal";

interface GalleryProps {
  artworks: NormalizedArtwork[];
}

const Gallery: React.FC<GalleryProps> = ({ artworks }) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedArt, setSelectedArt] = useState<NormalizedArtwork | null>(
    null
  );

  useEffect(() => {
    const appElement = document.getElementById("__next");
    if (appElement) {
      Modal.setAppElement(appElement);
    } else {
      console.warn("React Modal: #__next element not found.");
    }
  }, []);

  const openModal = (art: NormalizedArtwork) => {
    setSelectedArt(art);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedArt(null);
  };

  if (!artworks.length) {
    return <p>No artworks available.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 p-5">
        {artworks.map((art) => (
          <div
            key={art.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform transform hover:-translate-y-1"
            onClick={() => openModal(art)}
          >
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
        ))}
      </div>

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
          <div className="text-center">
            {selectedArt.image ? (
              <Image
                src={selectedArt.image}
                alt={selectedArt.title}
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
              {selectedArt.title}
            </h2>
            <div className="mt-4 text-left text-gray-700 dark:text-gray-400">
              <p>
                <strong>Artist:</strong> {selectedArt.artist}
              </p>
              <p>
                <strong>Medium:</strong> {selectedArt.medium}
              </p>
              <p>
                <strong>Type:</strong> {selectedArt.type}
              </p>
              <p>
                <strong>Date:</strong> {selectedArt.date}
              </p>
              <p>
                <strong>Department:</strong> {selectedArt.department}
              </p>
              <p>
                <strong>Culture:</strong> {selectedArt.culture}
              </p>
              <p>
                <strong>Creditline:</strong> {selectedArt.creditline}
              </p>
              <p>
                <strong>Description:</strong> {selectedArt.description}
              </p>
              <p>
                <strong>Source:</strong> {selectedArt.source}{" "}
                <a
                  href={selectedArt.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Check details
                </a>
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Gallery;
