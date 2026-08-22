import { loginAction } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const q = await searchParams;
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--gold)]">RiceDAX</p>
      <h1 className="serif mt-2 text-4xl">Pacific Grain node</h1>
      <p className="mt-3 text-sm text-[var(--ink-soft)]">
        Synthetic demo for the EnterpriseSG walkthrough. Not live prices. Not a production system.
      </p>
      <form action={loginAction} className="panel mt-6 p-5">
        <input type="hidden" name="next" value={q.next || "/"} />
        <label className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
          Demo passphrase
          <input
            name="password"
            type="password"
            className="mt-2 block w-full border border-[var(--rule)] bg-white p-2 text-sm"
            autoFocus
          />
        </label>
        {q.error ? <p className="mt-3 text-sm text-[var(--watch)]">Wrong passphrase.</p> : null}
        <button className="btn mt-4 w-full">Enter</button>
      </form>
    </div>
  );
}
