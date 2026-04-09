"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VOICE_DEMO_VARIANTS, type VoiceDemoVariant } from "./types";

interface VoiceDemoVariantSelectorProps {
  value: VoiceDemoVariant;
}

export default function VoiceDemoVariantSelector({
  value,
}: VoiceDemoVariantSelectorProps) {
  return (
    <TabsList
      variant="line"
      className="grid h-auto w-full grid-cols-1 gap-2 rounded-2xl bg-transparent p-0 sm:grid-cols-3"
    >
      {VOICE_DEMO_VARIANTS.map((variant) => (
        <TabsTrigger
          key={variant.id}
          value={variant.id}
          className="h-auto rounded-2xl border border-border bg-card px-4 py-3 text-left transition-transform duration-200 ease-out data-active:border-primary/60 data-active:bg-primary/10 data-active:text-foreground"
          aria-label={`Switch to ${variant.label}`}
        >
          <span className="flex w-full flex-col items-start">
            <span className="text-sm font-semibold">{variant.label}</span>
            <span className="mt-1 text-xs text-muted-foreground">{variant.description}</span>
            {value === variant.id && (
              <span className="mt-2 text-[11px] font-medium text-primary">Active style</span>
            )}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
