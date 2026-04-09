"use client";

import { BadgeCheck, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useVoiceDemoSession } from "@/hooks/use-voice-demo-session";
import VoiceDemoFallbackChat from "./VoiceDemoFallbackChat";
import VoiceDemoCaptions from "./VoiceDemoCaptions";
import VoiceDemoControls from "./VoiceDemoControls";
import VoiceDemoSessionSummary from "./VoiceDemoSessionSummary";
import VoiceDemoStatus from "./VoiceDemoStatus";
import VoiceDemoVariantSelector from "./VoiceDemoVariantSelector";
import type { VoiceDemoVariant } from "./types";
import MedicalClean from "./variants/MedicalClean";
import FuturisticOrb from "./variants/FuturisticOrb";
import WarmDental from "./variants/WarmDental";

function formatConnectionHint(callState: string, errorMessage: string | null) {
  if (errorMessage) return errorMessage;
  if (callState === "connecting") return "Requesting microphone access and connecting.";
  if (callState === "active") return "Live session in progress.";
  if (callState === "ended") return "Call ended successfully. You can restart instantly.";
  return "Use this panel to demo a real voice call with Chat Pearl.";
}

export default function VoiceDemoShell() {
  const [variant, setVariant] = useState<VoiceDemoVariant>("medical-clean");
  const [showCaptions, setShowCaptions] = useState(true);
  const {
    callState,
    isAssistantSpeaking,
    isMuted,
    volumeLevel,
    captions,
    interimCaption,
    errorMessage,
    micPermissionDenied,
    sessionDurationMs,
    startCall,
    endCall,
    toggleMute,
    resetSession,
  } = useVoiceDemoSession();
  const [showFallbackChat, setShowFallbackChat] = useState(false);

  useEffect(() => {
    if (micPermissionDenied) {
      setShowFallbackChat(true);
    }
  }, [micPermissionDenied]);

  const visual = useMemo(() => {
    if (variant === "medical-clean") {
      return (
        <MedicalClean
          callState={callState}
          isAssistantSpeaking={isAssistantSpeaking}
          volumeLevel={volumeLevel}
        />
      );
    }
    if (variant === "futuristic-orb") {
      return (
        <FuturisticOrb
          callState={callState}
          isAssistantSpeaking={isAssistantSpeaking}
          volumeLevel={volumeLevel}
        />
      );
    }
    return (
      <WarmDental
        callState={callState}
        isAssistantSpeaking={isAssistantSpeaking}
        volumeLevel={volumeLevel}
      />
    );
  }, [callState, isAssistantSpeaking, variant, volumeLevel]);

  return (
    <section className="space-y-5 rounded-3xl border border-primary/20 bg-card/60 p-5 shadow-sm backdrop-blur-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-primary uppercase">Admin demo lab</p>
          <h2 className="mt-1 text-2xl font-bold">Chat Pearl</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Interactive voice showcase with live captions for dentist client demos.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1">
            <ShieldCheck className="size-3.5 text-primary" />
            Admin-only demo
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1">
            <BadgeCheck className="size-3.5 text-primary" />
            Vapi transcript storage only
          </span>
        </div>
      </div>

      <Tabs value={variant} onValueChange={(value) => setVariant(value as VoiceDemoVariant)}>
        <VoiceDemoVariantSelector value={variant} />
        <TabsContent value={variant}>{visual}</TabsContent>
      </Tabs>

      <VoiceDemoStatus
        callState={callState}
        isAssistantSpeaking={isAssistantSpeaking}
        isMuted={isMuted}
      />

      <VoiceDemoControls
        callState={callState}
        isMuted={isMuted}
        showCaptions={showCaptions}
        onToggleCaptions={() => setShowCaptions((prev) => !prev)}
        onToggleMute={toggleMute}
        onStartCall={startCall}
        onEndCall={endCall}
        onResetSession={resetSession}
      />

      <p aria-live="polite" className="text-xs text-muted-foreground">
        {formatConnectionHint(callState, errorMessage)}
      </p>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowFallbackChat((prev) => !prev)}
        >
          {showFallbackChat ? "Hide text fallback" : "Use text fallback"}
        </Button>
      </div>

      <VoiceDemoCaptions
        showCaptions={showCaptions}
        captions={captions}
        interimCaption={interimCaption}
      />

      <VoiceDemoFallbackChat enabled={showFallbackChat} />

      <VoiceDemoSessionSummary
        show={callState === "ended" || callState === "error"}
        sessionDurationMs={sessionDurationMs}
        totalCaptions={captions.length}
      />
    </section>
  );
}
