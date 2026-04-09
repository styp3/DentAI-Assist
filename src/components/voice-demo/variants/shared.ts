export interface VoiceVisualProps {
  callState: "idle" | "connecting" | "active" | "ended" | "error";
  isAssistantSpeaking: boolean;
  volumeLevel: number;
}

