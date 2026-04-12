"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactSiriwave, { type IReactSiriwaveProps } from "react-siriwave";
import { Sparkles, Mic, MicOff, PhoneOff, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PremiumPageShell,
  PremiumPanel,
  PremiumStageContainer,
  PremiumStatusPill,
  PremiumTranscriptDock,
  PremiumViewport,
} from "@/components/premium/surface";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CaptionLine } from "@/components/voice-demo/types";
import { useVoiceDemoSession } from "@/hooks/use-voice-demo-session";
import { cn } from "@/lib/utils";

type DemoMode = "circlewaveform" | "siri" | "glob";
type StageCallState = "idle" | "connecting" | "active" | "ended" | "error";
type VisualPhase = "idle" | "connecting" | "active" | "settled";
type ModeAccent = {
  border: string;
  glow: string;
  sweep: string;
  wash: string;
};

const MODES: Array<{ value: DemoMode; label: string; description: string }> = [
  {
    value: "circlewaveform",
    label: "CircleWaveform",
    description: "Radial bars with a charged halo and tight response.",
  },
  {
    value: "siri",
    label: "Siri",
    description: "Edge-to-edge carrier wave with a fluid sweep.",
  },
  {
    value: "glob",
    label: "Glob",
    description: "A fluid orb core with organic internal motion.",
  },
];

const EASE_EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_QUART_OUT: [number, number, number, number] = [0.25, 1, 0.5, 1];
const EASE_EXPO_IN_OUT: [number, number, number, number] = [0.87, 0, 0.13, 1];

function getModeAccent(mode: DemoMode): ModeAccent {
  if (mode === "circlewaveform") {
    return {
      border: "rgba(232, 138, 83, 0.18)",
      glow: "rgba(232, 138, 83, 0.12)",
      sweep:
        "linear-gradient(115deg, rgba(232,138,83,0.08), transparent 34%, rgba(120,113,108,0.06) 70%, transparent)",
      wash: "radial-gradient(circle at 50% 48%, rgba(232,138,83,0.12), transparent 68%)",
    };
  }

  if (mode === "siri") {
    return {
      border: "rgba(232, 138, 83, 0.18)",
      glow: "rgba(232, 138, 83, 0.12)",
      sweep:
        "linear-gradient(90deg, transparent 0%, rgba(232,138,83,0.08) 22%, rgba(120,113,108,0.14) 50%, rgba(232,138,83,0.08) 78%, transparent 100%)",
      wash: "radial-gradient(circle at 50% 50%, rgba(232,138,83,0.12), transparent 70%)",
    };
  }

  return {
    border: "rgba(232, 138, 83, 0.18)",
    glow: "rgba(232, 138, 83, 0.12)",
    sweep:
      "linear-gradient(125deg, rgba(232,138,83,0.08), transparent 32%, rgba(120,113,108,0.06) 72%, transparent)",
    wash: "radial-gradient(circle at 50% 46%, rgba(232,138,83,0.14), transparent 66%)",
  };
}

function formatCaptionTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getCallStatusText(callState: StageCallState) {
  switch (callState) {
    case "connecting":
      return "Calling Pearl...";
    case "active":
      return "Live session";
    case "ended":
      return "Call ended";
    case "error":
      return "Call failed";
    default:
      return "Ready";
  }
}

function getVisualPhase(callState: StageCallState): VisualPhase {
  if (callState === "connecting") return "connecting";
  if (callState === "active") return "active";
  if (callState === "ended" || callState === "error") return "settled";
  return "idle";
}

function getStageMotion(mode: DemoMode, phase: VisualPhase, reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      animate: { scale: 1, rotate: 0, y: 0 },
      transition: { duration: 0 },
    };
  }

  if (mode === "circlewaveform") {
    return {
      animate: {
        scale: phase === "connecting" ? [1, 1.01, 1] : phase === "active" ? [1, 1.004, 1] : 1,
        rotate: phase === "connecting" ? [0, 0.18, -0.12, 0] : 0,
        y: phase === "connecting" ? [0, -0.8, 0] : [0, 0, 0],
      },
      transition: {
        duration: phase === "connecting" ? 1.9 : phase === "active" ? 3.4 : 0.32,
        repeat: phase === "idle" ? 0 : Number.POSITIVE_INFINITY,
        ease: EASE_QUART_OUT,
      },
    };
  }

  if (mode === "siri") {
    return {
      animate: {
        scale: phase === "connecting" ? [1, 1.008, 1] : phase === "active" ? [1, 1.003, 1] : 1,
        rotate: phase === "connecting" ? [0, 0.1, -0.1, 0] : 0,
        y: phase === "connecting" ? [0, -0.5, 0] : [0, 0, 0],
      },
      transition: {
        duration: phase === "connecting" ? 1.6 : phase === "active" ? 3.2 : 0.28,
        repeat: phase === "idle" ? 0 : Number.POSITIVE_INFINITY,
        ease: EASE_QUART_OUT,
      },
    };
  }

  return {
    animate: {
      scale: phase === "connecting" ? [1, 1.012, 1] : phase === "active" ? [1, 1.004, 1] : 1,
      rotate: phase === "connecting" ? [0, 0.45, -0.2, 0] : 0,
      y: phase === "connecting" ? [0, -0.6, 0] : [0, 0, 0],
    },
    transition: {
      duration: phase === "connecting" ? 2.4 : phase === "active" ? 3.8 : 0.28,
      repeat: phase === "idle" ? 0 : Number.POSITIVE_INFINITY,
      ease: EASE_QUART_OUT,
    },
  };
}

function StageAccent({
  mode,
  phase,
  reducedMotion,
  energy,
}: {
  mode: DemoMode;
  phase: VisualPhase;
  reducedMotion: boolean;
  energy: number;
}) {
  const accent = getModeAccent(mode);
  const phaseOpacity =
    phase === "connecting" ? 0.82 : phase === "active" ? 0.74 : phase === "settled" ? 0.24 : 0.18;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10 rounded-[1.4rem]"
      initial={false}
      animate={
        reducedMotion
          ? { opacity: phaseOpacity, scale: 1 }
          : {
              opacity:
                phase === "connecting"
                  ? [phaseOpacity * 0.72, phaseOpacity, phaseOpacity * 0.72]
                  : phase === "active"
                    ? [phaseOpacity * 0.84, phaseOpacity + Math.min(0.08, energy * 0.18), phaseOpacity * 0.84]
                    : phaseOpacity,
              scale:
                phase === "connecting"
                  ? [0.994, 1, 0.994]
                  : phase === "active"
                    ? [0.998, 1.003, 0.998]
                    : 1,
            }
      }
      transition={{
        duration: phase === "connecting" ? 1.2 : phase === "active" ? 2.1 : 0.35,
        repeat: reducedMotion || phase === "idle" || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
        ease: EASE_QUART_OUT,
      }}
    >
      <div
        className="absolute inset-0 rounded-[1.4rem] border"
        style={{
          borderColor: accent.border,
          boxShadow: `inset 0 0 42px ${accent.glow}`,
        }}
      />
      <div
        className="absolute inset-0 rounded-[1.4rem] opacity-80"
        style={{ backgroundImage: accent.sweep }}
      />
      <div
        className="absolute inset-[12%] rounded-[1.2rem] blur-3xl"
        style={{ backgroundImage: accent.wash }}
      />
    </motion.div>
  );
}

