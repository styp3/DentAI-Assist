"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactSiriwave, { type IReactSiriwaveProps } from "react-siriwave";
import { Sparkles, Loader2, Mic, MicOff, PhoneOff, Waves } from "lucide-react";
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

const MODES: Array<{ value: DemoMode; label: string; description: string }> = [
  {
    value: "circlewaveform",
    label: "CircleWaveform",
    description: "Radial bars with a charged halo and tight response.",
  },
  {
    value: "siri",
    label: "Siri",
    description: "Linear wave motion with a clean glass frame.",
  },
  {
    value: "glob",
    label: "Glob",
    description: "A rotating core with concentric lock-on rings.",
  },
];

const EASE_EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_QUART_OUT: [number, number, number, number] = [0.25, 1, 0.5, 1];
const EASE_EXPO_IN_OUT: [number, number, number, number] = [0.87, 0, 0.13, 1];

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
          opacity: phase === "idle" ? 0.5 : phase === "connecting" ? 0.7 : 0.3,
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
            opacity: phase === "connecting" ? [0.3, 0.9, 0.3] : [0.18, 0.5, 0.18],
            scaleX: phase === "active" ? [0.96, 1.02, 0.96] : [0.98, 1, 0.98],
          }}
          transition={{
            duration: phase === "connecting" ? 0.95 : 1.6,
            repeat: Number.POSITIVE_INFINITY,
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
          opacity: phase === "idle" ? 0.28 : phase === "connecting" ? 0.4 : 0.18,
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
            scale: phase === "connecting" ? [0.86, 1.06, 1.18] : [0.94, 1.02, 1.1],
            opacity: phase === "connecting" ? [0.3, 0.7, 0] : [0.18, 0.45, 0],
          }}
          transition={{
            duration: phase === "connecting" ? 0.85 : 1.35,
            repeat: Number.POSITIVE_INFINITY,
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
        opacity: phase === "idle" ? 0.3 : phase === "connecting" ? 0.55 : 0.25,
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
          scale: phase === "active" ? [0.985, 1.015, 0.985] : [1, 1.01, 1],
        }}
        transition={{
          duration: phase === "connecting" ? 1.0 : 2.4,
          repeat: Number.POSITIVE_INFINITY,
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
      x1: 300 + Math.cos(angle) * inner,
      y1: 300 + Math.sin(angle) * inner,
      x2: 300 + Math.cos(angle) * outer,
      y2: 300 + Math.sin(angle) * outer,
    };
  });

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[24rem] w-full items-center justify-center overflow-hidden rounded-[1.8rem] border",
        "border-cyan-200/12 bg-[radial-gradient(circle_at_50%_40%,rgba(7,13,22,0.98),rgba(1,3,6,1)_64%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_24px_60px_rgba(0,0,0,0.58)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(34,211,238,0.04),transparent_38%,rgba(34,211,238,0.035)_72%,transparent)]" />
      <ModePrelude mode="circlewaveform" phase={phase} accent="#5eead4" reducedMotion={reducedMotion} />

      <motion.svg
        viewBox="0 0 600 600"
        className="absolute h-[clamp(320px,70vmin,620px)] w-[clamp(320px,70vmin,620px)] text-cyan-200/80"
        animate={
          reducedMotion
            ? { scale: 1 }
            : {
                scale: phase === "active" ? [1, 1.01, 1] : phase === "connecting" ? [0.99, 1.01, 0.99] : 1,
                rotate: phase === "active" ? 0 : phase === "idle" ? [0, -0.5, 0.5, 0] : 0,
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: phase === "active" ? 2.2 : 3.6,
                repeat: Number.POSITIVE_INFINITY,
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
            "relative inline-flex size-24 items-center justify-center rounded-3xl border text-cyan-100",
            "border-cyan-300/30 bg-[rgba(8,15,22,0.76)]",
            "shadow-[0_0_30px_rgba(34,211,238,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]",
            "transition-[transform,border-color,background-color,box-shadow,color] duration-200",
            "hover:border-cyan-200/50 hover:bg-[rgba(10,19,28,0.86)] hover:shadow-[0_0_34px_rgba(34,211,238,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]",
            "focus-visible:border-cyan-100 focus-visible:ring-3 focus-visible:ring-cyan-200/55",
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
                      ? "0 0 36px rgba(34, 211, 238, 0.18), inset 0 1px 0 rgba(255,255,255,0.05)"
                      : phase === "connecting"
                        ? "0 0 28px rgba(34, 211, 238, 0.12), inset 0 1px 0 rgba(255,255,255,0.05)"
                        : "0 0 24px rgba(34, 211, 238, 0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
                }
          }
          transition={{ duration: 0.22, ease: EASE_QUART_OUT }}
        >
          <span
            className={cn(
              "absolute inset-0 rounded-3xl border",
              phase === "active" ? "border-cyan-200/22" : "border-white/6"
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
            color: phase === "active" ? "#bbf7d0" : "#d6f7ff",
            boxShadow:
              phase === "active"
                ? "0 0 18px rgba(34, 197, 94, 0.12)"
                : "0 0 14px rgba(34, 211, 238, 0.08)",
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
            repeat: Number.POSITIVE_INFINITY,
            ease: EASE_EXPO_OUT,
          }}
        >
          {phase === "connecting"
            ? "Preflight scan"
            : active
              ? "Live waveform"
              : "Ready to start"}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {phase === "connecting" && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4"
          >
            <div className="flex items-center gap-3 rounded-full border border-cyan-200/14 bg-black/62 px-4 py-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.44)] backdrop-blur-md">
              <motion.div
                className="h-1.5 w-10 rounded-full bg-cyan-200/85"
                animate={reducedMotion ? { opacity: 0.8 } : { scaleX: [0.55, 1, 0.55], opacity: [0.35, 0.95, 0.35] }}
                transition={{ duration: 0.95, repeat: Number.POSITIVE_INFINITY, ease: EASE_QUART_OUT }}
              />
              <span className="text-xs font-medium text-cyan-50">Calling Pearl…</span>
              <motion.div
                className="h-1.5 w-10 rounded-full bg-cyan-200/85"
                animate={reducedMotion ? { opacity: 0.8 } : { scaleX: [1, 0.55, 1], opacity: [0.95, 0.35, 0.95] }}
                transition={{ duration: 0.95, repeat: Number.POSITIVE_INFINITY, ease: EASE_QUART_OUT }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SiriMode({
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
  const reactiveLevel = Math.min(1, smoothedVolume * 2.2 + volumeLevel * 0.5 + (phase === "connecting" ? 0.08 : 0));
  const siriConfig = useMemo<IReactSiriwaveProps>(
    () => ({
      theme: "ios9",
      ratio: 1,
      speed: active ? 0.08 + reactiveLevel * 0.16 : phase === "connecting" ? 0.07 : 0.04,
      amplitude: active ? 0.42 + reactiveLevel * 3.0 : phase === "connecting" ? 0.7 : 0.28,
      frequency: active ? 2.5 + reactiveLevel * 3.8 : phase === "connecting" ? 3.1 : 2.0,
      color: "#67e8f9",
      cover: true,
      width: 1240,
      height: 220,
      autostart: true,
      pixelDepth: 0.55,
      lerpSpeed: 0.06,
    }),
    [active, phase, reactiveLevel]
  );

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[24rem] w-full items-center justify-center overflow-hidden rounded-[1.8rem] border",
        "border-sky-200/12 bg-[radial-gradient(circle_at_50%_38%,rgba(12,22,34,0.96),rgba(1,3,8,1)_66%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.58)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(34,211,238,0.035),transparent_36%,rgba(37,99,235,0.03)_72%,transparent)]" />
      <ModePrelude mode="siri" phase={phase} accent="#67e8f9" reducedMotion={reducedMotion} />

      <div className="relative z-10 flex w-[min(92%,78rem)] flex-col items-center gap-6 rounded-[1.6rem] border border-white/8 bg-black/38 px-5 py-7 shadow-[0_18px_40px_rgba(0,0,0,0.38)] backdrop-blur-sm sm:px-6 sm:py-8">
        <div className="flex w-full items-start justify-between gap-3">
          <motion.button
            type="button"
            onClick={onToggleCall}
            aria-label={active ? "End voice demo" : "Start voice demo"}
            className={cn(
              "inline-flex size-14 items-center justify-center rounded-2xl border",
              "border-sky-200/18 bg-[rgba(8,15,24,0.82)] text-sky-50",
              "shadow-[0_0_24px_rgba(56,189,248,0.1),inset_0_1px_0_rgba(255,255,255,0.04)]",
              "transition-[transform,border-color,background-color,box-shadow,color] duration-200",
              "hover:border-sky-100/35 hover:bg-[rgba(10,18,28,0.92)] hover:shadow-[0_0_28px_rgba(56,189,248,0.16),inset_0_1px_0_rgba(255,255,255,0.05)]",
              "focus-visible:border-sky-100 focus-visible:ring-3 focus-visible:ring-sky-200/55",
              "active:scale-[0.97]"
            )}
            whileHover={reducedMotion ? undefined : { scale: 1.04 }}
            whileTap={reducedMotion ? undefined : { scale: 0.965 }}
          >
            {active ? <PhoneOff className="size-6" /> : <Mic className="size-6" />}
          </motion.button>

          <div className="max-w-[28rem] text-right">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-sky-200/70">
              Siri mode
            </p>
            <p className="mt-1 text-sm text-slate-300">
              A clean, animated waveform frame with quieter ambient spill.
            </p>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-[1.4rem] border border-sky-200/10 bg-[rgba(3,7,12,0.76)] px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-5 sm:py-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.08),transparent_60%)]" />
          <div className="relative flex h-[clamp(180px,26vw,240px)] items-center justify-center">
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={false}
              animate={{
                opacity: phase === "active" ? [0.16, 0.26, 0.16] : phase === "connecting" ? [0.22, 0.36, 0.22] : 0.12,
                scale: phase === "active" ? [0.99, 1.01, 0.99] : [1, 1.005, 1],
              }}
              transition={{
                duration: phase === "connecting" ? 0.95 : 1.4,
                repeat: Number.POSITIVE_INFINITY,
                ease: EASE_QUART_OUT,
              }}
            >
              <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.12),transparent_66%)]" />
            </motion.div>

            <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-sky-200/10 bg-[#02050b]/90">
              <ReactSiriwave {...siriConfig} />
            </div>
          </div>
        </div>

        <motion.div
          className="pointer-events-none rounded-full border px-4 py-2 text-xs font-medium tracking-wide"
          style={{
            borderColor: phase === "active" ? "rgba(125, 211, 252, 0.24)" : "rgba(255,255,255,0.08)",
            backgroundColor:
              phase === "active"
                ? "rgba(3, 10, 16, 0.86)"
                : "rgba(3, 8, 12, 0.8)",
            color: "#e0f2fe",
            boxShadow:
              phase === "active"
                ? "0 0 18px rgba(56, 189, 248, 0.1)"
                : "0 0 12px rgba(56, 189, 248, 0.06)",
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
            duration: phase === "connecting" ? 1.0 : 2.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: EASE_EXPO_OUT,
          }}
        >
          {phase === "connecting"
            ? "Handshaking"
            : active
              ? "Live wave"
              : "Ready to call"}
        </motion.div>

        <AnimatePresence>
          {phase === "connecting" && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4"
            >
              <div className="flex items-center gap-3 rounded-full border border-sky-200/12 bg-black/68 px-4 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.42)] backdrop-blur-md">
                <motion.div
                  className="h-1.5 w-10 rounded-full bg-sky-200/85"
                  animate={
                    reducedMotion
                      ? { opacity: 0.75 }
                      : { scaleX: [0.55, 1, 0.55], opacity: [0.35, 0.95, 0.35] }
                  }
                  transition={{ duration: 0.95, repeat: Number.POSITIVE_INFINITY, ease: EASE_QUART_OUT }}
                />
                <span className="text-xs font-medium text-sky-50">Calling Pearl…</span>
                <motion.div
                  className="h-1.5 w-10 rounded-full bg-sky-200/85"
                  animate={
                    reducedMotion
                      ? { opacity: 0.75 }
                      : { scaleX: [1, 0.55, 1], opacity: [0.95, 0.35, 0.95] }
                  }
                  transition={{ duration: 0.95, repeat: Number.POSITIVE_INFINITY, ease: EASE_QUART_OUT }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GlobMode({
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
  const scale = 1 + Math.min(0.14, smoothedVolume * 0.22 + volumeLevel * 0.04);

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[24rem] w-full items-center justify-center overflow-hidden rounded-[1.8rem] border",
        "border-fuchsia-200/12 bg-[radial-gradient(circle_at_50%_35%,rgba(13,16,27,0.98),rgba(2,4,8,1)_66%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.6)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,70,239,0.04),transparent_34%,rgba(34,211,238,0.04)_74%,transparent)]" />
      <ModePrelude mode="glob" phase={phase} accent="#c084fc" reducedMotion={reducedMotion} />

      <motion.div
        className="absolute h-[52vmin] w-[52vmin] max-h-[560px] max-w-[560px] rounded-full border"
        style={{ borderColor: "rgba(192, 132, 252, 0.16)" }}
        animate={
          reducedMotion
            ? { scale: 1, opacity: 0.2 }
            : active
              ? { scale: [0.92, 1.08, 0.92], opacity: [0.24, 0.04, 0.24] }
              : phase === "connecting"
                ? { scale: [0.96, 1.04, 0.96], opacity: [0.14, 0.32, 0.14] }
                : { scale: 1, opacity: 0.12 }
        }
        transition={{
          duration: phase === "active" ? 2.8 : 1.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: EASE_EXPO_OUT,
        }}
      />

      <motion.div
        className="absolute h-[64vmin] w-[64vmin] max-h-[700px] max-w-[700px] rounded-full border"
        style={{ borderColor: "rgba(34, 211, 238, 0.1)" }}
        animate={
          reducedMotion
            ? { scale: 1, opacity: 0.14 }
            : active
              ? { scale: [0.9, 1.06, 0.9], opacity: [0.18, 0.02, 0.18] }
              : phase === "connecting"
                ? { scale: [0.95, 1.03, 0.95], opacity: [0.1, 0.22, 0.1] }
                : { scale: 1, opacity: 0.08 }
        }
        transition={{
          duration: phase === "active" ? 3.2 : 2.4,
          repeat: Number.POSITIVE_INFINITY,
          ease: EASE_EXPO_OUT,
          delay: 0.16,
        }}
      />

      <motion.div
        className="relative h-[clamp(16rem,36vmin,26rem)] w-[clamp(16rem,36vmin,26rem)] rounded-full"
        animate={
          reducedMotion
            ? { rotate: 0, scale: 1 }
            : {
                rotate: phase === "idle" ? 180 : 360,
                scale,
                y: phase === "idle" ? [0, -2, 0] : [0, -1, 0],
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                rotate:
                  phase === "active"
                    ? { duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
                    : { duration: 36, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                y: {
                  duration: phase === "active" ? 1.8 : 3.6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: EASE_QUART_OUT,
                },
                scale: { duration: 0.24, ease: EASE_QUART_OUT },
              }
        }
        style={{
          background:
            "conic-gradient(from 210deg at 50% 50%, rgba(34,211,238,0.96) 0deg, rgba(192,132,252,0.96) 124deg, rgba(16,185,129,0.92) 244deg, rgba(34,211,238,0.96) 360deg)",
          boxShadow:
            phase === "active"
              ? "0 0 78px rgba(56, 189, 248, 0.16)"
              : "0 0 56px rgba(56, 189, 248, 0.1)",
        }}
      >
        <div className="absolute inset-4 rounded-full bg-[rgba(4,8,14,0.48)] backdrop-blur-sm" />
        <div className="absolute inset-8 rounded-full border border-white/8" />
        <motion.div
          className="absolute inset-[16%] rounded-full border border-white/10"
          animate={
            reducedMotion
              ? { opacity: 0.7 }
              : { opacity: phase === "connecting" ? [0.35, 0.72, 0.35] : [0.22, 0.5, 0.22] }
          }
          transition={{ duration: phase === "connecting" ? 0.95 : 1.45, repeat: Number.POSITIVE_INFINITY, ease: EASE_QUART_OUT }}
        />
      </motion.div>

      <motion.button
        type="button"
        onClick={onToggleCall}
        aria-label={active ? "End voice demo" : "Start voice demo"}
        className={cn(
          "absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-xl border px-5 py-2.5",
          "border-fuchsia-200/18 bg-[rgba(8,10,16,0.78)] text-fuchsia-50",
          "shadow-[0_0_24px_rgba(168,85,247,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]",
          "transition-[transform,border-color,background-color,box-shadow,color] duration-200",
          "hover:border-fuchsia-100/35 hover:bg-[rgba(10,12,18,0.92)] hover:shadow-[0_0_28px_rgba(168,85,247,0.16),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "focus-visible:border-fuchsia-100 focus-visible:ring-3 focus-visible:ring-fuchsia-200/55",
          "active:scale-[0.97]"
        )}
        whileHover={reducedMotion ? undefined : { scale: 1.03 }}
        whileTap={reducedMotion ? undefined : { scale: 0.965 }}
      >
        {active ? <PhoneOff className="size-4" /> : <Mic className="size-4" />}
        {active ? "End call" : "Start call"}
      </motion.button>

      <AnimatePresence>
        {phase === "connecting" && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="relative flex items-center gap-3 rounded-2xl border border-fuchsia-200/18 bg-black/68 px-5 py-3 backdrop-blur-md">
              <motion.div
                className="size-5 rounded-full border border-fuchsia-100/70"
                animate={reducedMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <motion.div
                  className="mx-auto mt-0.5 h-1.5 w-1.5 rounded-full bg-fuchsia-100"
                  animate={reducedMotion ? { opacity: 0.95 } : { opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: EASE_QUART_OUT }}
                />
              </motion.div>
              <span className="text-sm font-medium text-fuchsia-50">Calling Pearl…</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function captionRoleLabel(line: CaptionLine) {
  if (line.role === "assistant") return "Pearl";
  if (line.role === "user") return "You";
  return "System";
}

export default function ChatPearlDemoClient() {
  const [mode, setMode] = useState<DemoMode>("circlewaveform");
  const [showCaptions, setShowCaptions] = useState(true);
  const [smoothedVolume, setSmoothedVolume] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const transcriptViewportRef = useRef<HTMLDivElement | null>(null);

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

  const captionRows = useMemo(() => mergedCaptions.slice(-24), [mergedCaptions]);

  useEffect(() => {
    const node = transcriptViewportRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [captionRows.length, transcriptViewportRef]);

  const motionPreset = useMemo(() => {
    const distance = phase === "connecting" ? 10 : phase === "active" ? 14 : 12;
    return {
      initial: prefersReducedMotion ? false : { opacity: 0, y: distance, scale: 0.985 },
      animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 },
      exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -distance * 0.75, scale: 0.99 },
    };
  }, [phase, prefersReducedMotion]);

  const toggleCall = () => {
    if (active || callState === "connecting") {
      void endCall();
      return;
    }
    void startCall();
  };

  return (
    <PremiumPageShell
      className="text-[color:var(--premium-foreground)]"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.08) 0%, rgba(2, 4, 8, 0.96) 32%, rgba(1, 3, 6, 1) 72%)",
      }}
    >
      <PremiumViewport className="gap-4 px-4 pb-6 pt-5 sm:px-6 md:px-8 md:pb-8">
        <PremiumPanel className="border-white/8 bg-[rgba(5,8,14,0.75)] py-3 shadow-[0_18px_36px_rgba(0,0,0,0.44)]">
          <div className="flex flex-col gap-3 px-4">
            <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-start 2xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-10 items-center justify-center rounded-xl border border-cyan-200/16 bg-cyan-300/8 shadow-[0_0_18px_rgba(34,211,238,0.08)]">
                  <Sparkles className="size-4 text-cyan-200" />
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
                  {callState === "connecting" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Waves className="size-3" />
                  )}
                  {statusText}
                </PremiumStatusPill>

                <Button
                  variant="outline"
                  className={cn(
                    "border-white/10 bg-white/[0.03] text-zinc-100",
                    "transition-[transform,border-color,background-color,box-shadow,color] duration-200",
                    "hover:border-cyan-200/20 hover:bg-cyan-300/6 hover:text-white",
                    "focus-visible:ring-cyan-200/55"
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
                    "hover:border-cyan-200/20 hover:bg-cyan-300/6 hover:text-white",
                    "focus-visible:ring-cyan-200/55"
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
                        "focus-visible:border-cyan-200 focus-visible:ring-3 focus-visible:ring-cyan-200/50",
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
              <AnimatePresence>
                {active && (
                  <motion.div
                    key="active-edge-light"
                    className="pointer-events-none absolute inset-0 z-10 rounded-[1.4rem]"
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={prefersReducedMotion ? { opacity: 0.16 } : { opacity: [0.14, 0.28, 0.14] }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
                    transition={{ duration: 2.1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <div className="absolute inset-0 rounded-[1.4rem] border border-cyan-200/14 shadow-[inset_0_0_42px_rgba(34,211,238,0.08)]" />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode}-${phase}`}
                  initial={motionPreset.initial}
                  animate={motionPreset.animate}
                  exit={motionPreset.exit}
                  transition={{ duration: phase === "connecting" ? 0.34 : 0.3, ease: EASE_EXPO_OUT }}
                  className="absolute inset-0"
                >
                  {mode === "circlewaveform" ? (
                    <CircleWaveformMode
                      active={active}
                      phase={phase}
                      volumeLevel={volumeLevel}
                      smoothedVolume={smoothedVolume}
                      reducedMotion={Boolean(prefersReducedMotion)}
                      onToggleCall={toggleCall}
                    />
                  ) : mode === "siri" ? (
                    <SiriMode
                      active={active}
                      phase={phase}
                      volumeLevel={volumeLevel}
                      smoothedVolume={smoothedVolume}
                      reducedMotion={Boolean(prefersReducedMotion)}
                      onToggleCall={toggleCall}
                    />
                  ) : (
                    <GlobMode
                      active={active}
                      phase={phase}
                      volumeLevel={volumeLevel}
                      smoothedVolume={smoothedVolume}
                      reducedMotion={Boolean(prefersReducedMotion)}
                      onToggleCall={toggleCall}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
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
                      <p className="text-sm font-medium text-cyan-100">Live transcript</p>
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
                                "border-[color:var(--caption-assistant-border)] bg-[color:var(--caption-assistant-bg)] text-cyan-50",
                              line.role === "user" &&
                                "border-[color:var(--caption-user-border)] bg-[color:var(--caption-user-bg)] text-violet-50",
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
