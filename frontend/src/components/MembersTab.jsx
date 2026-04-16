export default function MembersTab({
  disabled,
  memberForm,
  members,
  onDeleteMember,
  onFieldChange,
  onSubmit,
}) {
  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-4">
        <input
          className="rounded border p-2"
          placeholder="Name"
          disabled={disabled}
          value={memberForm.name}
          onChange={(event) => onFieldChange('name', event.target.value)}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Email"
          disabled={disabled}
          value={memberForm.email}
          onChange={(event) => onFieldChange('email', event.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Phone"
          disabled={disabled}
          value={memberForm.phone}
          onChange={(event) => onFieldChange('phone', event.target.value)}
        />
        <button
          disabled={disabled}
          className="rounded bg-[var(--accent)] p-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          Add Member
        </button>
      </form>

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-slate-500">
                {member.email || 'No email'}
              </p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onDeleteMember(member._id)}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
