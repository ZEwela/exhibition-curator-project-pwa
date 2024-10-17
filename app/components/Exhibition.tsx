import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { useExhibition } from "../contexts/ExhibitionContext";
import { NormalizedArtwork } from "@/types/artwork";
import ArtworkDetails from "./ArtworkDetails";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import Link from "next/link";

const ITEMS_PER_PAGE = 20;

const Exhibition: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { exhibitionArtworks, removeFromExhibition } = useExhibition();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedArt, setSelectedArt] = useState<NormalizedArtwork | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(exhibitionArtworks.length / ITEMS_PER_PAGE);

  const openModal = (art: NormalizedArtwork) => {
    setSelectedArt(art);
    setModalIsOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("artwork", art.id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedArt(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("artwork");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const artworksToDisplay = exhibitionArtworks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {exhibitionArtworks.length === 0 ? (
        <div className="flex items-center justify-center flex-col gap-5">
          <p className="text-gray-600 dark:text-gray-400">
            Your exhibition is empty. Add some artworks!
          </p>
          <Link
            href="/gallery"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-300"
          >
            Go to Gallery
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {artworksToDisplay.map((art) => (
              <div
                key={art.id}
                className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:-translate-y-1 hover:shadow-xl flex flex-col"
              >
                <div onClick={() => openModal(art)} className="flex-grow">
                  {art.image ? (
                    <Image
                      src={art.image}
                      alt={art.title}
                      width={300}
                      height={300}
                      className="w-full h-[200px] object-cover transition-transform duration-300 hover:scale-105"
                      placeholder="blur"
                      blurDataURL="/placeholder.png"
                    />
                  ) : (
                    <Image
                      src="/placeholderWithText.png"
                      alt="Placeholder"
                      width={300}
                      height={300}
                      className="w-full h-[200px] object-cover"
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
                    onClick={() => removeFromExhibition(art.id)}
                    className="w-full py-2 rounded transition-colors bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                  >
                    Remove from Exhibition
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
