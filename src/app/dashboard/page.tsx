export const dynamic = "force-dynamic";

import ActivityOverview from "@/components/dashboard/ActivityOverview";
import MainActions from "@/components/dashboard/MainActions";
import Navbar from "@/components/Navbar";
import WelcomeSection from "@/components/voice/WelcomeSection";

function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <WelcomeSection />
        <MainActions />
        <ActivityOverview />
      </div>
    </>
  );
}

export default DashboardPage;
