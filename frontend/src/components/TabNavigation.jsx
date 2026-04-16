export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`rounded-full border px-4 py-2 text-sm ${
            activeTab === tab
              ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
              : 'border-slate-300 bg-white text-slate-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
