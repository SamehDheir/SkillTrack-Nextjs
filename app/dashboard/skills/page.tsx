"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import Loading from "../../loading";

export default function SkillsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await api.get("/skills");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load skills
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Skills</h1>
        <Link
          href="/dashboard/skills/new"
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 shadow-md transition"
        >
          Add New Skill
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((skill: any) => (
          <Link
            href={`/skills/${skill.id}`}
            key={skill.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition cursor-pointer border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800">{skill.name}</h2>
            <p className="text-gray-500 mt-2">Level: {skill.level}</p>
            <p className="text-gray-500 mt-1">Status: {skill.status}</p>

            <div className="mt-4 w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                style={{ width: `${skill.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{skill.progress}% completed</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
