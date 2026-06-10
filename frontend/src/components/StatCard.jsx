

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between">
      <div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );
};

export default StatCard;
