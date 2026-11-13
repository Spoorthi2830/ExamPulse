export function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorMap[color] || colorMap.blue}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#142B4A]">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
