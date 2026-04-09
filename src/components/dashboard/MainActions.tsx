import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MessageSquareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MainActions() {
  return (
    <div className="mb-12 grid gap-8 md:grid-cols-2">
      <Card className="group relative overflow-hidden border border-cyan-300/16 bg-black/42 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-300/8 to-cyan-300/14 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardContent className="relative p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400/26 to-cyan-400/12 transition-transform duration-300 group-hover:scale-110">
              <Image src="/audio.png" alt="Voice AI" width={32} height={32} className="w-10" />
            </div>
            <div>
              <h3 className="mb-2 text-2xl font-bold text-zinc-100">AI Voice Assistant</h3>
              <p className="text-zinc-400">Get instant dental advice through voice calls</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="text-sm text-zinc-200">24/7 availability</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="text-sm text-zinc-200">Professional dental guidance</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="text-sm text-zinc-200">Instant pain relief advice</span>
            </div>
          </div>

          <Link
            href="/voice"
            className={buttonVariants({
              variant: "default",
              className:
                "mt-6 w-full rounded-xl border border-cyan-300/40 bg-linear-to-r from-cyan-500/90 to-cyan-400/75 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:from-cyan-400/90 hover:to-cyan-300/80 hover:shadow-xl hover:shadow-cyan-500/30",
            })}
          >
            <MessageSquareIcon className="mr-2 h-5 w-5" />
            Start Voice Call
          </Link>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border border-cyan-300/16 bg-black/42 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-linear-to-br from-violet-300/8 to-cyan-300/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardContent className="relative p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400/26 to-cyan-400/12 transition-transform duration-300 group-hover:scale-110">
              <Image src="/calendar.png" alt="Calendar" width={32} height={32} className="w-10" />
            </div>
            <div>
              <h3 className="mb-2 text-2xl font-bold text-zinc-100">Book Appointment</h3>
              <p className="text-zinc-400">Schedule with verified dentists in your area</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="text-sm text-zinc-200">Verified dental professionals</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="text-sm text-zinc-200">Flexible scheduling</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="text-sm text-zinc-200">Instant confirmations</span>
            </div>
          </div>

          <Link href="/appointments">
            <Button
              variant="outline"
              className="mt-6 w-full rounded-xl border border-cyan-300/26 bg-black/35 py-3 font-semibold text-zinc-100 transition-all duration-300 hover:border-cyan-300/42 hover:bg-cyan-300/8"
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              Schedule Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
