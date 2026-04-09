import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type DivProps = ComponentProps<"div">;

const panelVariants = cva(
  "rounded-[1.2rem] border backdrop-blur-md transition-[border-color,background-color,box-shadow,transform] duration-300",
  {
    variants: {
      tone: {
        base: "border-white/10 bg-[color:var(--premium-surface)] shadow-[0_22px_60px_rgba(0,0,0,0.45)]",
        strong:
          "border-cyan-300/20 bg-[color:var(--premium-surface-strong)] shadow-[0_24px_80px_rgba(0,0,0,0.6)]",
        subtle: "border-white/8 bg-black/28 shadow-[0_16px_42px_rgba(0,0,0,0.4)]",
      },
    },
    defaultVariants: {
      tone: "base",
    },
  }
);

const statusPillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-md",
  {
    variants: {
      tone: {
        idle: "border-white/18 bg-white/6 text-zinc-200",
        connecting: "border-cyan-300/45 bg-cyan-400/12 text-cyan-100",
        active: "border-emerald-300/45 bg-emerald-400/10 text-emerald-100",
        ended: "border-amber-300/45 bg-amber-400/10 text-amber-100",
        error: "border-rose-300/45 bg-rose-400/10 text-rose-100",
      },
    },
    defaultVariants: {
      tone: "idle",
    },
  }
);

export function PremiumPageShell({ className, ...props }: DivProps) {
  return (
    <main
      className={cn(
        "min-h-screen premium-bg text-[color:var(--premium-foreground)]",
        className
      )}
      {...props}
    />
  );
}

export function PremiumViewport({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen w-full max-w-[1700px] flex-col gap-4 px-4 pb-6 pt-6 md:px-8 md:pb-8",
        className
      )}
      {...props}
    />
  );
}

export function PremiumPanel({
  className,
  tone = "base",
  ...props
}: DivProps & { tone?: "base" | "strong" | "subtle" }) {
  return <div className={cn(panelVariants({ tone }), className)} {...props} />;
}

export function PremiumStageContainer({ className, ...props }: DivProps) {
  return (
    <PremiumPanel
      tone="strong"
      className={cn("relative flex-1 overflow-hidden p-2", className)}
      {...props}
    />
  );
}

export function PremiumTranscriptDock({ className, ...props }: DivProps) {
  return (
    <PremiumPanel
      tone="subtle"
      className={cn(
        "rounded-xl border-cyan-300/20 bg-black/62 p-3 shadow-[0_18px_44px_rgba(0,0,0,0.55)]",
        className
      )}
      {...props}
    />
  );
}

export function PremiumStatusPill({
  className,
  tone = "idle",
  ...props
}: DivProps & {
  tone?: "idle" | "connecting" | "active" | "ended" | "error";
}) {
  return <div className={cn(statusPillVariants({ tone }), className)} {...props} />;
}
