"use client";

import { X } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaDownload, FaThLarge, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface ShareImagesModalProps {
    open: boolean;
    onClose: () => void;
    images: { _id: string; image: string }[];
}

export default function ShareImagesModal({ open, onClose, images }: ShareImagesModalProps) {
    const [collageUrl, setCollageUrl] = useState<string | null>(null);
    const [showCollageSelect, setShowCollageSelect] = useState(false);

    if (!open) return null;

    const imageUrls = images.map((img) => `${process.env.NEXT_PUBLIC_API_BASE}${img.image}`);

    const combinedText = encodeURIComponent("Check these images: " + imageUrls.join(", "));

    // ✅ Download all images as a ZIP
    const downloadAll = async () => {
        const zip = new JSZip();

        await Promise.all(
            imageUrls.map(async (url, i) => {
                const response = await fetch(url);
                const blob = await response.blob();
                zip.file(`image${i + 1}.jpg`, blob);
            })
        );

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "images.zip");
    };

    const createCollage = async (layout: "classic" | "polaroid") => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const cols = layout === "classic" ? 2 : 3;
        const rows = Math.ceil(imageUrls.length / cols);
        const imgSize = 300;
        canvas.width = cols * imgSize;
        canvas.height = rows * imgSize;

        for (let i = 0; i < imageUrls.length; i++) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageUrls[i];

            await new Promise<void>((resolve) => {
                img.onload = () => {
                    const x = (i % cols) * imgSize;
                    const y = Math.floor(i / cols) * imgSize;
                    ctx.drawImage(img, x, y, imgSize, imgSize);
                    resolve();
                };
            });
        }

        setCollageUrl(canvas.toDataURL("image/jpeg"));
        setShowCollageSelect(false);
    };

    const downloadCollage = () => {
        if (!collageUrl) return;
        const link = document.createElement("a");
        link.href = collageUrl;
        link.download = "collage.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearCollage = () => {
        setCollageUrl(null);
        setShowCollageSelect(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-white w-full max-w-5xl  overflow-auto max-h-[90vh] p-6 relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-black bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-semibold mb-4 text-center">Share / Download Selected Images</h2>

                        {/* Normal Share + Download Buttons */}
                        {!collageUrl && !showCollageSelect && (
                            <div className="flex flex-wrap justify-center gap-4 mb-6">
                                <a href={`https://wa.me/?text=${combinedText}`} target="_blank" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"><FaWhatsapp /> WhatsApp</a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrls.join(","))}`} target="_blank" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><FaFacebook /> Facebook</a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrls.join(","))}`} target="_blank" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"><FaTwitter /> Twitter</a>
                                <a href="https://www.instagram.com/" target="_blank" className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"><FaInstagram /> Instagram</a>
                                <button onClick={downloadAll} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"><FaDownload /> Download All</button>
                                {images.length > 1 && <button onClick={() => setShowCollageSelect(true)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"><FaThLarge /> Make Collage</button>}
                            </div>
                        )}

                        {/* Collage Design Selection */}
                        {showCollageSelect && (
                            <div className="flex justify-center gap-4 mb-6">
                                <button onClick={() => createCollage("classic")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Classic</button>
                                <button onClick={() => createCollage("polaroid")} className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition">Polaroid</button>
                            </div>
                        )}

                        {/* Collage Preview + Download */}
                        {collageUrl && (
                            <div className="mt-6 text-center">
                                <h3 className="text-lg font-semibold mb-2">Collage Preview</h3>
                                <img src={collageUrl} className="mx-auto rounded-lg shadow-lg max-h-60 object-cover" />
                                <div className="mt-4 flex justify-center gap-4 flex-wrap">
                                    <button onClick={downloadCollage} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"><FaDownload /> Download Collage</button>
                                    <button onClick={clearCollage} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"><FaTrash /> Clear Collage</button>
                                </div>
                            </div>
                        )}

                        {/* Images preview grid */}
                        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                            {images.map((p) => {
                                const url = `${process.env.NEXT_PUBLIC_API_BASE}${p.image}`;

                                return (
                                    <motion.div key={p._id} className="relative rounded-lg overflow-hidden shadow" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 150 }}>
                                        <img src={url} className="w-full h-[150px] object-cover rounded-lg" />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
