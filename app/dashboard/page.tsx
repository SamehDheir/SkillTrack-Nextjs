"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
        <StatCard title="Total Skills" value={data.totalSkills} color="bg-indigo-500" />
        <StatCard title="Completed" value={data.completedSkills} color="bg-green-500" />
        <StatCard title="In Progress" value={data.inProgressSkills} color="bg-yellow-500" />
        <StatCard title="Avg Progress" value={`${data.avgProgress}%`} color="bg-purple-500" />
      </div>

      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">Overall Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${data.avgProgress}%`,
              background: "linear-gradient(to right, #6366F1, #8B5CF6)",
            }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          You have completed {data.avgProgress}% of your learning goals
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      <span className="text-gray-500 text-sm">{title}</span>
      <span className={`text-3xl font-bold mt-2 ${color} text-white rounded px-2 py-1 inline-block`}>
        {value}
      </span>
    </div>
  );
}
