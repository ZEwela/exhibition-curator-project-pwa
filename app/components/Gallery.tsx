"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { NormalizedArtwork } from "@/types/artwork";
import { useExhibition } from "../contexts/ExhibitionContext";
import ArtworkDetails from "./ArtworkDetails";

interface GalleryProps {
  artworks: NormalizedArtwork[];
}

const Gallery: React.FC<GalleryProps> = ({ artworks }) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedArt, setSelectedArt] = useState<NormalizedArtwork | null>(
    null
  );
  const { addToExhibition, removeFromExhibition, isInExhibition } =
    useExhibition();

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

  const toggleExhibition = (art: NormalizedArtwork) => {
    if (isInExhibition(art.id)) {
      removeFromExhibition(art.id);
    } else {
      addToExhibition(art);
    }
  };

  if (!artworks.length) {
    return <p>No artworks available.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 ">
        {artworks.map((art) => (
          <div
            key={art.id}
            className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:-translate-y-1 hover:shadow-xl"
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
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {art.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Artist:</strong> {art.artist}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Medium:</strong> {art.medium}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Date:</strong> {art.date}
                </p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <button
                onClick={() => toggleExhibition(art)}
                className={`w-full py-3 rounded-lg transition-colors focus:outline-none focus:ring-4 ${
                  isInExhibition(art.id)
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg focus:ring-red-400"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg focus:ring-blue-400"
                }`}
                aria-label={
                  isInExhibition(art.id)
                    ? "Remove from Exhibition"
                    : "Add to Exhibition"
                }
              >
                <span className="font-semibold text-lg">
                  {isInExhibition(art.id)
                    ? "Remove from Exhibition"
                    : "Add to Exhibition"}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedArt && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Artwork Details"
          className="relative bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg w-full max-w-lg sm:max-w-3xl mx-auto my-8 max-h-[90vh] overflow-y-auto shadow-lg"
          overlayClassName="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
          ariaHideApp={false}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-6 text-3xl sm:text-4xl font-bold text-gray-600 dark:text-gray-200 cursor-pointer focus:outline-none hover:text-gray-800 dark:hover:text-gray-300 transition-colors duration-200"
          >
            &times;
          </button>
          <div className="text-center">
            <ArtworkDetails artwork={selectedArt} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default Gallery;
