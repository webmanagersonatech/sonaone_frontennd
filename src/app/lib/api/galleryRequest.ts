"use client";

import axios from "axios";

interface GalleryItem {
  _id: string;
  photo_name: string;
  year: number;
  description?: string;
  image: string;
}

interface GalleryListResponse {
  docs: GalleryItem[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

const API_URL = "http://localhost:4000/api/galleryupload";

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
      config.headers = {}; // 👈 FIX
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// 🔥 GALLERY APIS
// ===============================

// Upload image
export async function uploadGallery(formData: FormData) {
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

// List gallery items
export async function listGallery(
  page = 1,
  limit = 20,
  photo_name = "",
  year = ""
): Promise<
  | { success: true; data: GalleryListResponse }
  | { success: false; message: string }
> {
  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      photo_name,
      year,
    });

    const res = await api.get<GalleryListResponse>(`/?${query.toString()}`);

    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to load gallery",
    };
  }
}


// Get single gallery item
export async function getGallery(id: string) {
  try {
    const res = await api.get(`/${id}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: "Not found" };
  }
}

// Update gallery
export async function updateGallery(id: string, formData: FormData) {
  try {
    const res = await api.put(`/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: "Update failed" };
  }
}

// Delete gallery item
export async function deleteGallery(id: string) {
  try {
    const res = await api.delete(`/${id}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: "Delete failed" };
  }
}
