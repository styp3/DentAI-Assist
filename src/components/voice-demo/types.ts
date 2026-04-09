export type VoiceDemoVariant = "medical-clean" | "futuristic-orb" | "warm-dental";

export type CaptionRole = "assistant" | "user" | "system";

export interface CaptionLine {
  id: string;
  content: string;
  role: CaptionRole;
  timestamp: number;
}

export const VOICE_DEMO_VARIANTS: Array<{
  id: VoiceDemoVariant;
  label: string;
  description: string;
}> = [
  {
    id: "medical-clean",
    label: "Premium Medical Clean",
    description: "Crisp clinical cards with calm cyan indicators.",
  },
  {
    id: "futuristic-orb",
    label: "Futuristic AI Orb",
    description: "High-contrast neon orb with reactive signal rings.",
  },
  {
    id: "warm-dental",
    label: "Warm Dental Friendly",
    description: "Soft friendly gradient with approachable status cues.",
  },
];

