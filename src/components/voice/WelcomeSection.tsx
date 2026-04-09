import { MicIcon } from "lucide-react";

function WelcomeSection() {
  return (
    <div className="z-10 mb-12 flex items-center justify-between overflow-hidden rounded-3xl border border-cyan-300/20 bg-[linear-gradient(145deg,rgba(34,211,238,0.16),rgba(2,6,23,0.92)_40%,rgba(6,10,18,0.95))] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
          <span className="text-sm font-medium text-cyan-100">
            Voice Assistant Ready
          </span>
        </div>
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-50">AI Voice Assistant</h1>
          <p className="text-zinc-300">
            Talk to your AI dental assistant using natural voice commands. Get
            instant advice and professional guidance.
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10 shadow-[0_0_46px_rgba(34,211,238,0.22)]">
          <MicIcon className="h-16 w-16 text-cyan-200" />
        </div>
      </div>
    </div>
  );
}
export default WelcomeSection;
