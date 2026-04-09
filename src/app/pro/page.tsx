export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import PricingTableSafe from "@/components/pro/PricingTableSafe";
import VoiceDemoAdminAccessPanel from "@/components/voice-demo/VoiceDemoAdminAccessPanel";
import { currentUser } from "@clerk/nextjs/server";
import {
  canAccessChatPearlByEmail,
  getUserEmails,
  getChatPearlAccessConfig,
  isAdminUser,
} from "@/lib/chat-pearl-access";
import { ArrowUpRight, CrownIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function ProPage() {
  const user = await currentUser();

  if (!user) redirect("/");

  const isAdmin = isAdminUser(user, process.env.ADMIN_EMAIL);
  const accessConfig = await getChatPearlAccessConfig();
  const userEmails = getUserEmails(user);
  const canAccessDemo = canAccessChatPearlByEmail({
    userEmails,
    isAdmin,
    config: accessConfig,
  });

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {isAdmin && (
          <VoiceDemoAdminAccessPanel
            initialTesterAccessEnabled={accessConfig.testerAccessEnabled}
            initialTesterEmails={accessConfig.testerEmails}
          />
        )}

        <div className="mb-8 rounded-2xl border border-primary/30 bg-linear-to-br from-primary/10 via-card to-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">Voice Demo Lab</p>
              <h2 className="mt-1 text-2xl font-bold">Chat Pearl</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Dedicated full-page demo with VapiBlocks-inspired modes: CircleWaveform, Siri, and Glob.
              </p>
            </div>
            {canAccessDemo ? (
              <Link
                href="/chat-pearl"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90"
              >
                <Sparkles className="size-4" />
                Open Chat Pearl
                <ArrowUpRight className="size-4" />
              </Link>
            ) : (
              <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                Chat Pearl access is not enabled for this account yet.
              </div>
            )}
          </div>
        </div>

        <div className="mb-12 overflow-hidden animate-in fade-in duration-500">
          <div className="flex items-center justify-between bg-linear-to-br from-primary/10 to-background rounded-3xl p-8 border border-primary/20">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 ">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">
                  Upgrade to Pro
                </span>
              </div>

              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Unlock Premium AI Dental Care
                </h1>
                <p className="text-muted-foreground">
                  Get unlimited AI consultations, advanced features, and
                  priority support to take your dental health to the next level.
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-linear-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <CrownIcon className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your dental care needs. All plans
              include secure access and bank-level encryption.
            </p>
          </div>

          <PricingTableSafe />
        </div>
      </div>
    </>
  );
}

export default ProPage;
