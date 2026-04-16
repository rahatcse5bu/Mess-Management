export default function LoginScreen({
  login,
  error,
  isSubmitting,
  onFieldChange,
  onSubmit,
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-[var(--ink)]">
          Mess Management Login
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Use the seeded credentials or your own account.
        </p>

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-lg border border-slate-300 p-3"
            placeholder="Email"
            disabled={isSubmitting}
            value={login.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
          />
          <input
            className="w-full rounded-lg border border-slate-300 p-3"
            type="password"
            placeholder="Password"
            disabled={isSubmitting}
            value={login.password}
            onChange={(event) => onFieldChange('password', event.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[var(--accent)] p-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
    </main>
  );
}
