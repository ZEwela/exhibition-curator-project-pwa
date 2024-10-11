"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { NormalizedArtwork } from "@/types/artwork";

interface ExhibitionContextType {
  exhibitionArtworks: NormalizedArtwork[];
  addToExhibition: (artwork: NormalizedArtwork) => void;
  removeFromExhibition: (artworkId: string) => void;
  isInExhibition: (artworkId: string) => boolean;
}

const ExhibitionContext = createContext<ExhibitionContextType | undefined>(
  undefined
);

export const ExhibitionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [exhibitionArtworks, setExhibitionArtworks] = useState<
    NormalizedArtwork[]
  >([]);

  useEffect(() => {
    const storedExhibition = localStorage.getItem("exhibition");
    if (storedExhibition) {
      setExhibitionArtworks(JSON.parse(storedExhibition));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("exhibition", JSON.stringify(exhibitionArtworks));
  }, [exhibitionArtworks]);

  const addToExhibition = (artwork: NormalizedArtwork) => {
    setExhibitionArtworks((prev) => [...prev, artwork]);
  };

  const removeFromExhibition = (artworkId: string) => {
    setExhibitionArtworks((prev) => prev.filter((art) => art.id !== artworkId));
  };

  const isInExhibition = (artworkId: string) => {
    return exhibitionArtworks.some((art) => art.id === artworkId);
  };

  return (
    <ExhibitionContext.Provider
      value={{
        exhibitionArtworks,
        addToExhibition,
        removeFromExhibition,
        isInExhibition,
      }}
    >
      {children}
    </ExhibitionContext.Provider>
  );
};

export const useExhibition = () => {
  const context = useContext(ExhibitionContext);
  if (context === undefined) {
    throw new Error("useExhibition must be used within an ExhibitionProvider");
  }
  return context;
};
