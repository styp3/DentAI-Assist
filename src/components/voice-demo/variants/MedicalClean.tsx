"use client";

import { cn } from "@/lib/utils";
import { HeartPulse } from "lucide-react";
import type { VoiceVisualProps } from "./shared";

export default function MedicalClean({
  callState,
  isAssistantSpeaking,
  volumeLevel,
}: VoiceVisualProps) {
  const isLive = callState === "active";
  const barScale = Math.max(0.12, volumeLevel);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-linear-to-br from-orange-50 to-white p-6 shadow-sm dark:border-orange-900/60 dark:from-orange-950/40 dark:to-card">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(232,138,83,0.26),transparent_40%)]" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-orange-700 uppercase dark:text-orange-300">
            Medical mode
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Chat Pearl
          </h3>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            Calm consultation interface for clinical demos.
          </p>
        </div>
        <div className="rounded-xl border border-orange-300/70 bg-white/70 p-2 dark:bg-orange-950/40">
          <HeartPulse className={cn("size-6 text-orange-700 dark:text-orange-300", isLive && "animate-pulse")} />
        </div>
      </div>

      <div className="relative mt-6 flex items-end gap-1.5">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={`medical-bar-${index}`}
            className={cn(
              "voice-eq-bar block w-1.5 rounded-full bg-orange-500/80 dark:bg-orange-300/70",
              isLive && "voice-eq-bar-live"
            )}
            style={{
              height: `${Math.max(10, ((index % 6) + 1) * 8 * barScale)}px`,
              animationDelay: `${index * 70}ms`,
            }}
          />
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-orange-300/70 bg-white/80 px-3 py-2 text-sm text-slate-700 dark:border-orange-900/70 dark:bg-orange-950/40 dark:text-slate-200">
        {callState === "connecting" && "Connecting to Chat Pearl..."}
        {callState === "active" && (isAssistantSpeaking ? "Assistant is speaking." : "Assistant is listening.")}
        {callState === "ended" && "Session ended. Ready for another demo."}
        {callState === "error" && "Call issue detected. Retry from controls."}
        {callState === "idle" && "Ready to start a premium voice consultation demo."}
      </div>
    </div>
  );
}
