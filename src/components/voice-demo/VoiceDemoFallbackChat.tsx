"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageSquareMore, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface VoiceDemoFallbackChatProps {
  enabled: boolean;
}

function generateFallbackReply(input: string) {
  const text = input.toLowerCase();
  if (text.includes("pain") || text.includes("toothache")) {
    return "For tooth pain, avoid very hot or cold foods, rinse with warm salt water, and book an urgent assessment if pain persists or worsens.";
  }
  if (text.includes("bleeding")) {
    return "Bleeding gums can be linked to inflammation. Gentle brushing, flossing, and a hygiene check are the next best steps.";
  }
  if (text.includes("implant")) {
    return "Dental implants are usually assessed with a clinical exam and imaging first. We can prepare a consultation summary for your dentist visit.";
  }
  if (text.includes("book") || text.includes("appointment")) {
    return "You can book directly in DentAI Assist from the appointments flow by choosing dentist, date/time, and appointment type.";
  }
  return "Thanks for the question. I can share general guidance here, and for a full live experience you can switch back to voice once mic access is available.";
}

export default function VoiceDemoFallbackChat({ enabled }: VoiceDemoFallbackChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Microphone access is unavailable. You can still run a text-based Chat Pearl demo here.",
    },
  ]);

  const canSubmit = useMemo(() => input.trim().length > 0, [input]);

  if (!enabled) return null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = input.trim();
    if (!next) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: next,
    };
    const assistantMessage: ChatMessage = {
      id: `a-${Date.now() + 1}`,
      role: "assistant",
      content: generateFallbackReply(next),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
  };

  return (
    <section className="rounded-2xl border border-amber-300/70 bg-amber-50/70 p-4 dark:border-amber-900/70 dark:bg-amber-950/20">
      <div className="flex items-start gap-2">
        <MessageSquareMore className="mt-0.5 size-4 text-amber-700 dark:text-amber-300" />
        <div>
          <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
            Text fallback mode
          </h4>
          <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-200/80">
            This fallback is for demo continuity when microphone permissions are blocked.
          </p>
        </div>
      </div>

      <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-xl border border-amber-200/70 bg-white/70 p-3 dark:border-amber-900/70 dark:bg-amber-950/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "rounded-xl px-3 py-2 text-sm",
              message.role === "assistant"
                ? "border border-amber-200/80 bg-amber-100/60 text-amber-950 dark:border-amber-900/70 dark:bg-amber-900/40 dark:text-amber-100"
                : "border border-cyan-200/80 bg-cyan-50 text-cyan-950 dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:text-cyan-100"
            )}
          >
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide opacity-70">
              {message.role === "assistant" ? "Chat Pearl" : "You"}
            </p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <form className="mt-3 flex gap-2" onSubmit={onSubmit}>
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a dental question..."
          aria-label="Type a fallback chat question"
        />
        <Button type="submit" disabled={!canSubmit}>
          <SendHorizontal className="size-4" />
          Send
        </Button>
      </form>
    </section>
  );
}
