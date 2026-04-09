"use client";

import React from "react";
import { PricingTable } from "@clerk/nextjs";

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class PricingTableErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message?: unknown }).message ?? "")
        : "Unable to render pricing at the moment.";

    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    // Keep dev visibility in console without breaking the page.
    console.error("PricingTable render error:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="rounded-2xl border border-amber-300/60 bg-amber-50/70 p-4 text-sm text-amber-900 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="font-medium">Pricing table unavailable in this environment.</p>
        <p className="mt-1 opacity-90">
          Clerk billing appears disabled for this project in development. You can still test Chat
          Pearl and all non-billing features.
        </p>
      </div>
    );
  }
}

export default function PricingTableSafe() {
  return (
    <PricingTableErrorBoundary>
      <PricingTable />
    </PricingTableErrorBoundary>
  );
}

