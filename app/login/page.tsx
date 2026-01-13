"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Login successful!");
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-100 via-white to-pink-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-200"
      >
        <h2 className="text-3xl mb-8 text-center font-bold text-gray-800">
          Welcome Back
        </h2>

        <label className="block mb-2 font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-500"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
        )}

        <label className="block mb-2 mt-4 font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-500"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