function ModePrelude({
  mode,
  phase,
  accent,
  reducedMotion,
}: {
  mode: DemoMode;
  phase: VisualPhase;
  accent: string;
  reducedMotion: boolean;
}) {
  if (reducedMotion) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] border",
          phase === "connecting" ? "border-white/16" : "border-white/[0.06]"
        )}
      />
    );
  }

  if (phase === "active" && mode === "circlewaveform") {
    return null;
  }

  if (mode === "siri") {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        initial={false}
        animate={{
          opacity: phase === "idle" ? 0.16 : phase === "connecting" ? 0.38 : 0.2,
        }}
        transition={{ duration: 0.3, ease: EASE_QUART_OUT }}
      >
        <motion.div
          className="absolute inset-x-[12%] top-1/2 h-px -translate-y-1/2 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 18%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.04) 82%, transparent 100%)",
            boxShadow: `0 0 24px ${accent}`,
          }}
          animate={{
            opacity: phase === "connecting" ? [0.28, 0.82, 0.28] : phase === "active" ? [0.16, 0.26, 0.16] : 0.14,
            scaleX: phase === "connecting" ? [0.98, 1.02, 0.98] : phase === "active" ? [0.992, 1.008, 0.992] : 1,
          }}
          transition={{
            duration: phase === "connecting" ? 0.95 : 1.6,
            repeat: phase === "idle" ? 0 : Number.POSITIVE_INFINITY,
            ease: EASE_QUART_OUT,
          }}
        />
      </motion.div>
    );
  }

  if (mode === "circlewaveform") {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        initial={false}
        animate={{
          opacity: phase === "idle" ? 0.12 : phase === "connecting" ? 0.28 : 0.1,
        }}
        transition={{ duration: 0.3, ease: EASE_QUART_OUT }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            borderColor: "rgba(94, 234, 212, 0.24)",
            boxShadow: `0 0 36px ${accent}`,
          }}
          animate={{
            scale: phase === "connecting" ? [0.88, 1.06, 1.16] : phase === "active" ? [0.98, 1.03, 1.08] : 1,
            opacity: phase === "connecting" ? [0.24, 0.62, 0] : phase === "active" ? [0.12, 0.26, 0] : 0.12,
          }}
          transition={{
            duration: phase === "connecting" ? 0.85 : 1.35,
            repeat: phase === "idle" ? 0 : Number.POSITIVE_INFINITY,
            ease: EASE_EXPO_OUT,
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      initial={false}
      animate={{
        opacity: phase === "idle" ? 0.12 : phase === "connecting" ? 0.28 : 0.16,
      }}
      transition={{ duration: 0.3, ease: EASE_QUART_OUT }}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.03), transparent 58%)",
        }}
        animate={{
          scale: phase === "connecting" ? [0.992, 1.01, 0.992] : phase === "active" ? [0.996, 1.006, 0.996] : 1,
        }}
        transition={{
          duration: phase === "connecting" ? 1.0 : 2.4,
          repeat: phase === "idle" ? 0 : Number.POSITIVE_INFINITY,
          ease: EASE_EXPO_IN_OUT,
        }}
      />
    </motion.div>
  );
}

