import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import {
  HiEnvelope,
  HiLockClosed,
  HiUser,
} from "react-icons/hi2";

import { loginWithGoogle } from "../../services/auth";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // =========================
  // EMAIL SIGNUP
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        name,
        email,
        password,
      });

      if (result.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(result.error || "Signup failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE SIGNUP
  // =========================

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);

      await loginWithGoogle();

      toast.success("Google account connected!");

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Google signup failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0F] px-4 py-18 text-white">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-500 text-3xl shadow-lg shadow-violet-600/30">
            🚀
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl font-bold">
          Create Account
        </h1>

        <p className="mt-2 text-center text-zinc-400">
          Start generating amazing content with AI
        </p>

        {/* Card */}
        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 shadow-2xl">

          {/* Form */}
          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Full Name
              </label>

              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-3 text-white placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Email Address
              </label>

              <div className="relative">
                <HiEnvelope className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-3 text-white placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Password
              </label>

              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-3 text-white placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            {/* Create Account */}
            <div className="py-4">
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-500 px-4 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
            </div>
          </form>
         

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 pb-2">
            <div className="h-px flex-1 bg-zinc-800" />

            <span className="text-xs text-zinc-500">
              OR
            </span>

            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {googleLoading ? (
              "Connecting..."
            ) : (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600">
                  G
                </span>

                Continue with Google
              </>
            )}
          </button>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-violet-400 transition hover:text-violet-300"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;