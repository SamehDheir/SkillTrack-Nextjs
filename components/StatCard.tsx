export function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      <span className="text-gray-500 text-sm">{title}</span>
      <span
        className={`text-3xl font-bold mt-2 ${color} text-white rounded px-2 py-1 inline-block`}
      >
        {value}
      </span>
    </div>
  );
}
