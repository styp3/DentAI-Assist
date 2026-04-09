"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CaptionLine } from "@/components/voice-demo/types";
import { useVoiceDemoSession } from "@/hooks/use-voice-demo-session";
import { cn } from "@/lib/utils";
import { Loader2, Mic, MicOff, PhoneOff, Sparkles, Waves } from "lucide-react";

type DemoMode = "circlewaveform" | "siri" | "glob";

const MODES: Array<{ value: DemoMode; label: string }> = [
  { value: "circlewaveform", label: "CircleWaveform" },
  { value: "siri", label: "Siri" },
  { value: "glob", label: "Glob" },
];

const EASE_EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_QUART_OUT: [number, number, number, number] = [0.25, 1, 0.5, 1];

function formatCaptionTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getCallStatusText(callState: "idle" | "connecting" | "active" | "ended" | "error") {
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

function ModeIntro({ mode }: { mode: DemoMode }) {
  if (mode === "circlewaveform") {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0.45 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE_EXPO_OUT }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/60"
          initial={{ scale: 0.55, opacity: 0.9 }}
          animate={{ scale: 3.1, opacity: 0 }}
          transition={{ duration: 0.95, ease: EASE_EXPO_OUT }}
        />
      </motion.div>
    );
  }

  if (mode === "siri") {
    return (
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 overflow-hidden"
        initial={{ opacity: 0.72 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE_EXPO_OUT }}
      >
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent blur-xl"
          initial={{ x: "-140%" }}
          animate={{ x: "340%" }}
          transition={{ duration: 0.8, ease: EASE_QUART_OUT }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: EASE_EXPO_OUT }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300/45"
        initial={{ scale: 0.45, opacity: 0.9 }}
        animate={{ scale: 3.25, opacity: 0 }}
        transition={{ duration: 1.0, ease: EASE_EXPO_OUT }}
      />
    </motion.div>
  );
}

function CircleWaveformMode({
  active,
  volumeLevel,
  onToggleCall,
}: {
  active: boolean;
  volumeLevel: number;
  onToggleCall: () => void;
}) {
  const pulse = 1 + Math.min(0.3, volumeLevel * 0.45);

  const bars = Array.from({ length: 76 }, (_, i) => {
    const angle = (i / 76) * Math.PI * 2;
    const wave = Math.sin(i * 0.58 + volumeLevel * 9);
    const gain = active ? 24 + (wave + 1) * 18 + volumeLevel * 60 : 12;
    const inner = 186;
    const outer = inner + gain;

    return {
      x1: 300 + Math.cos(angle) * inner,
      y1: 300 + Math.sin(angle) * inner,
      x2: 300 + Math.cos(angle) * outer,
      y2: 300 + Math.sin(angle) * outer,
    };
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-cyan-400/20 bg-[radial-gradient(circle_at_52%_44%,rgba(6,182,212,0.18),rgba(2,6,23,0.97)_62%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(34,211,238,0.08),transparent_38%,rgba(6,182,212,0.08)_72%,transparent)]" />

      <svg
        viewBox="0 0 600 600"
        className="absolute h-[70vmin] max-h-[620px] min-h-[320px] w-[70vmin] max-w-[620px] min-w-[320px] text-cyan-300/85"
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
            animate={{ x2: bar.x2, y2: bar.y2 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          />
        ))}
      </svg>

      <motion.button
        type="button"
        onClick={onToggleCall}
        className="relative z-10 inline-flex size-24 items-center justify-center rounded-3xl border border-cyan-300/55 bg-cyan-300/15 text-cyan-100 shadow-[0_0_80px_rgba(34,211,238,0.35)] transition hover:border-cyan-200 hover:bg-cyan-300/24"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        animate={active ? { scale: [pulse, pulse - 0.06, pulse] } : { scale: 1 }}
        transition={{ duration: 1.1, repeat: active ? Number.POSITIVE_INFINITY : 0, ease: EASE_QUART_OUT }}
      >
        {active ? <PhoneOff className="size-9" /> : <Mic className="size-9" />}
      </motion.button>
    </div>
  );
}

