"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getImageUrl } from "../lib/getImageUrl";

export default function ViewVideoModal({ open, onClose, video }: any) {
  if (!open) return null;

  const fullVideoUrl = getImageUrl(video?.video);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[1000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal Box */}
        <motion.div
          className="bg-white w-full max-w-3xl overflow-hidden relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="
    absolute top-4 right-4
    w-10 h-10
    flex items-center justify-center
    rounded-full
    bg-white/80 backdrop-blur-md
    shadow-lg
    hover:bg-white
    transition
    z-10
  "
          >
            <X size={22} className="text-black" />
          </button>

          {/* Video */}
          <video
            src={fullVideoUrl}
            controls
            autoPlay
            className="w-full max-h-[70vh] bg-black"
          />

          {/* Title */}
          <div className="py-4 px-5 text-center">
            <h2 className="text-xl font-semibold">{video?.video_name}</h2>
            {video?.description && (
              <p className="text-sm text-gray-500 mt-1">{video.description}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
