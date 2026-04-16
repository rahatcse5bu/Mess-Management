import { formatDate } from '../utils/format';

export default function CookingTab({
  cookForm,
  disabled,
  history,
  members,
  onFieldChange,
  onMoveOrder,
  onSave,
}) {
  const membersById = new Map(members.map((member) => [member._id, member]));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="termDays">Term days</label>
        <input
          id="termDays"
          type="number"
          min="1"
          disabled={disabled}
          className="w-24 rounded border p-2"
          value={cookForm.termDays}
          onChange={(event) =>
            onFieldChange('termDays', Number(event.target.value))
          }
        />
        <button
          type="button"
          disabled={disabled}
          className="rounded bg-[var(--accent)] px-4 py-2 text-white"
          onClick={onSave}
        >
          Save
        </button>
      </div>

      <div className="grid gap-2">
        {cookForm.memberOrder.map((memberId, index) => {
          const member = membersById.get(memberId);

          if (!member) {
            return null;
          }

          return (
            <div
              key={memberId}
              className="flex items-center justify-between rounded border p-2"
            >
              <span>
                {index + 1}. {member.name}
              </span>
              <div className="space-x-2">
                <button
                  type="button"
                  disabled={disabled}
                  className="rounded border px-2"
                  onClick={() => onMoveOrder(index, -1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  className="rounded border px-2"
                  onClick={() => onMoveOrder(index, 1)}
                >
                  Down
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">Cooking history</h3>
        {history.slice(0, 20).map((entry) => (
          <p key={entry._id} className="rounded border p-2 text-sm">
            {formatDate(entry.date)} - {entry.memberId?.name || 'Unknown'} (
            {entry.source})
          </p>
        ))}
      </div>
    </div>
  );
}
