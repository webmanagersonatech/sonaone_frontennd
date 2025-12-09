"use client";

import { useEffect, useState } from "react";
import { getGallery, updateGallery } from "@/app/lib/api/galleryRequest";

import Notiflix from "notiflix";
interface Props {
    id: string;
    onClose: () => void;
    onUpdated: () => void; // callback to refresh main list
}

export default function EditForm({ id, onClose, onUpdated }: Props) {
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState<any>(null);

    const [photo_name, setPhotoName] = useState("");
    const [year, setYear] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Load existing photo
    useEffect(() => {
        const fetchData = async () => {
            const res: any = await getGallery(id);
            if (res.success) {
                setPhoto(res.data);
                setPhotoName(res.data.photo_name);
                setYear(String(res.data.year));
                setDescription(res.data.description || "");
            }
        };
        fetchData();
    }, [id]);



    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        Notiflix.Loading.circle("Updating photo...");

        const formData = new FormData();
        formData.append("photo_name", photo_name);
        formData.append("year", year);
        formData.append("description", description);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        const res = await updateGallery(id, formData);

        setLoading(false);
        Notiflix.Loading.remove();

        if (res.success) {
            Notiflix.Notify.success("Photo updated successfully!");
            onUpdated();
            onClose();
        } else {
            Notiflix.Notify.failure(res.message || "Update failed!");
        }
    };


    if (!photo) return <p className="p-4">Loading...</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-3">

            {/* Photo Name */}
            <div>
                <label className="block font-medium">Photo Name</label>
                <input
                    value={photo_name}
                    onChange={(e) => setPhotoName(e.target.value)}
                    className="w-full h-12 border px-3 rounded-lg"
                />
            </div>

            {/* Year */}
            <div>
                <label className="block font-medium">Year</label>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full h-12 border px-3 rounded-lg"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg"
                    rows={3}
                />
            </div>

            {/* Image Preview */}
            <div>
                <label className="block font-medium">Current Image</label>
                <img
                    src={`http://localhost:4000${photo.image}`}
                    className="w-32 h-32 object-cover rounded-lg border"
                />
            </div>

            {/* Upload New Image */}
            <div>
                <label className="block font-medium">Replace Image (Optional)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full"
                />
            </div>

            {/* Submit Button */}
            <button
                disabled={loading}
                className="w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                {loading ? "Updating..." : "Update Photo"}
            </button>
        </form>
    );
}
