"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Share2 } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";


export default function ViewImageModal({ open, onClose, image }: any) {
  if (!open) return null;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(image?.photo_name)} - ${encodeURIComponent(`http://localhost:4000${image?.image}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`http://localhost:4000${image?.image}`)}`,
    instagram: `https://www.instagram.com/`, // Instagram does NOT allow direct share URLs
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`http://localhost:4000${image?.image}`)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(`http://localhost:4000${image?.image}`)}`
  };

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
  "
          >
            <X size={22} className="text-black" />
          </button>


          {/* Image */}
          <img
            src={`http://localhost:4000${image?.image}`}
            className="w-full max-h-[70vh] object-contain bg-black"
          />

          {/* Title */}
          <h2 className="text-xl font-semibold text-center py-4 px-5">
            {image?.photo_name}
          </h2>

          {/* Share Icons */}
          {/* <div className="flex items-center justify-center gap-5 pb-6">

            <a href={shareLinks.whatsapp} target="_blank">
              <FaWhatsapp className="w-6 h-6 text-green-600 hover:scale-110 transition" />
            </a>

            <a href={shareLinks.facebook} target="_blank">
              <FaFacebook className="w-6 h-6 text-blue-600 hover:scale-110 transition" />
            </a>

            <a href={shareLinks.instagram} target="_blank">
              <FaInstagram className="w-6 h-6 text-pink-600 hover:scale-110 transition" />
            </a>

            <a href={shareLinks.linkedin} target="_blank">
              <FaLinkedin className="w-6 h-6 text-blue-700 hover:scale-110 transition" />
            </a>

            <a href={shareLinks.twitter} target="_blank">
              <FaTwitter className="w-6 h-6 text-black hover:scale-110 transition" />
            </a>

          </div> */}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
