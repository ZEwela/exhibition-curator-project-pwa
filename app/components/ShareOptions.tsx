import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { NormalizedArtwork } from "@/types/artwork";

interface ShareOptionsProps {
  artwork: NormalizedArtwork;
}

const ShareOptions: React.FC<ShareOptionsProps> = ({ artwork }) => {
  const [shareOptionsVisible, setShareOptionsVisible] =
    useState<boolean>(false);

  const toggleShareOptions = () => {
    setShareOptionsVisible((prev) => !prev);
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      artwork.source_url
    )}`;
    window.open(url, "_blank");
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(artwork.source_url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={toggleShareOptions}
        className="flex items-center justify-center gap-4 w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition duration-300 ease-in-out shadow-md transform hover:scale-105"
      >
        <span>Share</span>
        {shareOptionsVisible ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </button>
      {shareOptionsVisible && (
        <div className="mt-2 space-y-2">
          <button
            onClick={shareOnFacebook}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-300 ease-in-out shadow-md transform hover:scale-105"
          >
            Share on Facebook
          </button>
          <button
            onClick={copyLinkToClipboard}
            className="w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition duration-300 ease-in-out shadow-md transform hover:scale-105"
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareOptions;
