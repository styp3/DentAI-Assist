export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatPearlDemoClient from "@/components/chat-pearl/ChatPearlDemoClient";
import {
  canAccessChatPearlByEmail,
  getChatPearlAccessConfig,
  getUserEmails,
  isAdminUser,
} from "@/lib/chat-pearl-access";

async function ChatPearlPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const isAdmin = isAdminUser(user, process.env.ADMIN_EMAIL);
  const accessConfig = await getChatPearlAccessConfig();
  const userEmails = getUserEmails(user);
  const canAccessDemo = canAccessChatPearlByEmail({
    userEmails,
    isAdmin,
    config: accessConfig,
  });

  if (!canAccessDemo) {
    return (
      <main className="premium-bg flex min-h-screen items-center justify-center p-8 text-white">
        <div className="w-full max-w-xl rounded-2xl border border-orange-300/20 bg-black/48 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <h1 className="text-2xl font-semibold">Chat Pearl access required</h1>
          <p className="mt-2 text-zinc-300">
            Ask an admin to enable tester access and add your email from the `/pro` panel.
          </p>
        </div>
      </main>
    );
  }

  return <ChatPearlDemoClient />;
}

export default ChatPearlPage;
