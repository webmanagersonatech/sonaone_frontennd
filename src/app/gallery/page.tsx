"use client";

import { useState, useEffect } from "react";
import { Eye, Edit3, Download, Trash2, X, Share2 } from "lucide-react";
import GalleryHeader from "../components/GalleryHeader";
import { listGallery, deleteGallery } from "../lib/api/galleryRequest";
import Model from "../components/Modal"
import { useRouter } from "next/navigation";
import EditForm from "@/Forms/EditForm";
import ViewImageModal from "../components/ViewImageModal";
import ShareImagesModal from "../components/ShareImagesModal";
import Notiflix from "notiflix";
// ⬅️ Skeleton component (loading animation)
const ImageSkeleton = () => (
  <div className="w-full h-[240px] rounded-xl bg-gray-200 animate-pulse"></div>
);




export default function GalleryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [shareSelectedModal, setShareSelectedModal] = useState(false);

  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });



  // Modal state
  const [viewImage, setViewImage] = useState<any>(null);
  const [editPhoto, setEditPhoto] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDownload = async (url: string) => {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = url.split("/").pop() || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl); // free memory
  };




  // Fetch Photos
  const fetchPhotos = async () => {
    setLoading(true);
    const result: any = await listGallery(page, 20, search, year);
    setLoading(false);

    if (result.success) {
      setPhotos(result.data.docs);
      setPagination({
        page: result.data.page,
        totalPages: result.data.totalPages,
        hasNextPage: result.data.hasNextPage,
        hasPrevPage: result.data.hasPrevPage,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Notiflix.Notify.failure("You are not authorized!");
      router.push("/"); // redirect to login page
      return; // stop execution
    }

    const t = setTimeout(() => fetchPhotos(), 200);
    return () => clearTimeout(t);
  }, [page, search, year, router]);


  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Delete Photo Handler
const onConfirmDelete = async () => {
  if (!deleteId) return;

  try {
    await deleteGallery(deleteId); // call your API
    setDeleteId(null);
    fetchPhotos(); // refresh gallery

    // Show success notification
    Notiflix.Notify.success("Gallery deleted successfully!");
  } catch (error: any) {
    // Show failure notification if API fails
    Notiflix.Notify.failure(
      error.response?.data?.message || "Failed to delete gallery"
    );
  }
};




  return (
    <>
      <GalleryHeader refetch={fetchPhotos} />

      {/* FILTERS */}
      <div className="bg-white shadow-md rounded-xl -mt-6 relative z-30 max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-between items-center">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search photos..."
            className="flex-1 min-w-[150px] sm:flex-none sm:w-[19%] h-12 px-4 rounded-lg border-gray-300 border"
          />

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="flex-1 min-w-[150px] sm:flex-none sm:w-[19%] h-12 px-3 rounded-lg border-gray-300 border"
          >
            <option value="">All Years</option>
            {Array.from({ length: 70 }).map((_, i) => {
              const y = 2025 - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>



          {selected.length > 0 && (
            <button
              onClick={() => setShareSelectedModal(true)}
              className="flex-1 min-w-[150px] sm:flex-none sm:w-[19%] h-12 px-4 flex items-center justify-center gap-2 border border-green-600 bg-green-400/70 text-green-700 font-medium rounded-lg 
         hover:bg-green-700 hover:text-white transition"
            >
              <Share2 className="w-5 h-5" />
              Share ({selected.length})
            </button>
          )}

        </div>
      </div>



      {/* GALLERY GRID */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <ImageSkeleton key={i} />
            ))
            : photos.map((p) => (
              <div key={p._id} className="relative group">
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE}${p.image}`}
                    className="w-full h-[240px] object-cover transition group-hover:scale-105"
                  />

                  {/* Black Overlay */}
                  <div className="absolute inset-0 bg-black/50"></div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                    <button
                      onClick={() => setViewImage(p)}
                      className="action-btn bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setEditPhoto(p)}
                      className="action-btn bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDownload(`${process.env.NEXT_PUBLIC_API_BASE}${p.image}`)}

                      className="action-btn bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Download className="w-4 h-4" />
                    </button>


                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="action-btn bg-white/20 hover:bg-red-500 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* SELECT CHECKBOX */}
                  <button
                    onClick={() => toggleSelect(p._id)}
                    className={`absolute bottom-3 right-3 w-6 h-6 rounded-lg border-2 text-white flex items-center justify-center
                        ${selected.includes(p._id)
                        ? "bg-yellow-400 border-yellow-300"
                        : "bg-white/20 border-white"
                      }`}
                  >
                    {selected.includes(p._id) && (
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-4 pb-6">
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded-lg text-white ${pagination.hasPrevPage
            ? "bg-black hover:bg-gray-900"
            : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Prev
        </button>

        <span className="text-black text-sm">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          disabled={!pagination.hasNextPage}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded-lg text-white ${pagination.hasNextPage
            ? "bg-black hover:bg-gray-900"
            : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Next
        </button>
      </div>

      <ViewImageModal
        open={viewImage !== null}
        onClose={() => setViewImage(null)}
        image={viewImage}
      />



      {/* EDIT PHOTO MODAL */}
      <Model
        open={editPhoto}
        onClose={() => setEditPhoto(null)}
        size="lg"
        title="Edit Photo"
      >
        {editPhoto && (
          <EditForm
            id={editPhoto._id}
            onClose={() => setEditPhoto(null)}
            onUpdated={() => fetchPhotos()} // reload table after update
          />
        )}
      </Model>



      {/* DELETE CONFIRMATION */}
      <Model
        open={deleteId}
        onClose={() => setDeleteId(null)}
        size="md"
        title="Are you sure you want to delete this photo?"
        footer={
          <>
            <button
              onClick={() => setDeleteId(null)}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium"
            >
              Cancel
            </button>

            <button
              onClick={onConfirmDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Yes, Delete
            </button>
          </>
        }
      >
        <p className="text-center text-gray-600 mb-4">
          This action cannot be undone.
        </p>
      </Model>

      <ShareImagesModal
        open={shareSelectedModal}
        onClose={() => setShareSelectedModal(false)}
        images={photos.filter((p) => selected.includes(p._id))}
      />


    </>
  );
}
