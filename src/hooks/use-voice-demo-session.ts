"use client";

import { vapi } from "@/lib/vapi";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CaptionLine, CaptionRole } from "@/components/voice-demo/types";

type CallState = "idle" | "connecting" | "active" | "ended" | "error";

type TranscriptMessage = {
  type?: string;
  transcriptType?: "final" | "partial";
  transcript?: string;
  role?: string;
};

function getCaptionRole(role?: string): CaptionRole {
  if (role === "assistant") return "assistant";
  if (role === "user") return "user";
  return "system";
}

function toErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const value = (error as { message?: unknown }).message;
    if (typeof value === "string") return value;
  }
  return "Unable to start a call. Please check your microphone permissions.";
}

function isMicPermissionError(error: unknown) {
  if (error && typeof error === "object" && "name" in error) {
    const name = (error as { name?: unknown }).name;
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      return true;
    }
  }
  const message = toErrorMessage(error).toLowerCase();
  return (
    message.includes("permission") ||
    message.includes("notallowederror") ||
    message.includes("not allowed")
  );
}

export function useVoiceDemoSession() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [captions, setCaptions] = useState<CaptionLine[]>([]);
  const [interimCaption, setInterimCaption] = useState<CaptionLine | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);

  useEffect(() => {
    const handleCallStart = () => {
      setCallState("active");
      setIsAssistantSpeaking(false);
      setErrorMessage(null);
      setStartedAt(Date.now());
      setEndedAt(null);
      setMicPermissionDenied(false);
    };

    const handleCallEnd = () => {
      setCallState("ended");
      setIsAssistantSpeaking(false);
      setInterimCaption(null);
      setVolumeLevel(0);
      setEndedAt(Date.now());
    };

    const handleSpeechStart = () => setIsAssistantSpeaking(true);
    const handleSpeechEnd = () => setIsAssistantSpeaking(false);

    const handleVolumeLevel = (value: number) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        setVolumeLevel(Math.max(0, Math.min(value, 1)));
      }
    };

    const handleMessage = (message: TranscriptMessage) => {
      if (message.type !== "transcript") return;
      const transcript = message.transcript?.trim();
      if (!transcript) return;

      const role = getCaptionRole(message.role);
      const nextLine: CaptionLine = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        content: transcript,
        role,
        timestamp: Date.now(),
      };

      if (message.transcriptType === "partial") {
        setInterimCaption(nextLine);
        return;
      }

      setInterimCaption(null);
      setCaptions((prev) => [...prev, nextLine]);
    };

    const handleError = (error: unknown) => {
      setCallState("error");
      setIsAssistantSpeaking(false);
      setErrorMessage(toErrorMessage(error));
      setVolumeLevel(0);
      setMicPermissionDenied(isMicPermissionError(error));
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("volume-level", handleVolumeLevel)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("volume-level", handleVolumeLevel)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const startCall = useCallback(async () => {
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      setCallState("error");
      setErrorMessage("Missing NEXT_PUBLIC_VAPI_ASSISTANT_ID in environment.");
      return;
    }

    setCaptions([]);
    setInterimCaption(null);
    setErrorMessage(null);
    setCallState("connecting");
    setEndedAt(null);
    setMicPermissionDenied(false);

    try {
      await vapi.start(assistantId);
    } catch (error) {
      setCallState("error");
      setErrorMessage(toErrorMessage(error));
      setMicPermissionDenied(isMicPermissionError(error));
    }
  }, []);

  const endCall = useCallback(async () => {
    await vapi.stop();
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    vapi.setMuted(nextMuted);
    setIsMuted(nextMuted);
  }, [isMuted]);

  const resetSession = useCallback(() => {
    setCaptions([]);
    setInterimCaption(null);
    setErrorMessage(null);
    setCallState("idle");
    setStartedAt(null);
    setEndedAt(null);
    setVolumeLevel(0);
    setIsAssistantSpeaking(false);
    setMicPermissionDenied(false);
  }, []);

  const sessionDurationMs = useMemo(() => {
    if (!startedAt) return 0;
    if (!endedAt && callState === "active") return Date.now() - startedAt;
    if (!endedAt) return 0;
    return Math.max(0, endedAt - startedAt);
  }, [callState, endedAt, startedAt]);

  return {
    callState,
    isAssistantSpeaking,
    isMuted,
    volumeLevel,
    captions,
    interimCaption,
    errorMessage,
    micPermissionDenied,
    startedAt,
    endedAt,
    sessionDurationMs,
    startCall,
    endCall,
    toggleMute,
    resetSession,
  };
}
