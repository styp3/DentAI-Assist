"use client";

import { Button } from "@/components/ui/button";
import { Captions, CaptionsOff, Mic, MicOff, Phone, PhoneOff } from "lucide-react";

type CallState = "idle" | "connecting" | "active" | "ended" | "error";

interface VoiceDemoControlsProps {
  callState: CallState;
  isMuted: boolean;
  showCaptions: boolean;
  onToggleCaptions: () => void;
  onToggleMute: () => void;
  onStartCall: () => void;
  onEndCall: () => void;
  onResetSession: () => void;
}

export default function VoiceDemoControls({
  callState,
  isMuted,
  showCaptions,
  onToggleCaptions,
  onToggleMute,
  onStartCall,
  onEndCall,
  onResetSession,
}: VoiceDemoControlsProps) {
  const connecting = callState === "connecting";
  const active = callState === "active";
  const ended = callState === "ended";
  const hasError = callState === "error";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!active ? (
        <Button
          size="lg"
          className="min-w-44"
          disabled={connecting}
          onClick={onStartCall}>
          <Phone className="size-4" />
          {connecting ? "Connecting..." : "Start voice demo"}
        </Button>
      ) : (
        <Button
          size="lg"
          variant="destructive"
          className="min-w-44"
          onClick={onEndCall}>
          <PhoneOff className="size-4" />
          End call
        </Button>
      )}

      <Button
        variant="outline"
        size="lg"
        onClick={onToggleMute}
        disabled={!active}
        aria-pressed={isMuted}
      >
        {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        {isMuted ? "Unmute mic" : "Mute mic"}
      </Button>

      <Button variant="outline" size="lg" onClick={onToggleCaptions} aria-pressed={showCaptions}>
        {showCaptions ? <Captions className="size-4" /> : <CaptionsOff className="size-4" />}
        {showCaptions ? "Hide captions" : "Show captions"}
      </Button>

      {(ended || hasError) && (
        <Button variant="ghost" size="lg" onClick={onResetSession}>
          Reset
        </Button>
      )}
    </div>
  );
}
