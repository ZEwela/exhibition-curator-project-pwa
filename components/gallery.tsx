"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { NormalizedArtwork } from "../types/artwork";
import styles from "./gallery.module.css";
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
    // Ensure that the __next element exists before setting it as the app element
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
      <div className={styles.gallery}>
        {artworks.map((art) => (
          <div
            key={art.id}
            className={styles.card}
            onClick={() => openModal(art)}
          >
            {art.image ? (
              <Image
                src={art.image}
                alt={art.title}
                width={300}
                height={300}
                objectFit="cover"
                className={styles.image}
                placeholder="blur"
                blurDataURL="/placeholder.png" // Use a low-res placeholder
              />
            ) : (
              <Image
                src="/placeholder.png"
                alt="Placeholder"
                width={300}
                height={300}
                objectFit="cover"
                className={styles.image}
              />
            )}
            <div className={styles.info}>
              <h2>{art.title}</h2>
              <p>
                <strong>Artist:</strong> {art.artist}
              </p>
              <p>
                <strong>Medium:</strong> {art.medium}
              </p>
              <p>
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
          className={styles.modal}
          overlayClassName={styles.overlay}
          ariaHideApp={false}
        >
          <button onClick={closeModal} className={styles.closeButton}>
            &times;
          </button>
          <div className={styles.modalContent}>
            {selectedArt.image ? (
              <Image
                src={selectedArt.image}
                alt={selectedArt.title}
                width={600}
                height={600}
                objectFit="contain"
              />
            ) : (
              <Image
                src="/placeholder.png"
                alt="Placeholder"
                width={600}
                height={600}
                objectFit="contain"
              />
            )}
            <h2>{selectedArt.title}</h2>
            <p>
              <strong>Artist:</strong> {selectedArt.artist}
            </p>
            <p>
              <strong>Medium:</strong> {selectedArt.medium}
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
              <strong>Source:</strong> {selectedArt.source}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Gallery;
