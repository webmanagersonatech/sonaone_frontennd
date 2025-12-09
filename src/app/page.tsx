"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import CryptoJS from "crypto-js";
import { login } from "./lib/api/auth";
import Notiflix from "notiflix";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const SECRET_KEY = "sonacassecretkey@2025";
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    Notiflix.Loading.circle("Logging in...");

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      SECRET_KEY
    ).toString();

    const result = await login(email, encryptedPassword);

    Notiflix.Loading.remove();
    setIsLoading(false);

    if (result.success) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      Notiflix.Notify.success("Login Successful!");

      setTimeout(() => {
        router.push("/gallery");
      }, 800);
    } else {
      Notiflix.Notify.failure(result.message || "Login failed!");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 space-y-6">
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

          <h2 className="text-3xl font-extrabold text-gray-800">Sona One</h2>
          <p className="text-gray-500 text-sm -mt-2">Welcome back!</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

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

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary text-white py-2 rounded-lg font-medium transition ${
              isLoading
                ? "bg-primary/50 cursor-not-allowed"
                : "hover:bg-primary/90"
            }`}
          >
            {isLoading ? "Processing..." : "Login"}
          </button>
        </form>

        {msg && <div className="text-sm text-red-600 text-center">{msg}</div>}

        <p className="text-sm text-center text-gray-600">
          New user?{" "}
          <a
            href="/register"
            className="text-primary font-semibold hover:underline"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
