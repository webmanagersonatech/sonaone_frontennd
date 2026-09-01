"use client";

import axios from "axios";

interface VideoItem {
  _id: string;
  video_name: string;
  year: number;
  description?: string;
  video: string;
}

interface VideoListResponse {
  docs: VideoItem[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}/videoupload`;

// ===============================
// 🔥 AXIOS INSTANCE WITH TOKEN
// ===============================
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor → Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// 🔥 VIDEO APIS
// ===============================

// Upload video
export async function uploadVideo(formData: FormData) {
  try {
    const res = await api.post("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Upload failed",
    };
  }
}

// List video items
export async function listVideo(
  page = 1,
  limit = 20,
  video_name = "",
  year = ""
): Promise<
  | { success: true; data: VideoListResponse }
  | { success: false; message: string }
> {
  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      video_name,
      year,
    });

    const res = await api.get<VideoListResponse>(`/?${query.toString()}`);

    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to load videos",
    };
  }
}

// Get single video item
export async function getVideo(id: string) {
  try {
    const res = await api.get(`/${id}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: "Not found" };
  }
}

// Update video
export async function updateVideo(id: string, formData: FormData) {
  try {
    const res = await api.put(`/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: "Update failed" };
  }
}

// Delete video item
export async function deleteVideo(id: string) {
  try {
    const res = await api.delete(`/${id}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: "Delete failed" };
  }
}
