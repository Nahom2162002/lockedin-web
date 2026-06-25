export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-950">Log in</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Access your LockedIn dashboard.
        </p>
      </div>

      <form action="/api/auth/login" method="post" className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
          Username
          <input
            name="username"
            type="text"
            autoComplete="username"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-base"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-base"
          />
        </label>

        <button
          type="submit"
          className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
