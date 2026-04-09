import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getChatPearlAccessConfig,
  isAdminUser,
  updateChatPearlAccessConfig,
} from "@/lib/chat-pearl-access";

function normalizeEmail(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "Failed to update Chat Pearl access settings.";
}

async function requireAdmin() {
  const user = await currentUser();
  const isAdmin = isAdminUser(user, process.env.ADMIN_EMAIL);
  return { user, isAdmin };
}

export async function GET() {
  const { user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getChatPearlAccessConfig();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  const { user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      testerAccessEnabled?: unknown;
      testerEmails?: unknown;
    };

    const testerAccessEnabled = Boolean(body.testerAccessEnabled);
    const testerEmailsInput = Array.isArray(body.testerEmails) ? body.testerEmails : [];
    const testerEmails = testerEmailsInput
      .map((entry) => (typeof entry === "string" ? normalizeEmail(entry) : ""))
      .filter(Boolean);

    const config = await updateChatPearlAccessConfig({
      testerAccessEnabled,
      testerEmails,
    });

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

