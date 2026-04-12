import { getUserAppointments } from "@/lib/actions/appointments";
import { format, isAfter, isSameDay} from "date-fns";
import NoNextAppointments from "./NoNextAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";

async function NextAppointment() {
  const appointments = await getUserAppointments();

  // filter for upcoming CONFIRMED appointments only (today or future)
  const upcomingAppointments =
    appointments?.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      const isUpcoming =
        isSameDay(appointmentDate, today) || isAfter(appointmentDate, today);
      return isUpcoming && appointment.status === "CONFIRMED";
    }) || [];

  // get the next appointment
  const nextAppointment = upcomingAppointments[0];

  if (!nextAppointment) return <NoNextAppointments />;

  const appointmentDate = new Date(nextAppointment.date);
  const formattedDate = format(appointmentDate, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(appointmentDate, new Date());

  return (
    <Card className="border-orange-300/20 bg-linear-to-br from-orange-300/10 to-black/48 shadow-[0_14px_40px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <CalendarIcon className="size-5 text-orange-300" />
          Next Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-300/12 px-3 py-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-orange-300" />
            <span className="text-sm font-medium text-orange-100">
              {isToday ? "Today" : "Upcoming"}
            </span>
          </div>
          <span className="rounded bg-black/35 px-2 py-1 text-xs text-zinc-300">
            {nextAppointment.status}
          </span>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-300/14">
              <UserIcon className="size-4 text-orange-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100">
                {nextAppointment.doctor?.name}
              </p>
              <p className="text-xs text-zinc-400">
                {nextAppointment.reason}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-300/14">
              <CalendarIcon className="size-4 text-orange-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100">{formattedDate}</p>
              <p className="text-xs text-zinc-400">
                {isToday ? "Today" : format(appointmentDate, "EEEE")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-300/14">
              <ClockIcon className="size-4 text-orange-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100">{nextAppointment.time}</p>
              <p className="text-xs text-zinc-400">Local time</p>
            </div>
          </div>
        </div>

        {/* More Appointments Count */}
        {upcomingAppointments.length > 1 && (
          <p className="text-center text-xs text-zinc-400">
            +{upcomingAppointments.length - 1} more upcoming appointment
            {upcomingAppointments.length > 2 ? "s" : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default NextAppointment;
