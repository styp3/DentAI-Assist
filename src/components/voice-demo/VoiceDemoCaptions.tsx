"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CaptionLine } from "./types";

interface VoiceDemoCaptionsProps {
  showCaptions: boolean;
  captions: CaptionLine[];
  interimCaption: CaptionLine | null;
}

function roleLabel(role: CaptionLine["role"]) {
  if (role === "assistant") return "Chat Pearl";
  if (role === "user") return "You";
  return "System";
}

export default function VoiceDemoCaptions({
  showCaptions,
  captions,
  interimCaption,
}: VoiceDemoCaptionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [followTail, setFollowTail] = useState(true);

  const visibleCaptions = useMemo(
    () => (interimCaption ? [...captions, interimCaption] : captions),
    [captions, interimCaption]
  );

  useEffect(() => {
    if (!showCaptions || !followTail || !containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [followTail, showCaptions, visibleCaptions]);

  if (!showCaptions) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Live captions are hidden. Turn them on to see the conversation stream.
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <p className="text-sm font-medium">Live Captions</p>
        {!followTail && (
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => {
              setFollowTail(true);
              if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
              }
            }}>
            Jump to latest
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        aria-live="polite"
        className="max-h-72 space-y-3 overflow-y-auto px-4 py-3"
        onScroll={(event) => {
          const target = event.currentTarget;
          const distanceToBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight;
          setFollowTail(distanceToBottom < 32);
        }}>
        {visibleCaptions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Start a call and captions will appear here in real time.
          </p>
        )}

        {visibleCaptions.map((line, index) => {
          const isInterim = Boolean(interimCaption?.id === line.id);
          return (
            <div
              key={line.id}
              className={cn(
                "rounded-xl border px-3 py-2",
                line.role === "assistant"
                  ? "border-cyan-200 bg-cyan-50/80 dark:border-cyan-900/50 dark:bg-cyan-950/20"
                  : line.role === "user"
                  ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                  : "border-border bg-muted/40",
                isInterim && "opacity-70"
              )}>
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{roleLabel(line.role)}</span>
                <span>{new Date(line.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-sm text-foreground">
                {line.content}
                {isInterim && <span className="ml-1 inline-block animate-pulse">...</span>}
              </p>
              {index === visibleCaptions.length - 1 && isInterim && (
                <p className="mt-1 text-[11px] text-muted-foreground">Updating...</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