function CircleWaveformMode({
  active,
  phase,
  volumeLevel,
  smoothedVolume,
  reducedMotion,
  onToggleCall,
}: {
  active: boolean;
  phase: VisualPhase;
  volumeLevel: number;
  smoothedVolume: number;
  reducedMotion: boolean;
  onToggleCall: () => void;
}) {
  const pulse = 1 + Math.min(0.18, smoothedVolume * 0.22);
  const baseEnergy =
    phase === "active" ? smoothedVolume : phase === "connecting" ? 0.16 : 0.06;
  const reactiveEnergy = Math.max(baseEnergy, volumeLevel * 0.45);
  const roundCoord = (value: number) => Number(value.toFixed(3));

  const bars = Array.from({ length: 72 }, (_, i) => {
    const angle = (i / 72) * Math.PI * 2;
    const wave = Math.sin(i * 0.55 + reactiveEnergy * 10);
    const gain = active
      ? 14 + (wave + 1) * 12 + reactiveEnergy * 42
      : phase === "connecting"
        ? 16 + (wave + 1) * 8
        : 10 + (wave + 1) * 4;
    const inner = 184;
    const outer = inner + gain;

    return {
      x1: roundCoord(300 + Math.cos(angle) * inner),
      y1: roundCoord(300 + Math.sin(angle) * inner),
      x2: roundCoord(300 + Math.cos(angle) * outer),
      y2: roundCoord(300 + Math.sin(angle) * outer),
    };
  });

  return (
    <motion.div
      className={cn(
        "relative flex h-full min-h-[24rem] w-full items-center justify-center overflow-hidden rounded-[1.8rem] border",
        "border-orange-200/12 bg-[radial-gradient(circle_at_50%_40%,rgba(17,12,8,0.98),rgba(1,1,1,1)_64%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_24px_60px_rgba(0,0,0,0.58)]"
      )}
      initial={false}
      animate={
        reducedMotion
          ? { scale: 1, rotate: 0 }
          : {
              scale: phase === "connecting" ? [1, 1.008, 1] : phase === "active" ? [1, 1.006, 1] : 1,
              rotate: phase === "connecting" ? [0, 0.16, -0.16, 0] : phase === "idle" ? [0, -0.08, 0.08, 0] : 0,
            }
      }
      transition={{
        duration: phase === "connecting" ? 1.8 : phase === "active" ? 2.6 : 3.8,
        repeat: phase === "idle" || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
        ease: EASE_QUART_OUT,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(232,138,83,0.04),transparent_38%,rgba(120,113,108,0.035)_72%,transparent)]" />
      <ModePrelude mode="circlewaveform" phase={phase} accent="#e88a53" reducedMotion={reducedMotion} />

      <motion.svg
        viewBox="0 0 600 600"
        className="absolute h-[clamp(320px,70vmin,620px)] w-[clamp(320px,70vmin,620px)] text-orange-200/80"
        animate={
          reducedMotion
            ? { scale: 1 }
            : {
                scale:
                  phase === "active"
                    ? [1, 1.01, 1]
                    : phase === "connecting"
                      ? [0.985, 1.016, 0.985]
                      : 1,
                rotate:
                  phase === "connecting"
                    ? [0, 2.4, 0, -2.4, 0]
                    : phase === "idle"
                      ? [0, -0.5, 0.5, 0]
                      : 0,
              }
        }
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
                duration: phase === "connecting" ? 1.25 : phase === "active" ? 2.2 : 3.6,
                repeat: phase === "idle" || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
                ease: EASE_QUART_OUT,
              }
      }
      >
        {bars.map((bar, index) => (
          <motion.line
            key={`cw-${index}`}
            x1={bar.x1}
            y1={bar.y1}
            x2={bar.x2}
            y2={bar.y2}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3"
            initial={false}
            animate={{
              opacity: active ? 0.98 : phase === "connecting" ? 0.78 : 0.52,
              x2: bar.x2,
              y2: bar.y2,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
            }}
          />
        ))}
      </motion.svg>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        animate={
          reducedMotion
            ? { scale: 1 }
            : {
                scale: active ? pulse : phase === "connecting" ? 1.01 : 1,
              }
        }
        transition={{ duration: 0.24, ease: EASE_QUART_OUT }}
      >
        <motion.button
          type="button"
          onClick={onToggleCall}
          aria-label={active ? "End voice demo" : "Start voice demo"}
          className={cn(
            "relative inline-flex size-24 items-center justify-center rounded-3xl border text-orange-100",
            "border-orange-300/30 bg-[rgba(18,12,8,0.76)]",
            "shadow-[0_0_30px_rgba(232,138,83,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]",
            "transition-[transform,border-color,background-color,box-shadow,color] duration-200",
            "hover:border-orange-200/50 hover:bg-[rgba(22,16,11,0.86)] hover:shadow-[0_0_34px_rgba(232,138,83,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]",
            "focus-visible:border-orange-100 focus-visible:ring-3 focus-visible:ring-orange-200/55",
            "active:scale-[0.97]"
          )}
          whileHover={reducedMotion ? undefined : { scale: 1.03 }}
          whileTap={reducedMotion ? undefined : { scale: 0.965 }}
          animate={
            reducedMotion
              ? undefined
              : {
                  scale: active ? pulse : phase === "connecting" ? 1.01 : 1,
                  boxShadow:
                    phase === "active"
                      ? "0 0 36px rgba(232, 138, 83, 0.18), inset 0 1px 0 rgba(255,255,255,0.05)"
                      : phase === "connecting"
                        ? "0 0 28px rgba(232, 138, 83, 0.12), inset 0 1px 0 rgba(255,255,255,0.05)"
                        : "0 0 24px rgba(232, 138, 83, 0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
                }
          }
          transition={{ duration: 0.22, ease: EASE_QUART_OUT }}
        >
          <motion.span
            className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-orange-200/16"
            animate={
              reducedMotion
                ? { opacity: phase === "connecting" ? 0.45 : 0 }
                : {
                    opacity: phase === "connecting" ? [0.18, 0.62, 0.18] : active ? 0.16 : 0,
                    scale:
                      phase === "connecting"
                        ? [0.92, 1.08, 0.92]
                        : active
                          ? [1, 1.03, 1]
                          : 1,
                    rotate: phase === "connecting" ? 360 : 0,
                  }
            }
            transition={{
              duration: phase === "connecting" ? 1.15 : 2.4,
              repeat: phase === "idle" ? 0 : Number.POSITIVE_INFINITY,
              ease: phase === "connecting" ? "linear" : EASE_QUART_OUT,
            }}
          />
          <motion.span
            className="pointer-events-none absolute -inset-7 rounded-[2.25rem] border border-orange-100/10"
            animate={
              reducedMotion
                ? { opacity: phase === "connecting" ? 0.28 : 0 }
                : {
                    opacity: phase === "connecting" ? [0.08, 0.34, 0.08] : 0,
                    scale: phase === "connecting" ? [0.98, 1.12, 0.98] : 1,
                    rotate: phase === "connecting" ? -360 : 0,
                  }
            }
            transition={{
              duration: 1.8,
              repeat: phase === "connecting" ? Number.POSITIVE_INFINITY : 0,
              ease: "linear",
            }}
          />
          <span
            className={cn(
              "absolute inset-0 rounded-3xl border",
              phase === "active" ? "border-orange-200/22" : "border-white/6"
            )}
          />
          {active ? <PhoneOff className="size-9" /> : <Mic className="size-9" />}
        </motion.button>

        <motion.div
          className="pointer-events-none rounded-full border px-4 py-2 text-xs font-medium tracking-wide"
          style={{
            borderColor: phase === "active" ? "rgba(110, 231, 183, 0.24)" : "rgba(255,255,255,0.1)",
            backgroundColor:
              phase === "active"
                ? "rgba(4, 10, 8, 0.82)"
                : phase === "connecting"
                  ? "rgba(3, 12, 16, 0.82)"
                  : "rgba(5, 8, 14, 0.76)",
            color: phase === "active" ? "#f4efe9" : "#f4efe9",
            boxShadow:
              phase === "active"
                ? "0 0 18px rgba(232, 138, 83, 0.12)"
                : "0 0 14px rgba(232, 138, 83, 0.08)",
          }}
          animate={
            reducedMotion
              ? { opacity: 1 }
              : {
                  opacity: phase === "idle" ? 0.7 : 1,
                  y: phase === "connecting" ? [0, -1, 0] : [0, 0.5, 0],
                }
          }
          transition={{
            duration: phase === "connecting" ? 1.05 : 2.2,
            repeat: phase === "connecting" ? Number.POSITIVE_INFINITY : 0,
            ease: EASE_EXPO_OUT,
          }}
        >
          {phase === "connecting"
            ? "Dialing pulse"
            : active
              ? "Live waveform"
              : "Ready to start"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function SiriMode({
  active,
  phase,
  volumeLevel,
  smoothedVolume,
  dominantSpeaker,
  reducedMotion,
  onToggleCall,
}: {
  active: boolean;
  phase: VisualPhase;
  volumeLevel: number;
  smoothedVolume: number;
  dominantSpeaker: "assistant" | "user" | "system" | "unknown";
  reducedMotion: boolean;
  onToggleCall: () => void;
}) {
  const speakerWeight =
    dominantSpeaker === "assistant" ? 1.18 : dominantSpeaker === "user" ? 0.72 : 1;
  const targetIntensity = Math.min(
    1,
    (active ? (dominantSpeaker === "assistant" ? 0.2 : 0.1) : 0.06) +
      smoothedVolume * (active ? 3.75 * speakerWeight : 1.6) +
      volumeLevel * (active ? 0.22 * speakerWeight : 0.08) +
      (phase === "connecting" ? 0.12 : 0)
  );
  const [siriIntensity, setSiriIntensity] = useState(targetIntensity);

  useEffect(() => {
    const damping = reducedMotion ? 0.4 : phase === "active" ? 0.14 : 0.24;
    setSiriIntensity((previous) => previous + (targetIntensity - previous) * damping);
  }, [targetIntensity, phase, reducedMotion]);

  const siriConfig = useMemo<IReactSiriwaveProps>(
    () => ({
      theme: "ios9",
      ratio: 1,
      speed: active ? 0.14 + siriIntensity * 0.16 : phase === "connecting" ? 0.108 : 0.065,
      amplitude: active ? 0.9 + siriIntensity * 3.3 : phase === "connecting" ? 1.05 : 0.45,
      frequency: active ? 3.0 + siriIntensity * 3.1 : phase === "connecting" ? 3.2 : 2.15,
      color: "#f2a46b",
      cover: true,
      width: 3600,
      height: 460,
      autostart: true,
      pixelDepth: 0.48,
      lerpSpeed: 0.12,
    }),
    [active, phase, siriIntensity]
  );

  return (
    <motion.div
      className={cn(
        "relative flex h-full min-h-[24rem] w-full flex-col overflow-hidden rounded-[1.8rem] border",
        "border-orange-200/12 bg-[radial-gradient(circle_at_50%_38%,rgba(20,12,8,0.96),rgba(1,1,1,1)_66%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.58)]"
      )}
      initial={false}
      animate={
        reducedMotion
          ? { scale: 1, rotate: 0 }
          : {
              scale: phase === "connecting" ? [1, 1.008, 1] : phase === "active" ? [1, 1.004, 1] : 1,
              rotate: phase === "connecting" ? [0, 0.12, -0.12, 0] : 0,
            }
      }
      transition={{
        duration: phase === "connecting" ? 1.7 : 2.8,
        repeat: phase === "idle" || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
        ease: EASE_QUART_OUT,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(232,138,83,0.035),transparent_36%,rgba(120,113,108,0.03)_72%,transparent)]" />
      <ModePrelude mode="siri" phase={phase} accent="#f59e0b" reducedMotion={reducedMotion} />

      <motion.div
        className="pointer-events-none absolute top-6 left-1/2 z-20 -translate-x-1/2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide"
        style={{
          borderColor: phase === "active" ? "rgba(232, 138, 83, 0.24)" : "rgba(255,255,255,0.08)",
          backgroundColor:
            phase === "active"
              ? "rgba(3, 10, 16, 0.86)"
              : "rgba(3, 8, 12, 0.8)",
          color: "#f4efe9",
          boxShadow:
            phase === "active"
              ? "0 0 18px rgba(232, 138, 83, 0.1)"
              : "0 0 12px rgba(232, 138, 83, 0.06)",
        }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: phase === "idle" ? 0.72 : 1 }}
        transition={{ duration: 0.22, ease: EASE_QUART_OUT }}
      >
        {phase === "connecting" ? "Carrier lock" : active ? "Live wave" : "Ready to call"}
      </motion.div>

      <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-0 sm:px-1 lg:px-2">
        <motion.div
          className="relative h-[clamp(300px,38vw,470px)] w-full overflow-hidden"
          animate={
            reducedMotion
              ? { scaleX: 1, opacity: 1, y: 0 }
              : {
                  scaleX: phase === "connecting" ? [0.996, 1.008, 0.996] : 1,
                  opacity: phase === "idle" ? 0.95 : 1,
                  y: phase === "connecting" ? [0, 2, 0] : 0,
                }
          }
          transition={{
            duration: phase === "connecting" ? 1.1 : 0.35,
            repeat: phase === "connecting" ? Number.POSITIVE_INFINITY : 0,
            ease: EASE_EXPO_IN_OUT,
          }}
        >
          <motion.div
            className="pointer-events-none absolute inset-x-[4%] top-[40%] h-[18%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,138,83,0.34),rgba(232,138,83,0.14)_34%,transparent_78%)] blur-2xl"
            animate={
              reducedMotion
                ? { opacity: 0.3 + siriIntensity * 0.3 }
                : {
                    opacity: 0.24 + siriIntensity * 0.54,
                    scaleX: 0.96 + siriIntensity * 0.1,
                  }
            }
            transition={{ duration: 0.26, ease: EASE_QUART_OUT }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-[14%] top-[31%] h-[38%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,138,83,0.12),rgba(232,138,83,0.06)_32%,transparent_72%)] blur-3xl"
            animate={
              reducedMotion
                ? { opacity: phase === "active" ? 0.24 : 0.18 }
                : { opacity: phase === "active" ? 0.18 + siriIntensity * 0.2 : 0.16 }
            }
            transition={{ duration: 0.32, ease: EASE_QUART_OUT }}
          />
          <div className="relative h-full w-full overflow-hidden">
            <ReactSiriwave {...siriConfig} />
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={onToggleCall}
        aria-label={active ? "End voice demo" : "Start voice demo"}
        className={cn(
          "absolute bottom-7 left-1/2 z-20 inline-flex -translate-x-1/2 items-center justify-center rounded-2xl border px-5 py-3",
          "border-orange-200/18 bg-[rgba(18,12,8,0.74)] text-orange-50",
          "shadow-[0_0_24px_rgba(232,138,83,0.1),inset_0_1px_0_rgba(255,255,255,0.04)]",
          "transition-[transform,border-color,background-color,box-shadow,color] duration-200",
          "hover:border-orange-100/35 hover:bg-[rgba(22,16,11,0.92)] hover:shadow-[0_0_28px_rgba(232,138,83,0.16),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "focus-visible:border-orange-100 focus-visible:ring-3 focus-visible:ring-orange-200/55",
          "active:scale-[0.97]"
        )}
        whileHover={reducedMotion ? undefined : { scale: 1.04 }}
        whileTap={reducedMotion ? undefined : { scale: 0.965 }}
      >
        <motion.span
          className="pointer-events-none absolute -inset-4 rounded-[1.35rem] border border-orange-200/14"
          animate={
            reducedMotion
              ? { opacity: phase === "connecting" ? 0.45 : 0 }
              : {
                  opacity: phase === "connecting" ? [0.16, 0.58, 0.16] : active ? 0.1 : 0,
                  scale: phase === "connecting" ? [0.94, 1.08, 0.94] : 1,
                }
          }
          transition={{
            duration: phase === "connecting" ? 1.1 : 2.4,
            repeat: phase === "connecting" ? Number.POSITIVE_INFINITY : 0,
            ease: EASE_QUART_OUT,
          }}
        />
        {active ? <PhoneOff className="size-5" /> : <Mic className="size-5" />}
      </motion.button>
    </motion.div>
  );
}

