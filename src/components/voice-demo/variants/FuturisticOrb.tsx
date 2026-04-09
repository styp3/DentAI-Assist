"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import type { VoiceVisualProps } from "./shared";

export default function FuturisticOrb({
  callState,
  isAssistantSpeaking,
  volumeLevel,
}: VoiceVisualProps) {
  const active = callState === "active";
  const orbScale = 1 + Math.min(0.24, volumeLevel * 0.4);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-[#070A14] p-6 text-slate-100 shadow-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.35),transparent_36%),radial-gradient(circle_at_80%_85%,rgba(16,185,129,0.3),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.08),rgba(16,185,129,0.06),rgba(99,102,241,0.08))]" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs tracking-wide text-cyan-300 uppercase">Orb mode</p>
          <h3 className="mt-1 text-xl font-semibold">Chat Pearl</h3>
          <p className="mt-1 text-sm text-slate-300">Futuristic AI showcase for premium client demos.</p>
        </div>
        <Sparkles className={cn("size-6 text-cyan-300", active && "animate-pulse")} />
      </div>

      <div className="relative mt-6 flex min-h-52 items-center justify-center">
        <span
          className={cn(
            "voice-orb-ring absolute size-44 rounded-full border border-cyan-300/40",
            active && "voice-orb-ring-live"
          )}
          style={{ animationDelay: "0ms" }}
        />
        <span
          className={cn(
            "voice-orb-ring absolute size-56 rounded-full border border-emerald-300/30",
            active && "voice-orb-ring-live"
          )}
          style={{ animationDelay: "260ms" }}
        />

        <div
          className={cn(
            "voice-orb relative size-36 rounded-full bg-[radial-gradient(circle_at_30%_25%,#67e8f9,#06b6d4_48%,#0f172a_100%)] shadow-[0_0_35px_rgba(14,165,233,0.45)] transition-transform duration-200",
            active && "voice-orb-live",
            isAssistantSpeaking && "shadow-[0_0_55px_rgba(34,211,238,0.65)]"
          )}
          style={{ transform: `scale(${orbScale})` }}
        >
          <div className="absolute inset-4 rounded-full border border-cyan-100/25" />
          <div className="absolute inset-8 rounded-full border border-emerald-100/20" />
        </div>
      </div>

      <div className="relative mt-1 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200">
        {callState === "connecting" && "Establishing secure voice channel..."}
        {callState === "active" && (isAssistantSpeaking ? "Signal active: assistant speaking." : "Signal active: waiting for user input.")}
        {callState === "ended" && "Channel closed. Demo can be restarted instantly."}
        {callState === "error" && "Signal interruption detected. Try reconnecting."}
        {callState === "idle" && "Orb is on standby for your next live conversation."}
      </div>
    </div>
  );
}

