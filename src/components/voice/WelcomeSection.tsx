import { MicIcon } from "lucide-react";

function WelcomeSection() {
  return (
    <div className="z-10 mb-12 flex items-center justify-between overflow-hidden rounded-3xl border border-orange-300/20 bg-[linear-gradient(145deg,rgba(232,138,83,0.16),rgba(18,12,8,0.92)_40%,rgba(6,6,6,0.95))] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-3 py-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-orange-300" />
          <span className="text-sm font-medium text-orange-100">
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
        <div className="flex h-32 w-32 items-center justify-center rounded-full border border-orange-300/30 bg-orange-400/10 shadow-[0_0_46px_rgba(232,138,83,0.22)]">
          <MicIcon className="h-16 w-16 text-orange-200" />
        </div>
      </div>
    </div>
  );
}
export default WelcomeSection;