function SiriMode({
  active,
  volumeLevel,
  onToggleCall,
}: {
  active: boolean;
  volumeLevel: number;
  onToggleCall: () => void;
}) {
  const bars = Array.from({ length: 64 }, (_, i) => {
    const base = 18 + Math.sin(i / 3) * 8;
    const dynamics = active ? 8 + Math.sin(i * 0.9 + volumeLevel * 15) * 14 + volumeLevel * 40 : 0;
    return Math.max(6, base + dynamics);
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-sky-300/20 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.18),rgba(2,6,23,0.97)_62%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(34,211,238,0.08),transparent_36%,rgba(37,99,235,0.08)_72%,transparent)]" />

      <div className="relative z-10 flex w-[90%] max-w-[1200px] flex-col items-center gap-8 rounded-3xl border border-cyan-300/22 bg-black/35 px-6 py-10 backdrop-blur-sm">
        <motion.button
          type="button"
          onClick={onToggleCall}
          className="inline-flex size-16 items-center justify-center rounded-2xl border border-sky-200/50 bg-sky-300/14 text-sky-50 shadow-[0_0_40px_rgba(56,189,248,0.24)] transition hover:border-sky-100 hover:bg-sky-300/22"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {active ? <PhoneOff className="size-6" /> : <Mic className="size-6" />}
        </motion.button>

        <div className="relative w-full overflow-hidden rounded-2xl border border-sky-300/22 bg-slate-950/60 p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.15),transparent_62%)]" />
          <div className="relative flex h-[220px] items-center justify-center gap-1">
            {bars.map((h, i) => (
              <motion.div
                key={`siri-${i}`}
                className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400/40 via-cyan-300/80 to-indigo-300/85"
                animate={{
                  height: active ? [22, h, Math.max(18, h * 0.75)] : 18,
                  opacity: active ? [0.55, 1, 0.7] : 0.45,
                }}
                transition={{
                  duration: 0.8 + (i % 6) * 0.08,
                  repeat: active ? Number.POSITIVE_INFINITY : 0,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobMode({
  active,
  volumeLevel,
  onToggleCall,
}: {
  active: boolean;
  volumeLevel: number;
  onToggleCall: () => void;
}) {
  const scale = 1 + Math.min(0.22, volumeLevel * 0.45);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-fuchsia-300/20 bg-[radial-gradient(circle_at_50%_35%,rgba(192,132,252,0.2),rgba(2,6,23,0.97)_66%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,70,239,0.08),transparent_34%,rgba(34,211,238,0.08)_74%,transparent)]" />

      <motion.div
        className="absolute h-[52vmin] w-[52vmin] max-h-[560px] max-w-[560px] rounded-full border border-fuchsia-300/20"
        animate={active ? { scale: [0.88, 1.12], opacity: [0.45, 0.02] } : { scale: 1, opacity: 0.2 }}
        transition={{ duration: 2.4, repeat: active ? Number.POSITIVE_INFINITY : 0, ease: EASE_EXPO_OUT }}
      />
      <motion.div
        className="absolute h-[64vmin] w-[64vmin] max-h-[700px] max-w-[700px] rounded-full border border-cyan-300/12"
        animate={active ? { scale: [0.82, 1.1], opacity: [0.35, 0.02] } : { scale: 1, opacity: 0.18 }}
        transition={{ duration: 2.8, repeat: active ? Number.POSITIVE_INFINITY : 0, ease: EASE_EXPO_OUT, delay: 0.18 }}
      />

      <motion.div
        className="relative h-[36vmin] w-[36vmin] min-h-[260px] min-w-[260px] max-h-[420px] max-w-[420px] rounded-full bg-[conic-gradient(from_210deg_at_50%_50%,#22d3ee_0deg,#a855f7_120deg,#10b981_250deg,#22d3ee_360deg)] shadow-[0_0_140px_rgba(56,189,248,0.28)]"
        animate={active ? { rotate: 360, scale } : { rotate: 0, scale: 1 }}
        transition={
          active
            ? { rotate: { duration: 13.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" } }
            : { duration: 0.3 }
        }
      >
        <div className="absolute inset-4 rounded-full bg-slate-950/44 backdrop-blur-sm" />
      </motion.div>

      <motion.button
        type="button"
        onClick={onToggleCall}
        className="absolute bottom-8 inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/45 bg-slate-950/60 px-5 py-2.5 text-fuchsia-50 shadow-[0_0_26px_rgba(168,85,247,0.24)] transition hover:border-fuchsia-200 hover:bg-slate-900/75"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {active ? <PhoneOff className="size-4" /> : <Mic className="size-4" />}
        {active ? "End call" : "Start call"}
      </motion.button>
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
  const statusText = getCallStatusText(callState);

  const mergedCaptions = useMemo(
    () => (interimCaption ? [...captions, interimCaption] : captions),
    [captions, interimCaption]
  );

  const captionRows = useMemo(() => mergedCaptions.slice(-24), [mergedCaptions]);

  useEffect(() => {
    const node = transcriptViewportRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [captionRows.length]);

  const motionPreset = useMemo(() => {
    if (mode === "circlewaveform") {
      return {
        initial: { opacity: 0, y: 18, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -12, scale: 0.99 },
      };
    }
    if (mode === "siri") {
      return {
        initial: { opacity: 0, y: 6, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.992 },
      };
    }
    return {
      initial: { opacity: 0, y: 18, scale: 0.975 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -12, scale: 0.99 },
    };
  }, [mode]);

  const toggleCall = () => {
    if (active || callState === "connecting") {
      void endCall();
      return;
    }
    void startCall();
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_14%_-14%,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_86%_112%,rgba(217,70,239,0.11),transparent_36%),#040507] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] flex-col gap-4 px-4 pb-6 pt-6 md:px-8 md:pb-8">
        <Card className="border border-cyan-400/10 bg-black/45 py-3 shadow-[0_22px_60px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <CardContent className="flex flex-col gap-3 px-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/10">
                <Sparkles className="size-4 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight md:text-4xl">Chat Pearl Demo</h1>
                <p className="text-xs text-zinc-400 md:text-sm">Premium interactive voice showcase for dentist client demos.</p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 xl:w-auto xl:items-end">
              <Tabs value={mode} onValueChange={(value) => setMode(value as DemoMode)}>
                <TabsList className="h-10 rounded-full border border-cyan-300/20 bg-black/65 p-1 shadow-[0_14px_34px_rgba(0,0,0,0.45)] backdrop-blur">
                  {MODES.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="h-8 rounded-full px-4 text-xs font-medium text-zinc-300 transition-all hover:bg-white/8 hover:text-white data-active:bg-cyan-400/18 data-active:text-cyan-50"
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2 xl:justify-end">
                <Badge
                  variant="outline"
                  className={cn(
                    "border-white/20 bg-white/5 text-zinc-200",
                    active && "border-emerald-300/40 text-emerald-200",
                    callState === "connecting" && "border-cyan-300/50 text-cyan-100"
                  )}
                >
                  {callState === "connecting" ? <Loader2 className="size-3 animate-spin" /> : <Waves className="size-3" />}
                  {statusText}
                </Badge>

                <Button
                  variant="outline"
                  className="border-cyan-400/20 bg-black/45 text-zinc-100 hover:bg-cyan-300/10"
                  onClick={() => setShowCaptions((prev) => !prev)}
                >
                  {showCaptions ? "Hide captions" : "Show captions"}
                </Button>

                <Button
                  variant="outline"
                  className="border-cyan-400/20 bg-black/45 text-zinc-100 hover:bg-cyan-300/10"
                  onClick={toggleMute}
                  disabled={!active}
                >
                  {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative flex-1 border border-cyan-400/12 bg-black/50 p-2 shadow-[0_28px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          <CardContent className="grid h-[76vh] grid-rows-[1fr_auto] gap-3 p-0 xl:h-[80vh]">
            <div className="relative overflow-hidden rounded-xl">
              <AnimatePresence>
                {active && (
                  <motion.div
                    key="active-edge-light"
                    className="pointer-events-none absolute inset-0 z-10 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.22, 0.5, 0.22] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <div className="absolute inset-0 rounded-xl border border-cyan-300/30 shadow-[inset_0_0_60px_rgba(34,211,238,0.15)]" />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={prefersReducedMotion ? false : motionPreset.initial}
                  animate={prefersReducedMotion ? {} : motionPreset.animate}
                  exit={prefersReducedMotion ? {} : motionPreset.exit}
                  transition={{ duration: 0.28, ease: EASE_EXPO_OUT }}
                  className="absolute inset-0"
                >
                  {!prefersReducedMotion && <ModeIntro mode={mode} />}
                  {mode === "circlewaveform" ? (
                    <CircleWaveformMode active={active} volumeLevel={volumeLevel} onToggleCall={toggleCall} />
                  ) : mode === "siri" ? (
                    <SiriMode active={active} volumeLevel={volumeLevel} onToggleCall={toggleCall} />
                  ) : (
                    <GlobMode active={active} volumeLevel={volumeLevel} onToggleCall={toggleCall} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showCaptions && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.22, ease: EASE_QUART_OUT }}
                  className="min-h-[170px] rounded-xl border border-cyan-300/18 bg-black/72 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.55)] backdrop-blur-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-cyan-200">Live transcript</p>
                    <p className="text-[11px] text-zinc-400">assistant + user</p>
                  </div>

                  <div ref={transcriptViewportRef} className="h-[130px] overflow-y-auto pr-2 sm:h-[160px]">
                    <div className="space-y-2 text-sm">
                      {captionRows.length === 0 && (
                        <p className="rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-zinc-300">
                          Start a call and the conversation with Pearl will appear here.
                        </p>
                      )}

                      {captionRows.map((line) => (
                        <div
                          key={line.id}
                          className={cn(
                            "rounded-lg border px-3 py-2 transition-colors",
                            line.role === "assistant" && "border-cyan-300/35 bg-cyan-400/12 text-cyan-50",
                            line.role === "user" && "border-violet-300/35 bg-violet-400/12 text-violet-50",
                            line.role === "system" && "border-amber-300/30 bg-amber-500/10 text-amber-50"
                          )}
                        >
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase tracking-wide opacity-80">{captionRoleLabel(line)}</span>
                            <span className="text-[10px] opacity-60">{formatCaptionTime(line.timestamp)}</span>
                          </div>
                          <p className="leading-relaxed break-words">{line.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
