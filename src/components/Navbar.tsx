"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { CalendarIcon, CrownIcon, HomeIcon, MicIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 w-full border-b border-orange-300/15 bg-black/58 px-6 py-2 shadow-[0_10px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        {/* LOGO */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="DentAI Assist Logo"
              width={32}
              height={32}
              className="w-11"
            />
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 transition-colors ${
                pathname.startsWith("/dashboard")
                  ? "font-medium text-orange-100 hover:text-orange-100"
                  : "text-zinc-400 hover:text-orange-100"
              }`}>
              <HomeIcon className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            <Link
              href="/appointments"
              className={`flex items-center gap-2 transition-colors hover:text-primary ${
                pathname.startsWith("/appointments")
                  ? "text-orange-100"
                  : "text-zinc-400 hover:text-orange-100"
              }`}>
              <CalendarIcon className="w-4 h-4" />
              <span className="hidden md:inline">Appointments</span>
            </Link>

            <Link
              href="/voice"
              className={`flex items-center gap-2 transition-colors hover:text-primary ${
                pathname.startsWith("/voice")
                  ? "text-orange-100"
                  : "text-zinc-400 hover:text-orange-100"
              }`}>
              <MicIcon className="w-4 h-4" />
              <span className="hidden md:inline">Voice</span>
            </Link>
            <Link
              href="/pro"
              className={`flex items-center gap-2 transition-colors hover:text-primary ${
                pathname.startsWith("/pro")
                  ? "text-orange-100"
                  : "text-zinc-400 hover:text-orange-100"
              }`}>
              <CrownIcon className="w-4 h-4" />
              <span className="hidden md:inline">Pro</span>
            </Link>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-zinc-400">
                {user?.emailAddresses?.[0]?.emailAddress}
              </span>
            </div>

            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
