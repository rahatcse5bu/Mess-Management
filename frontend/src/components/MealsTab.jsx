export default function MealsTab({
  disabled,
  mealForm,
  members,
  onEntryChange,
  onFieldChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="date"
          disabled={disabled}
          className="rounded border p-2"
          value={mealForm.date}
          onChange={(event) => onFieldChange('date', event.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Meal elements (rice,fish,dal)"
          disabled={disabled}
          value={mealForm.elements}
          onChange={(event) => onFieldChange('elements', event.target.value)}
        />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {members.map((member) => (
          <label
            key={member._id}
            className="flex items-center justify-between rounded border p-2"
          >
            <span>{member.name}</span>
            <input
              type="number"
              step="0.5"
              min="0"
              disabled={disabled}
              className="w-24 rounded border p-1"
              value={mealForm.entries[member._id] || ''}
              onChange={(event) =>
                onEntryChange(member._id, event.target.value)
              }
            />
          </label>
        ))}
      </div>

      <button
        disabled={disabled}
        className="rounded bg-[var(--accent)] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        Save Meal Day
      </button>
    </form>
  );
}
