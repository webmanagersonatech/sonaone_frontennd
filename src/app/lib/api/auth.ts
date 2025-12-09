"use client";

import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";
interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
}

interface RegisterResponse {
  message: string;
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export async function login(
  email: string,
  password: string
): Promise<
  | { success: true; token: string; user: LoginResponse["user"] }
  | { success: false; message: string }
> {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
      email,
      password,
    });

    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Login failed. Please try again.",
    };
  }
}

export async function register(
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  mobileNo: string
): Promise<{ success: true; user: any } | { success: false; message: string }> {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      firstname,
      lastname,
      email,
      password,
      mobileNo,
  
    });
    return { success: true, user: response.data };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Registration failed. Please try again.",
    };
  }
}


