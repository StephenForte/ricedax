import { CopilotForm } from "@/components/CopilotForm";

export const dynamic = "force-dynamic";

export default function AskRiceDaxPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Ask RiceDAX</p>
        <h2 className="serif text-3xl">Ask RiceDAX</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Same cover engine as Overview. Try the desk questions first.
        </p>
      </header>
      <CopilotForm />
    </div>
  );
}
