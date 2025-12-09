"use client";

interface Props {
  photo: any;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex?: number; // ✅ Added
  totalImages?: number; // ✅ Added
}

export default function GalleryPreviewModal({
  photo,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalImages,
}: Props) {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-white text-3xl"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Prev */}
        <button
          onClick={onPrev}
          className="absolute left-3 text-white text-4xl select-none"
        >
          ‹
        </button>

        {/* Image */}
        <img src={photo.file_path} className="max-h-[85vh] rounded-xl" />

        {/* Next */}
        <button
          onClick={onNext}
          className="absolute right-3 text-white text-4xl select-none"
        >
          ›
        </button>

        {/* Counter */}
        <div className="absolute bottom-6 text-white bg-black/50 px-4 py-1 rounded-full text-sm">
          {currentIndex} / {totalImages}
        </div>
      </div>
    </div>
  );
}
