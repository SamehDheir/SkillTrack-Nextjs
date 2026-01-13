"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      await api.post("/auth/register", data);

      toast.success("Registration successful! Logging you in...");

      // تسجيل الدخول تلقائيًا بعد التسجيل
      await login(data.email, data.password);

      // إعادة التوجيه
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-100 via-white to-indigo-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-200"
      >
        <h2 className="text-3xl mb-8 text-center font-bold text-gray-800">
          Create Account
        </h2>

        <label className="block mb-2 font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register("name")}
          className="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-500"
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
        )}

        <label className="block mb-2 mt-4 font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-500"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
        )}

        <label className="block mb-2 mt-4 font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password")}
          className="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-500"
          placeholder="Enter a password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
