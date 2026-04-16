import { formatDate } from '../utils/format';

export default function AdjustmentsTab({
  adjustForm,
  adjustments,
  disabled,
  members,
  onFieldChange,
  onSubmit,
}) {
  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-5">
        <input
          type="date"
          disabled={disabled}
          className="rounded border p-2"
          value={adjustForm.date}
          onChange={(event) => onFieldChange('date', event.target.value)}
        />
        <select
          className="rounded border p-2"
          disabled={disabled}
          value={adjustForm.memberId}
          onChange={(event) => onFieldChange('memberId', event.target.value)}
          required
        >
          <option value="">Select member</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          disabled={disabled}
          className="rounded border p-2"
          value={adjustForm.amount}
          onChange={(event) => onFieldChange('amount', event.target.value)}
          required
        />
        <select
          className="rounded border p-2"
          disabled={disabled}
          value={adjustForm.type}
          onChange={(event) => onFieldChange('type', event.target.value)}
        >
          <option value="payment">payment</option>
          <option value="credit">credit</option>
          <option value="debit">debit</option>
        </select>
        <button
          disabled={disabled}
          className="rounded bg-[var(--accent)] p-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          Adjust
        </button>
      </form>

      {adjustments.map((adjustment) => (
        <p key={adjustment._id} className="rounded border p-2 text-sm">
          {formatDate(adjustment.date)} - {adjustment.memberId?.name} -{' '}
          {adjustment.type} - Tk {adjustment.amount}
        </p>
      ))}
    </div>
  );
}
