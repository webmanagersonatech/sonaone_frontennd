"use client";

import { useState, } from "react";
import { Menu, X, LogOut, Upload } from "lucide-react";
import { uploadGallery } from "../lib/api/galleryRequest";
import Notiflix from "notiflix";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";


export default function GalleryHeader({ refetch }: { refetch: () => void }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [year, setYear] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);


  /* ========= Convert to WebP ========= */
  const convertToWebp = async (file: File) =>
    new Promise<File>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max = 2000;
        let w = img.width,
          h = img.height;

        if (w > max) {
          h = (h * max) / w;
          w = max;
        }

        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            resolve(
              new File([blob!], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: "image/webp",
              })
            );
          },
          "image/webp",
          0.85
        );
      };
    });

  /* ========= Upload ========= */
  const handleUpload = async () => {
    if (!imageFile) {
      Notiflix.Notify.failure("Select an image first!");
      return;
    }

    // Start loading
    setIsLoading(true);
    Notiflix.Loading.circle("Uploading...");

    try {
      const webp = await convertToWebp(imageFile);

      const fd = new FormData();
      fd.append("photo_name", photoName);
      fd.append("year", year);
      fd.append("description", desc);
      fd.append("image", webp);

      const result = await uploadGallery(fd);

      // Stop loading
      Notiflix.Loading.remove();
      setIsLoading(false);

      if (result.success) {
        Notiflix.Notify.success("Photo uploaded successfully!");

        // Reset UI
        setUploadOpen(false);
        refetch();

        setPhotoName("");
        setYear("");
        setDesc("");
        setImageFile(null);
      } else {
        Notiflix.Notify.failure(result.message || "Upload failed!");
      }
    } catch (err) {
      Notiflix.Loading.remove();
      setIsLoading(false);

      Notiflix.Notify.failure("Unexpected error occurred!");
    }
  };

  const handleLogout = () => {
    // 1️⃣ Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // 2️⃣ Show success notification
    Notiflix.Notify.success("Logged out successfully");

    // 3️⃣ Redirect to homepage after short delay
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };


  return (
    <header className="relative text-white">
      {/* BG Image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/images/banner.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/65" />

      {/* NAV */}
      <nav className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/images/sona-group.jpg"
            className="h-10 w-10 sm:h-16 sm:w-16 rounded-xl border border-yellow-300/60 object-cover"
          />
          <h1 className="text-xl sm:text-3xl font-extrabold">Sona One</h1>
        </div>

        <ul className="hidden sm:flex gap-8 items-center text-gray-200 font-medium">
          <li>
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 hover:text-[#F3D08B]"
            >
              <Upload size={18} />
              Upload Photos
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-red-400 font-medium"
            >
              <LogOut size={18} />
              Log out
            </button>
          </li>
        </ul>


        <button className="sm:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu size={28} />
        </button>
      </nav>

      {/* HERO */}
      <div className="relative z-20 text-center px-4 py-10 sm:py-20">
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-[#F3D08B] via-white to-[#77A7FF] bg-clip-text text-transparent">
            100 Years of Excellence
          </span>
          <br />
          Captured in Frames
        </h1>

        <p className="mt-6 text-gray-100 max-w-2xl mx-auto text-base sm:text-lg font-light">
          From humble beginnings to historic milestones — explore our proud
          visual heritage.
        </p>

        <div className="w-28 h-1 mx-auto mt-8 rounded-full bg-gradient-to-r from-[#E8C469] to-[#9FA2A8]" />
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* BG Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Auto-height sidebar */}
            <motion.aside
              className="fixed top-0 right-0 z-50 w-72 bg-[#0A0F1F] border-l border-white/10 shadow-xl rounded-l-md overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                mass: 0.6,
              }}
            >
              <div className="flex justify-between items-center px-4 py-4 border-b border-white/10">
                <span className="text-white font-semibold">Menu</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setUploadOpen(true);
                  }}
                  className="w-full px-4 py-3 text-left text-gray-200 border-b border-white/10 hover:text-[#F3D08B] flex items-center gap-2"
                >
                  <Upload size={18} />
                  Upload Photos
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-red-400 border-b border-white/10 hover:text-red-500 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>


      {/* ================= UPLOAD POPUP ================= */}
      <AnimatePresence>
        {uploadOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col overflow-hidden relative"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15,
                duration: 0.3,
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setUploadOpen(false)}
                className="absolute top-3 right-3 text-gray-700 hover:text-black"
              >
                <X size={24} />
              </button>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-center text-black py-6 border-b">
                Upload Photo
              </h2>

              {/* Form Fields */}
              <div className="px-6 py-5 space-y-5 overflow-y-auto">
                {/* Photo Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-black">
                    Photo Name
                  </label>
                  <input
                    className="w-full p-3 rounded-lg border border-gray-300 text-black bg-white focus:border-black focus:outline-none"
                    placeholder="Enter photo title"
                    value={photoName}
                    onChange={(e) => setPhotoName(e.target.value)}
                  />
                </div>

                {/* Year */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-black">Year</label>
                  <select
                    className="w-full p-3 rounded-lg border border-gray-300 text-black bg-white focus:border-black focus:outline-none"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 80 }).map((_, i) => {
                      const y = 2025 - i;
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-black">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 rounded-lg border border-gray-300 text-black bg-white focus:border-black focus:outline-none"
                    placeholder="Short description..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>

                {/* File Upload */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-black">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-black"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-gray-500">Max 10MB • Auto WebP</p>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                <button
                  onClick={() => setUploadOpen(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  disabled={isLoading}
                  onClick={handleUpload}
                  className={`px-5 py-2 rounded-lg text-white font-semibold ${isLoading ? "bg-gray-400" : "bg-black hover:bg-gray-900"
                    }`}
                >
                  {isLoading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
