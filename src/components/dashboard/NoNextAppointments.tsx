import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

function NoNextAppointments() {
  return (
    <Card className="border-cyan-300/16 bg-black/45 shadow-[0_14px_40px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <CalendarIcon className="size-5 text-cyan-300" />
          Next Appointment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="py-8 text-center text-zinc-400">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300/10">
            <CalendarIcon className="size-8 opacity-50" />
          </div>
          <p className="text-sm mb-3">No upcoming appointments</p>
          <Link href="/appointments">
            <Button size="sm" variant="outline" className="w-full border-cyan-300/28 bg-black/24 text-zinc-100 hover:bg-cyan-300/10">
              Schedule Your Next Visit
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default NoNextAppointments;
