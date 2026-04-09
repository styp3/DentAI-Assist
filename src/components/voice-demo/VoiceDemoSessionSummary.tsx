"use client";

import { Clock4, MessageSquareText } from "lucide-react";

interface VoiceDemoSessionSummaryProps {
  sessionDurationMs: number;
  totalCaptions: number;
  show: boolean;
}

function formatDuration(ms: number) {
  if (ms <= 0) return "0s";
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export default function VoiceDemoSessionSummary({
  sessionDurationMs,
  totalCaptions,
  show,
}: VoiceDemoSessionSummaryProps) {
  if (!show) return null;

  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <h3 className="text-sm font-semibold">Session summary</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Local captions are in-memory only and are not persisted in this app.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock4 className="size-4 text-primary" />
            <span className="text-muted-foreground">Duration</span>
            <span className="ml-auto font-medium">{formatDuration(sessionDurationMs)}</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4 text-primary" />
            <span className="text-muted-foreground">Caption lines</span>
            <span className="ml-auto font-medium">{totalCaptions}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

