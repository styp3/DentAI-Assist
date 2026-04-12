"use client";

import AdminStats from "@/components/admin/AdminStats";
import DoctorsManagement from "@/components/admin/DoctorsManagement";
import RecentAppointments from "@/components/admin/RecentAppointments";
import Navbar from "@/components/Navbar";
import { PremiumPageShell, PremiumViewport } from "@/components/premium/surface";
import { useGetAppointments } from "@/hooks/use-appointment";
import { useGetDoctors } from "@/hooks/use-doctors";
import { useUser } from "@clerk/nextjs";
import { SettingsIcon } from "lucide-react";
import { AppointmentStatus } from "@/generated/prisma/enums";

function AdminDashboardClient() {
  const { user } = useUser();
  const { data: doctors = [], isLoading: doctorsLoading } = useGetDoctors();
  const { data: appointments = [], isLoading: appointmentsLoading } =
    useGetAppointments();

  // calculate stats from real data
  const stats = {
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter((doc) => doc.isActive).length,
    totalAppointments: appointments.length,
    completedAppointments: appointments.filter(
      (app) => app.status === AppointmentStatus.COMPLETED
    ).length,
  };

  if (doctorsLoading || appointmentsLoading) return <LoadingUI />;

  return (
    <PremiumPageShell>
      <Navbar />

      <PremiumViewport className="max-w-7xl px-6 py-8 pt-24 animate-in fade-in duration-500">
        {/* ADMIN WELCOME SECTION */}
        <div className="mb-12 flex items-center justify-between rounded-3xl border border-orange-300/20 bg-[linear-gradient(145deg,rgba(232,138,83,0.16),rgba(18,12,8,0.92)_40%,rgba(6,6,6,0.95))] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-3 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-orange-300" />
              <span className="text-sm font-medium text-orange-100">
                Admin Dashboard
              </span>
            </div>
            <div>
              <h1 className="mb-2 text-4xl font-bold text-zinc-100">
                Welcome back, {user?.firstName || "Admin"}!
              </h1>
              <p className="text-zinc-300">
                Manage doctors, oversee appointments, and monitor your dental
                practice performance.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-orange-300/30 bg-orange-400/10 shadow-[0_0_46px_rgba(232,138,83,0.22)]">
              <SettingsIcon className="h-16 w-16 text-orange-200" />
            </div>
          </div>
        </div>

        <AdminStats
          totalDoctors={stats.totalDoctors}
          activeDoctors={stats.activeDoctors}
          totalAppointments={stats.totalAppointments}
          completedAppointments={stats.completedAppointments}
        />

        <DoctorsManagement />

        <RecentAppointments />
      </PremiumViewport>
    </PremiumPageShell>
  );
}

export default AdminDashboardClient;

function LoadingUI() {
  return (
    <PremiumPageShell>
      <Navbar />
      <PremiumViewport className="max-w-7xl px-6 py-8 pt-24">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-orange-300/65 border-t-transparent" />
            <p className="text-zinc-300">Loading your dashboard...</p>
          </div>
        </div>
      </PremiumViewport>
    </PremiumPageShell>
  );
}
