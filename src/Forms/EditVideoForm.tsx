"use client";

import { useEffect, useState } from "react";
import { getVideo, updateVideo } from "@/app/lib/api/videoRequest";
import { getImageUrl } from "@/app/lib/getImageUrl";

import Notiflix from "notiflix";
interface Props {
    id: string;
    onClose: () => void;
    onUpdated: () => void; // callback to refresh main list
}

export default function EditVideoForm({ id, onClose, onUpdated }: Props) {
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState<any>(null);

    const [video_name, setVideoName] = useState("");
    const [year, setYear] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);

    // Load existing video
    useEffect(() => {
        const fetchData = async () => {
            const res: any = await getVideo(id);
            if (res.success) {
                setVideo(res.data);
                setVideoName(res.data.video_name);
                setYear(String(res.data.year));
                setDescription(res.data.description || "");
            }
        };
        fetchData();
    }, [id]);



    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        Notiflix.Loading.circle("Updating video...");

        const formData = new FormData();
        formData.append("video_name", video_name);
        formData.append("year", year);
        formData.append("description", description);

        if (videoFile) {
            formData.append("video", videoFile);
        }

        const res = await updateVideo(id, formData);

        setLoading(false);
        Notiflix.Loading.remove();

        if (res.success) {
            Notiflix.Notify.success("Video updated successfully!");
            onUpdated();
            onClose();
        } else {
            Notiflix.Notify.failure(res.message || "Update failed!");
        }
    };


    if (!video) return <p className="p-4">Loading...</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-3">

            {/* Video Name */}
            <div>
                <label className="block font-medium">Video Name</label>
                <input
                    value={video_name}
                    onChange={(e) => setVideoName(e.target.value)}
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

            {/* Current Video Preview */}
            <div>
                <label className="block font-medium">Current Video</label>
                <video
                    src={getImageUrl(video.video)}
                    controls
                    className="w-full max-h-48 rounded-lg border bg-black"
                />
            </div>

            {/* Upload New Video */}
            <div>
                <label className="block font-medium">Replace Video (Optional)</label>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full"
                />
            </div>

            {/* Submit Button */}
            <button
                disabled={loading}
                className="w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                {loading ? "Updating..." : "Update Video"}
            </button>
        </form>
    );
}
