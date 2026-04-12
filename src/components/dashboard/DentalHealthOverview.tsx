import { getUserAppointmentStats } from "@/lib/actions/appointments";
import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BrainIcon, MessageSquareIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";

async function DentalHealthOverview() {
  const appointmentStats = await getUserAppointmentStats();
  const user = await currentUser();

  return (
    <Card className="lg:col-span-2 border-orange-300/16 bg-black/45 shadow-[0_14px_40px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <BrainIcon className="size-5 text-orange-300" />
          Your Dental Health
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Keep track of your dental care journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-orange-300/12 bg-orange-400/6 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-orange-200">
              {appointmentStats.completedAppointments}
            </div>
            <div className="text-sm text-zinc-400">
              Completed Visits
            </div>
          </div>
          <div className="rounded-xl border border-orange-300/12 bg-orange-400/6 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-orange-200">
              {appointmentStats.totalAppointments}
            </div>
            <div className="text-sm text-zinc-400">
              Total Appointments
            </div>
          </div>
          <div className="rounded-xl border border-orange-300/12 bg-orange-400/6 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-orange-200">
              <div className="mb-1 text-2xl font-bold text-orange-200">
                {user?.createdAt
                  ? format(new Date(user.createdAt), "MMM yyyy")
                  : "N/A"}
              </div>
            </div>
            <div className="text-sm text-zinc-400">Member Since</div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-orange-300/20 bg-linear-to-r from-orange-300/14 to-orange-300/8 p-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-orange-300/20 flex items-center justify-center shrink-0">
              <MessageSquareIcon className="size-5 text-orange-200" />
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-orange-100">
                Ready to get started?
              </h4>
              <p className="mb-3 text-sm text-zinc-300">
                Book your first appointment or try our AI voice assistant for
                instant dental advice.
              </p>
              <div className="flex gap-2">
                <Link href="/voice">
                  <Button size="sm" className="border border-orange-300/40 bg-orange-400/80 text-slate-950 hover:bg-orange-300/90">
                    Try AI Assistant
                  </Button>
                </Link>
                <Link href="/appointments">
                  <Button size="sm" variant="outline" className="border-orange-300/28 bg-black/30 text-zinc-100 hover:bg-orange-300/10">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DentalHealthOverview;