function GlobMode({
  active,
  phase,
  volumeLevel,
  smoothedVolume,
  dominantSpeaker,
  reducedMotion,
  onToggleCall,
}: {
  active: boolean;
  phase: VisualPhase;
  volumeLevel: number;
  smoothedVolume: number;
  dominantSpeaker: "assistant" | "user" | "system" | "unknown";
  reducedMotion: boolean;
  onToggleCall: () => void;
}) {
  const speakerWeight =
    dominantSpeaker === "assistant" ? 1.22 : dominantSpeaker === "user" ? 0.78 : 0.92;
  const voiceEnergy = Math.min(
    1,
    smoothedVolume * (1.5 * speakerWeight) + volumeLevel * (0.14 * speakerWeight)
  );
  const phaseBoost = phase === "connecting" ? 0.32 : phase === "active" ? 0.18 : 0.06;
  const morph = Math.min(1, voiceEnergy + phaseBoost);
  const orbScale = 1 + Math.min(phase === "connecting" ? 0.072 : phase === "active" ? 0.05 : 0.018, morph * 0.09);
  const drift = phase === "connecting" ? [0, -2, 0] : phase === "active" ? [0, -1, 0] : [0, -0.3, 0];
  const phaseLabel = phase === "connecting" ? "Acquiring signal" : active ? "Live glob" : "Ready to call";
  const fluidDuration = phase === "connecting" ? 3.2 : phase === "active" ? 4.8 : 10.8;
  const glowTarget =
    phase === "connecting"
      ? 0.24 + voiceEnergy * 0.2
      : active
        ? 0.1 + voiceEnergy * 0.46
        : 0.08;
  const [assistantGlow, setAssistantGlow] = useState(glowTarget);

  useEffect(() => {
    const damping = reducedMotion ? 0.34 : phase === "active" ? 0.08 : 0.16;
    setAssistantGlow((previous) => previous + (glowTarget - previous) * damping);
  }, [glowTarget, phase, reducedMotion]);

  return (
    <motion.div
      className={cn(
        "relative flex h-full min-h-[24rem] w-full items-center justify-center overflow-hidden rounded-[1.8rem] border",
        "border-orange-200/12 bg-[radial-gradient(circle_at_50%_34%,rgba(14,11,8,0.98),rgba(4,3,3,1)_54%,rgba(1,1,1,1)_100%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.6)]"
      )}
      initial={false}
      animate={
        reducedMotion
          ? { scale: 1, rotate: 0 }
          : {
              scale: phase === "connecting" ? [1, 1.003, 1] : phase === "active" ? [1, 1.002, 1] : 1,
              rotate: phase === "connecting" ? [0, 0.06, -0.06, 0] : 0,
            }
      }
      transition={{
        duration: phase === "connecting" ? 1.6 : 2.8,
        repeat: phase === "idle" || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
        ease: EASE_QUART_OUT,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(146deg,rgba(232,138,83,0.028),transparent_34%,rgba(122,103,88,0.022)_74%,transparent)]" />

      <motion.div
        className="pointer-events-none absolute top-6 left-1/2 z-20 -translate-x-1/2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide"
        style={{
          borderColor: phase === "active" ? "rgba(232,138,83,0.24)" : "rgba(255,255,255,0.08)",
          backgroundColor: phase === "active" ? "rgba(3,10,16,0.86)" : "rgba(3,8,12,0.8)",
          color: "#f4efe9",
          boxShadow:
            phase === "active"
              ? "0 0 18px rgba(232,138,83,0.1)"
              : "0 0 12px rgba(232,138,83,0.06)",
        }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: phase === "idle" ? 0.7 : 1 }}
        transition={{ duration: 0.22, ease: EASE_QUART_OUT }}
      >
        {phaseLabel}
      </motion.div>

      <motion.div
        className="relative flex h-[clamp(14.6rem,45vw,24.4rem)] w-[clamp(14.6rem,45vw,24.4rem)] items-center justify-center md:h-[clamp(17rem,34vw,25rem)] md:w-[clamp(17rem,34vw,25rem)]"
        animate={
          reducedMotion
            ? { scale: 1, y: 0 }
            : {
                scale: orbScale,
                y: drift,
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                scale: { duration: 0.22, ease: EASE_QUART_OUT },
                y: {
                  duration: phase === "connecting" ? 2.8 : phase === "active" ? 4.2 : 6.5,
                  repeat: phase === "idle" || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
                  ease: EASE_QUART_OUT,
                },
              }
        }
      >
        <motion.div
          className="absolute -inset-[34%] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(232,138,83,0.12) 0%, rgba(232,138,83,0.05) 32%, rgba(232,138,83,0) 74%)",
          }}
          animate={
            reducedMotion
              ? { opacity: 0.08 + assistantGlow * 0.16, scale: 1 + assistantGlow * 0.06 }
              : {
                  opacity: 0.08 + assistantGlow * 0.18,
                  scale: 0.98 + assistantGlow * 0.16,
                }
          }
          transition={{
            duration: phase === "connecting" ? 0.5 : 0.34,
            ease: EASE_QUART_OUT,
          }}
        />

        <motion.div
          className="pointer-events-none absolute -inset-[12%] rounded-full blur-[44px] mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(255,146,66,0.42) 0%, rgba(255,146,66,0.18) 36%, rgba(255,146,66,0) 76%)",
          }}
          animate={
            reducedMotion
              ? { opacity: 0.09 + assistantGlow * 0.3, scale: 1 + assistantGlow * 0.08 }
              : {
                  opacity: 0.1 + assistantGlow * (phase === "connecting" ? 0.34 : 0.42),
                  scale: 0.98 + assistantGlow * (phase === "connecting" ? 0.16 : 0.2),
                }
          }
          transition={{
            duration: phase === "connecting" ? 0.54 : 0.36,
            ease: EASE_QUART_OUT,
          }}
        />

        <motion.div
          className="absolute inset-[10%] overflow-hidden rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 48%, rgba(16,14,14,0.96) 0%, rgba(5,5,6,0.99) 58%, rgba(1,1,1,1) 100%)",
            boxShadow:
              phase === "active"
                ? "inset 0 -20px 44px rgba(0,0,0,0.6), 0 0 16px rgba(0,0,0,0.28)"
                : "inset 0 -16px 36px rgba(0,0,0,0.6), 0 0 12px rgba(0,0,0,0.24)",
            filter: "saturate(1.06) contrast(1.1)",
          }}
          animate={
            reducedMotion
              ? { scale: 1, opacity: 0.95, rotate: 0 }
              : {
                  scale: 0.992 + assistantGlow * (phase === "connecting" ? 0.05 : 0.038),
                  opacity: 0.88 + assistantGlow * 0.1,
                  rotate: phase === "connecting" ? 14 : phase === "active" ? 10 : 5,
                }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  scale: { duration: phase === "connecting" ? 0.58 : 0.36, ease: EASE_QUART_OUT },
                  opacity: { duration: phase === "connecting" ? 0.62 : 0.42, ease: EASE_QUART_OUT },
                  rotate: {
                    duration: phase === "connecting" ? 14 : phase === "active" ? 18 : 26,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  },
                }
          }
        >
          <motion.div
            className="absolute -inset-[18%] rounded-full blur-[40px] mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle at 40% 65%, rgba(255,82,0,0.72) 0%, rgba(255,82,0,0.38) 28%, rgba(255,82,0,0) 74%)",
            }}
            animate={
              reducedMotion
                ? { opacity: 0.3, x: 0, y: 0, scale: 1 }
                : {
                    opacity: 0.1 + assistantGlow * 0.34,
                    x:
                      phase === "connecting"
                        ? [-18, 18, -18]
                        : phase === "active"
                          ? [-14, 14, -14]
                          : [-8, 8, -8],
                    y:
                      phase === "connecting"
                        ? [14, -14, 14]
                        : phase === "active"
                          ? [10, -10, 10]
                          : [6, -6, 6],
                    scale:
                      phase === "connecting"
                        ? [0.84, 1.2, 0.84]
                        : phase === "active"
                          ? [0.9, 1.12, 0.9]
                          : [0.95, 1.03, 0.95],
                }
            }
            transition={{
              duration: fluidDuration,
              repeat: reducedMotion || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
              ease: EASE_EXPO_IN_OUT,
            }}
          />

          <motion.div
            className="absolute -inset-[18%] rounded-full blur-[42px] mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle at 58% 52%, rgba(82,255,24,0.64) 0%, rgba(70,214,27,0.4) 30%, rgba(70,214,27,0) 76%)",
            }}
            animate={
              reducedMotion
                ? { opacity: 0.26, x: 0, y: 0 }
                : {
                    opacity: 0.08 + assistantGlow * 0.26,
                    x:
                      phase === "connecting"
                        ? [16, -16, 16]
                        : phase === "active"
                          ? [12, -12, 12]
                          : [7, -7, 7],
                    y:
                      phase === "connecting"
                        ? [-15, 15, -15]
                        : phase === "active"
                          ? [-10, 10, -10]
                          : [-6, 6, -6],
                    scale:
                      phase === "connecting"
                        ? [0.86, 1.18, 0.86]
                        : phase === "active"
                          ? [0.9, 1.1, 0.9]
                          : [0.95, 1.03, 0.95],
                }
            }
            transition={{
              duration: fluidDuration + 0.5,
              repeat: reducedMotion || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
              ease: EASE_EXPO_IN_OUT,
            }}
          />

          <motion.div
            className="absolute -inset-[18%] rounded-full blur-[42px] mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle at 44% 30%, rgba(60,83,255,0.6) 0%, rgba(80,58,236,0.38) 32%, rgba(80,58,236,0) 78%)",
            }}
            animate={
              reducedMotion
                ? { opacity: 0.2 }
                : {
                    opacity: 0.08 + assistantGlow * 0.22,
                    x:
                      phase === "connecting"
                        ? [-14, 14, -14]
                        : phase === "active"
                          ? [-10, 10, -10]
                          : [-6, 6, -6],
                    y:
                      phase === "connecting"
                        ? [12, -12, 12]
                        : phase === "active"
                          ? [8, -8, 8]
                          : [5, -5, 5],
                    scale:
                      phase === "connecting"
                        ? [0.86, 1.16, 0.86]
                        : phase === "active"
                          ? [0.9, 1.08, 0.9]
                          : [0.95, 1.03, 0.95],
                }
            }
            transition={{
              duration: fluidDuration + 0.8,
              repeat: reducedMotion || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
              ease: EASE_EXPO_IN_OUT,
            }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen"
            style={{
              opacity: phase === "active" ? 0.08 : phase === "connecting" ? 0.06 : 0.03,
              background:
                "radial-gradient(circle at 54% 46%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 22%, rgba(255,255,255,0) 56%)",
            }}
            animate={
              reducedMotion
                ? { opacity: phase === "active" ? 0.08 : 0.03 }
                : {
                    opacity: 0.03 + assistantGlow * 0.1,
                    x: phase === "active" ? [-2, 2, -2] : [0, 1, 0],
                    y: phase === "active" ? [2, -2, 2] : [0, -1, 0],
                  }
            }
            transition={{
              duration: phase === "active" ? 1.9 : 5.8,
              repeat: reducedMotion || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
              ease: EASE_QUART_OUT,
            }}
          />

          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_26%,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.04)_20%,transparent_44%),radial-gradient(circle_at_66%_74%,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.18)_34%,transparent_66%)]" />
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={onToggleCall}
        aria-label={active ? "End voice demo" : "Start voice demo"}
        className={cn(
          "absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-xl border px-5 py-2.5 sm:bottom-6",
          "border-orange-200/18 bg-[rgba(10,9,8,0.78)] text-orange-50",
          "shadow-[0_0_24px_rgba(232,138,83,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]",
          "transition-[transform,border-color,background-color,box-shadow,color] duration-200",
          "hover:border-orange-100/35 hover:bg-[rgba(14,12,10,0.92)] hover:shadow-[0_0_28px_rgba(232,138,83,0.16),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "focus-visible:border-orange-100 focus-visible:ring-3 focus-visible:ring-orange-200/55",
          "active:scale-[0.97]"
        )}
        whileHover={reducedMotion ? undefined : { scale: 1.03 }}
        whileTap={reducedMotion ? undefined : { scale: 0.965 }}
        animate={
          reducedMotion
            ? { boxShadow: "0 0 16px rgba(232,138,83,0.08), inset 0 1px 0 rgba(255,255,255,0.04)" }
            : {
                boxShadow:
                  phase === "connecting"
                    ? [
                        "0 0 12px rgba(232,138,83,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
                        "0 0 20px rgba(232,138,83,0.14), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "0 0 12px rgba(232,138,83,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
                      ]
                    : phase === "active"
                      ? [
                          "0 0 14px rgba(232,138,83,0.09), inset 0 1px 0 rgba(255,255,255,0.04)",
                          "0 0 19px rgba(232,138,83,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
                          "0 0 14px rgba(232,138,83,0.09), inset 0 1px 0 rgba(255,255,255,0.04)",
                        ]
                      : "0 0 14px rgba(232,138,83,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
              }
        }
        transition={{
          duration: phase === "connecting" ? 0.9 : 2.4,
          repeat: phase === "idle" || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
          ease: EASE_QUART_OUT,
        }}
      >
        <motion.span
          className="pointer-events-none absolute -inset-4 rounded-[1rem] border border-orange-200/10"
          animate={
            reducedMotion
              ? { opacity: phase === "connecting" ? 0.4 : 0 }
              : {
                  opacity: phase === "connecting" ? [0.06, 0.16, 0.06] : active ? 0.04 : 0,
                  scale: phase === "connecting" ? [0.99, 1.016, 0.99] : active ? [1, 1.008, 1] : 1,
                }
          }
          transition={{
            duration: phase === "connecting" ? 1.1 : 2.9,
            repeat: phase === "idle" || phase === "settled" ? 0 : Number.POSITIVE_INFINITY,
            ease: EASE_QUART_OUT,
          }}
        />
        {active ? <PhoneOff className="size-4" /> : <Mic className="size-4" />}
        {active ? "End call" : "Start call"}
      </motion.button>
    </motion.div>
  );
}

