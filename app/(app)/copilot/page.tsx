import { ChatTurn, CopilotForm } from "@/components/CopilotForm";
import { getCopilotHistory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AskRiceDaxPage() {
  const history = await getCopilotHistory();
  const initialTurns: ChatTurn[] = history.map((t) => ({
    question: t.question,
    answer: t.answer,
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Chatbot</p>
        <h2 className="serif text-3xl">Ask RiceDAX</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Conversational surface on the same cover engine as Overview. The thread persists in this workspace. Firm data
          is not sent to another trader.
        </p>
      </header>
      <CopilotForm key={history.map((t) => t.id).join("|")} initialTurns={initialTurns} />
    </div>
  );
}
