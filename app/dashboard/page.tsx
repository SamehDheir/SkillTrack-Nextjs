"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StatCard } from "@/components/StatCard";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: async () => {
      const res = await api.get("/users/overview");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-400 text-lg">Loading dashboard...</div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load dashboard
      </div>
    );

  return (
    <div className="p-8 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        Your Learning Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Skills"
          value={data.totalSkills}
          color="bg-indigo-500"
        />
        <StatCard
          title="Completed"
          value={data.completedSkills}
          color="bg-green-500"
        />
        <StatCard
          title="In Progress"
          value={data.inProgressSkills}
          color="bg-yellow-500"
        />
        <StatCard
          title="Planned"
          value={data.plannedSkills}
          color="bg-gray-500"
        />
      </div>
      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          Overall Progress
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
          {/* Planned */}
          <div
            style={{
              width: `${(data.plannedSkills / data.totalSkills) * 100}%`,
              backgroundColor: "#9ca3af",
            }}
          />
          {/* In Progress */}
          <div
            style={{
              width: `${(data.inProgressSkills / data.totalSkills) * 100}%`,
              backgroundColor: "#facc15",
            }}
          />
          {/* Completed */}
          <div
            style={{
              width: `${(data.completedSkills / data.totalSkills) * 100}%`,
              backgroundColor: "#22c55e",
            }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Completed: {data.completedSkills}, In Progress:{" "}
          {data.inProgressSkills}, Planned: {data.plannedSkills}
        </p>
      </div>
    </div>
  );
}
