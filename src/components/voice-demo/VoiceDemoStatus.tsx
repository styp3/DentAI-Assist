"use client";

import { cn } from "@/lib/utils";
import { Activity, AudioLines, Mic, Radio } from "lucide-react";

type CallState = "idle" | "connecting" | "active" | "ended" | "error";

interface VoiceDemoStatusProps {
  callState: CallState;
  isAssistantSpeaking: boolean;
  isMuted: boolean;
}

function getStateLabel(callState: CallState) {
  if (callState === "active") return "Live";
  if (callState === "connecting") return "Connecting";
  if (callState === "ended") return "Ended";
  if (callState === "error") return "Issue";
  return "Ready";
}

export default function VoiceDemoStatus({
  callState,
  isAssistantSpeaking,
  isMuted,
}: VoiceDemoStatusProps) {
  const live = callState === "active";

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <div
        className={cn(
          "rounded-xl border px-3 py-2 text-sm",
          live
            ? "border-orange-300/70 bg-orange-50 text-orange-950 dark:bg-orange-950/26 dark:text-orange-100"
            : "border-border bg-card"
        )}>
        <div className="flex items-center gap-2">
          <Radio className={cn("size-4", live && "animate-pulse")} />
          <span className="font-medium">Call</span>
          <span className="ml-auto text-xs">{getStateLabel(callState)}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
          <AudioLines className={cn("size-4", isAssistantSpeaking && "animate-pulse")} />
          <span className="font-medium">Assistant</span>
          <span className="ml-auto text-xs">
            {isAssistantSpeaking ? "Speaking" : "Listening"}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
          {isMuted ? <Mic className="size-4" /> : <Activity className="size-4" />}
          <span className="font-medium">Microphone</span>
          <span className="ml-auto text-xs">{isMuted ? "Muted" : "Open"}</span>
        </div>
      </div>
    </div>
  );
}
