import React, { useState } from "react";
import { PreviewType } from "../../utils/customHooks.ts";

type PhotoCarouselProps = {
  photos: string[];
  type?: string;
  croppedStyle?: boolean;
  previews?: PreviewType[];
};

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  photos,
  type,
  croppedStyle = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const imageClass = croppedStyle ? "object-cover" : "object-contain";

  return (
    <div
      className={`relative flex justify-center items-center w-full max-w-[473px] ${
        type ? "h-[473px]" : "h-full"
      }`}
    >
      <img
        src={photos[currentIndex]}
        alt={`Photo ${currentIndex + 1}`}
        className={`w-full h-full ${imageClass}`}
      />

      {photos.length > 1 && (
        <>
          <button
            className="absolute z-10 top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-background rounded-full w-8 h-8 flex items-center justify-center"
            onClick={handlePrev}
          >
            ‹
          </button>
          <button
            className="absolute z-10 top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-background rounded-full w-8 h-8 flex items-center justify-center"
            onClick={handleNext}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};
export default PhotoCarousel;
