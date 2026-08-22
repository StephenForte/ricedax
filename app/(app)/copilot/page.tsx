import { CopilotForm } from "@/components/CopilotForm";

export const dynamic = "force-dynamic";

export default function CopilotPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Copilot</p>
        <h2 className="serif text-3xl">Ask the same engine</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Chatbot and cockpit share one decision system. Try the two walkthrough questions first.
        </p>
      </header>
      <CopilotForm />
    </div>
  );
}