function captionRoleLabel(line: CaptionLine) {
  if (line.role === "assistant") return "Pearl";
  if (line.role === "user") return "You";
  return "System";
}

export default function ChatPearlDemoClient() {
  const [mode, setMode] = useState<DemoMode>("circlewaveform");
  const [displayMode, setDisplayMode] = useState<DemoMode>("circlewaveform");
  const [incomingMode, setIncomingMode] = useState<DemoMode | null>(null);
  const [showCaptions, setShowCaptions] = useState(true);
  const [smoothedVolume, setSmoothedVolume] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const transcriptViewportRef = useRef<HTMLDivElement | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const {
    callState,
    volumeLevel,
    isMuted,
    captions,
    interimCaption,
    startCall,
    endCall,
    toggleMute,
  } = useVoiceDemoSession();

  const active = callState === "active";
  const phase = getVisualPhase(callState);
  const statusText = getCallStatusText(callState);
  useEffect(() => {
    const target =
      phase === "active" ? volumeLevel : phase === "connecting" ? 0.16 : phase === "settled" ? 0.08 : 0.04;
    setSmoothedVolume((previous) => {
      const damping = prefersReducedMotion ? 0.42 : phase === "active" ? 0.2 : 0.14;
      const next = previous + (target - previous) * damping;
      return Number.isFinite(next) ? next : 0;
    });
  }, [phase, prefersReducedMotion, volumeLevel]);

  const mergedCaptions = useMemo(
    () => (interimCaption ? [...captions, interimCaption] : captions),
    [captions, interimCaption]
  );
  const dominantSpeaker = (interimCaption?.role ??
    captions[captions.length - 1]?.role ??
    "unknown") as "assistant" | "user" | "system" | "unknown";

  const captionRows = useMemo(() => mergedCaptions.slice(-24), [mergedCaptions]);

  useEffect(() => {
    const node = transcriptViewportRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [captionRows.length, transcriptViewportRef]);

  useEffect(() => {
    const previousTimer = transitionTimerRef.current;
    if (previousTimer) {
      window.clearTimeout(previousTimer);
      transitionTimerRef.current = null;
    }

    if (mode === displayMode) {
      setIncomingMode(null);
      return;
    }

    setIncomingMode(mode);
    transitionTimerRef.current = window.setTimeout(() => {
      setDisplayMode(mode);
      setIncomingMode(null);
      transitionTimerRef.current = null;
    }, prefersReducedMotion ? 0 : 180);

    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [displayMode, mode, prefersReducedMotion]);

  const stageMotion = useMemo(
    () => getStageMotion(mode, phase, Boolean(prefersReducedMotion)),
    [mode, phase, prefersReducedMotion]
  );

  const toggleCall = () => {
    if (active || callState === "connecting") {
      void endCall();
      return;
    }
    void startCall();
  };

  const renderModeScene = (sceneMode: DemoMode, layer: "current" | "incoming") => {
    const sceneProps = {
      active,
      phase,
      volumeLevel,
      smoothedVolume,
      dominantSpeaker,
      reducedMotion: Boolean(prefersReducedMotion),
      onToggleCall: layer === "current" ? toggleCall : () => {},
    };

    return (
      <div className={cn("absolute inset-0", layer === "incoming" && "pointer-events-none")}>
        {sceneMode === "circlewaveform" ? (
          <CircleWaveformMode {...sceneProps} />
        ) : sceneMode === "siri" ? (
          <SiriMode {...sceneProps} />
        ) : (
          <GlobMode {...sceneProps} />
        )}
      </div>
    );
  };

  return (
    <PremiumPageShell
      className="text-[color:var(--premium-foreground)]"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(232, 138, 83, 0.08) 0%, rgba(2, 1, 1, 0.96) 32%, rgba(1, 1, 1, 1) 72%)",
      }}
    >
      <PremiumViewport className="gap-4 px-4 pb-6 pt-5 sm:px-6 md:px-8 md:pb-8">
        <PremiumPanel className="border-white/8 bg-[rgba(5,8,14,0.75)] py-3 shadow-[0_18px_36px_rgba(0,0,0,0.44)]">
          <div className="flex flex-col gap-3 px-4">
            <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-start 2xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-10 items-center justify-center rounded-xl border border-orange-200/16 bg-orange-300/8 shadow-[0_0_18px_rgba(232,138,83,0.08)]">
                  <Sparkles className="size-4 text-orange-200" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold tracking-tight text-zinc-50 md:text-[2.5rem]">
                    Chat Pearl Demo
                  </h1>
                  <p className="max-w-[42rem] text-xs text-zinc-400 md:text-sm">
                    Premium interactive voice showcase for dentist client demos.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 2xl:justify-end">
                <PremiumStatusPill
                  tone={
                    callState === "connecting"
                      ? "connecting"
                      : callState === "active"
                        ? "active"
                        : callState === "ended"
                          ? "ended"
                          : callState === "error"
                            ? "error"
                            : "idle"
                  }
                  className="border-white/10 bg-black/60 text-zinc-100 shadow-[0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur-md"
                >
                  <Waves
                    className={cn(
                      "size-3",
                      callState === "connecting" && !prefersReducedMotion ? "animate-pulse" : "opacity-90"
                    )}
                  />
                  {statusText}
                </PremiumStatusPill>

                <Button
                  variant="outline"
                  className={cn(
                    "border-white/10 bg-white/[0.03] text-zinc-100",
                    "transition-[transform,border-color,background-color,box-shadow,color] duration-200",
                    "hover:border-orange-200/20 hover:bg-orange-300/6 hover:text-white",
                    "focus-visible:ring-orange-200/55"
                  )}
                  onClick={() => setShowCaptions((prev) => !prev)}
                >
                  {showCaptions ? "Hide captions" : "Show captions"}
                </Button>

                <Button
                  variant="outline"
                  className={cn(
                    "border-white/10 bg-white/[0.03] text-zinc-100",
                    "transition-[transform,border-color,background-color,box-shadow,color] duration-200",
                    "hover:border-orange-200/20 hover:bg-orange-300/6 hover:text-white",
                    "focus-visible:ring-orange-200/55"
                  )}
                  onClick={toggleMute}
                  disabled={!active}
                >
                  {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-2">
              <Tabs value={mode} onValueChange={(value) => setMode(value as DemoMode)}>
                <TabsList
                  className={cn(
                    "grid h-auto w-full max-w-full grid-cols-1 gap-2 rounded-[1.4rem] border border-white/8 bg-black/55 p-2 shadow-[0_10px_28px_rgba(0,0,0,0.32)] backdrop-blur-sm",
                    "sm:grid-cols-3"
                  )}
                  variant="line"
                >
                  {MODES.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className={cn(
                        "h-auto min-w-0 rounded-[1rem] border border-white/8 bg-white/[0.02] px-3 py-2.5 text-center",
                        "transition-[transform,background-color,border-color,box-shadow,color] duration-200",
                        "hover:border-white/12 hover:bg-white/[0.05] hover:text-white",
                        "focus-visible:border-orange-200 focus-visible:ring-3 focus-visible:ring-orange-200/50",
                        "data-active:border-white/12 data-active:bg-white/[0.06] data-active:text-white",
                        "data-active:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_12px_24px_rgba(0,0,0,0.25)]"
                      )}
                      aria-label={`Switch to ${item.label}`}
                    >
                      <span className="flex w-full min-w-0 flex-col items-center">
                        <span className="text-sm font-semibold">{item.label}</span>
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </PremiumPanel>

        <PremiumStageContainer
          className={cn(
            "border-white/8 bg-black/55 p-3 shadow-[0_24px_64px_rgba(0,0,0,0.55)]",
            "overflow-hidden"
          )}
        >
          <div className="grid h-[76vh] grid-rows-[1fr_auto] gap-3 xl:h-[80vh]">
            <div className="relative overflow-hidden rounded-[1.4rem]">
              <StageAccent
                mode={mode}
                phase={phase}
                reducedMotion={Boolean(prefersReducedMotion)}
                energy={smoothedVolume}
              />

              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={stageMotion.animate}
                transition={stageMotion.transition}
              >
                {renderModeScene(displayMode, "current")}
                {incomingMode && incomingMode !== displayMode && (
                  <motion.div
                    className="absolute inset-0"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0.92, scale: 1, y: 0 }
                        : { opacity: 0.16, scale: 0.984, y: 8 }
                    }
                    animate={{
                      opacity: prefersReducedMotion ? 1 : 0.96,
                      scale: 1,
                      y: 0,
                    }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: EASE_QUART_OUT }}
                  >
                    {renderModeScene(incomingMode, "incoming")}
                  </motion.div>
                )}
              </motion.div>
            </div>

            <AnimatePresence>
              {showCaptions && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.22, ease: EASE_QUART_OUT }}
                >
                  <PremiumTranscriptDock
                    className={cn(
                      "min-h-[170px] border-white/8 bg-black/60 shadow-[0_14px_34px_rgba(0,0,0,0.38)]",
                      "backdrop-blur-md"
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-orange-100">Live transcript</p>
                      <p className="text-[11px] text-zinc-400">assistant + user</p>
                    </div>

                    <div
                      ref={transcriptViewportRef}
                      className="h-[130px] overflow-y-auto pr-2 sm:h-[160px]"
                    >
                      <div className="space-y-2 text-sm">
                        {captionRows.length === 0 && (
                          <p className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-zinc-300">
                            Start a call and the conversation with Pearl will appear here.
                          </p>
                        )}

                        {captionRows.map((line) => (
                          <div
                            key={line.id}
                            className={cn(
                              "rounded-lg border px-3 py-2 transition-[border-color,background-color,color,transform] duration-150",
                              line.role === "assistant" &&
                                "border-[color:var(--caption-assistant-border)] bg-[color:var(--caption-assistant-bg)] text-orange-50",
                              line.role === "user" &&
                                "border-[color:var(--caption-user-border)] bg-[color:var(--caption-user-bg)] text-zinc-50",
                              line.role === "system" &&
                                "border-[color:var(--caption-system-border)] bg-[color:var(--caption-system-bg)] text-amber-50"
                            )}
                          >
                            <div className="mb-1 flex items-center justify-between gap-2">
                              <span className="text-[10px] uppercase tracking-wide opacity-80">
                                {captionRoleLabel(line)}
                              </span>
                              <span className="text-[10px] opacity-60">
                                {formatCaptionTime(line.timestamp)}
                              </span>
                            </div>
                            <p className="break-words leading-relaxed">{line.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PremiumTranscriptDock>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PremiumStageContainer>
      </PremiumViewport>
    </PremiumPageShell>
  );
}
