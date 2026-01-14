"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useState } from "react";

const skillSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]),
});

type SkillInput = z.infer<typeof skillSchema>;

export default function NewSkillPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SkillInput) => {
    setLoading(true);
    try {
      await api.post("/skills", data);
      toast.success("Skill created successfully!");
      router.push("/dashboard/skills");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create skill");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-start">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Skill</h1>

        <label className="block text-gray-700 font-medium mb-1">
          Skill Name
        </label>
        <input
          type="text"
          placeholder="Enter skill name"
          {...register("name")}
          className="w-full border border-gray-300 p-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
        )}

        <label className="block text-gray-700 font-medium mb-1 mt-4">
          Level
        </label>
        <select
          {...register("level")}
          className="w-full border border-gray-300 p-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        {errors.level && (
          <p className="text-red-500 text-sm mb-2">{errors.level.message}</p>
        )}

        <label className="block text-gray-700 font-medium mb-1 mt-4">
          Status
        </label>
        <select
          {...register("status")}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="PLANNED">Planned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm mb-2">{errors.status.message}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 mt-4 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
        >
          Add Skill
        </button>
      </form>
    </div>
  );
}
