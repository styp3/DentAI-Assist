export const dynamic = "force-dynamic";

import ActivityOverview from "@/components/dashboard/ActivityOverview";
import MainActions from "@/components/dashboard/MainActions";
import Navbar from "@/components/Navbar";
import { PremiumPageShell, PremiumViewport } from "@/components/premium/surface";
import WelcomeSection from "@/components/voice/WelcomeSection";

function DashboardPage() {
  return (
    <PremiumPageShell>
      <Navbar />
      <PremiumViewport className="max-w-7xl px-6 py-8 pt-24">
        <WelcomeSection />
        <MainActions />
        <ActivityOverview />
      </PremiumViewport>
    </PremiumPageShell>
  );
}

export default DashboardPage;
