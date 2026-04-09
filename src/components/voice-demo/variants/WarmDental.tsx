"use client";

import { cn } from "@/lib/utils";
import { Smile } from "lucide-react";
import type { VoiceVisualProps } from "./shared";

export default function WarmDental({
  callState,
  isAssistantSpeaking,
  volumeLevel,
}: VoiceVisualProps) {
  const active = callState === "active";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-sm dark:border-orange-900/70 dark:from-orange-950/35 dark:via-rose-950/25 dark:to-card">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_12%,rgba(251,191,36,0.25),transparent_34%),radial-gradient(circle_at_12%_88%,rgba(251,113,133,0.2),transparent_32%)]" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs tracking-wide text-orange-700 uppercase dark:text-orange-300">
            Warm mode
          </p>
          <h3 className="mt-1 text-xl font-semibold text-orange-950 dark:text-orange-100">
            Chat Pearl
          </h3>
          <p className="mt-1 text-sm text-orange-800/80 dark:text-orange-200/80">
            Friendly concierge style for patient-facing walkthroughs.
          </p>
        </div>
        <Smile className={cn("size-6 text-orange-700 dark:text-orange-300", active && "animate-pulse")} />
      </div>

      <div className="relative mt-6 space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <span
              key={`warm-dot-${index}`}
              className={cn(
                "voice-warm-dot h-3 rounded-full bg-orange-300/70 dark:bg-orange-300/50",
                active && "voice-warm-dot-live"
              )}
              style={{
                animationDelay: `${index * 90}ms`,
                opacity: 0.35 + Math.min(0.6, volumeLevel * 0.9),
              }}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-orange-200/80 bg-white/75 px-4 py-3 dark:border-orange-900/70 dark:bg-orange-950/35">
          <p className="text-sm font-medium text-orange-950 dark:text-orange-100">
            {isAssistantSpeaking ? "Chat Pearl is guiding the conversation." : "Chat Pearl is ready for the next question."}
          </p>
          <p className="mt-1 text-xs text-orange-800/80 dark:text-orange-200/80">
            Keep this mode for a softer, patient-friendly demo experience.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-orange-200/80 bg-white/80 px-3 py-2 text-sm text-orange-900 dark:border-orange-900/70 dark:bg-orange-950/35 dark:text-orange-100">
        {callState === "connecting" && "Preparing your friendly voice session..."}
        {callState === "active" && "Conversation is live."}
        {callState === "ended" && "Session complete. Start again anytime."}
        {callState === "error" && "We hit a connection issue. Retry from controls."}
        {callState === "idle" && "Ready for a warm and approachable voice demo."}
      </div>
    </div>
  );
}

