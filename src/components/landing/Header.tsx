import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

function Header() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-cyan-300/14 bg-black/56 px-6 py-2 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="DentAI Assist Logo"
            width={32}
            height={32}
            className="w-11"
          />
          <span className="text-lg font-semibold text-zinc-100">DentAI Assist</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-zinc-400 transition-colors hover:text-cyan-100">
            How it Works
          </a>
          <a
            href="#pricing"
            className="text-zinc-400 transition-colors hover:text-cyan-100">
            Pricing
          </a>
          <a
            href="#about"
            className="text-zinc-400 transition-colors hover:text-cyan-100">
            About
          </a>
        </div>

        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <Button
              className="hover:scale-[1.02]"
              variant={"ghost"}
              size={"sm"}>
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="hover:scale-[1.02]" size={"sm"}>
              Get Started
            </Button>
          </SignUpButton>
        </div>
      </div>
    </nav>
  );
}
export default Header;
