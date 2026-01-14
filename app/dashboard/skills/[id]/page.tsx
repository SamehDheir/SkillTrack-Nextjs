"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ConfirmModal from "@/components/ConfirmModal";

const skillSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]),
});

type SkillInput = z.infer<typeof skillSchema>;

export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const {
    data: skill,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["skill", skillId],
    queryFn: async () => {
      const res = await api.get(`/skills/${skillId}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
  });

  // Reset form with fetched data
  useEffect(() => {
    if (skill) {
      reset({
        name: skill.name,
        level: skill.level,
        status: skill.status,
      });
    }
  }, [skill, reset]);

  // Update skill
  const updateMutation = useMutation({
    mutationFn: async (updatedData: SkillInput) => {
      return api.patch(`/skills/${skillId}`, updatedData);
    },
    onSuccess: () => {
      toast.success("Skill updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skill", skillId] });
    },
    onError: (error: any) => {
      console.error("Update error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update skill");
    },
  });

  // Delete skill
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return api.delete(`/skills/${skillId}`);
    },
    onSuccess: () => {
      toast.success("Skill deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      router.push("/dashboard/skills");
    },
    onError: () => toast.error("Failed to delete skill"),
  });

  const onSubmit = (data: SkillInput) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-500">Failed to load skill</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{skill.name}</h1>

        <label className="block text-gray-700 font-medium mb-1">
          Skill Name
        </label>
        <input
          type="text"
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
          className="w-full border border-gray-300 p-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
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
          Update Skill
        </button>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 mt-3 rounded-xl text-white font-semibold bg-red-500 shadow-lg hover:bg-red-600 transition-all"
        >
          Delete Skill
        </button>

        <ConfirmModal
          isOpen={isModalOpen}
          title="Delete Skill"
          description="Are you sure you want to delete this skill? This action cannot be undone."
          onConfirm={() => {
            deleteMutation.mutate();
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </form>
    </div>
  );
}
