"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Notiflix from "notiflix";
import { register } from "../lib/api/auth"; // your API function
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  // ---------- STATE ----------
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ---------- HANDLE REGISTER ----------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ---------- FRONTEND VALIDATION ----------
    if (!firstname || !lastname || !email || !mobileNo || !password) {
      Notiflix.Notify.failure("All fields are required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Notiflix.Notify.failure("Invalid email format!");
      return;
    }

    if (password.length < 6) {
      Notiflix.Notify.failure("Password must be at least 6 characters!");
      return;
    }

    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobileNo)) {
      Notiflix.Notify.failure(
        "Mobile number must contain only digits (10–15 characters)!"
      );
      return;
    }

    setIsLoading(true);
    Notiflix.Loading.circle("Registering...");

    try {
      const result = await register(firstname, lastname, email, password, mobileNo);

      Notiflix.Loading.remove();
      setIsLoading(false);

      if (result.success) {
        Notiflix.Notify.success("Registered successfully!");
        router.push("/"); // redirect to login
      } else {
        Notiflix.Notify.failure(result.message);
      }
    } catch (err) {
      Notiflix.Loading.remove();
      setIsLoading(false);
      Notiflix.Notify.failure("Registration failed. Please try again.");
    }
  };

  // ---------- JSX ----------
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 relative">
            <Image
              src="/images/sona-group.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm -mt-2">Join Sona One Gallery</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              placeholder="Enter your mobile number"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?
          <a href="/" className="text-primary font-semibold hover:underline">
            {" "}Login
          </a>
        </p>
      </div>
    </div>
  );
}
