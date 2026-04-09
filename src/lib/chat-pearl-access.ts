import type { User } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const CHAT_PEARL_SETTINGS = {
  testerAccessEnabled: "chatPearlTesterAccessEnabled",
  testerAllowlist: "chatPearlTesterAllowlist",
} as const;

export interface ChatPearlAccessConfig {
  testerAccessEnabled: boolean;
  testerEmails: string[];
}

function normalizeEmail(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

function parseTesterEmails(raw: string) {
  return raw
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = (error as { code?: string }).code;
  return maybeCode === "P2021";
}

function parseEmailList(value?: string | null) {
  return (value ?? "")
    .split(",")
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean);
}

export function getUserEmails(user: User | null) {
  if (!user) return [];
  const fromAddresses = user.emailAddresses
    .map((entry) => normalizeEmail(entry.emailAddress))
    .filter(Boolean);
  const primary = normalizeEmail(user.primaryEmailAddress?.emailAddress);
  return Array.from(new Set([primary, ...fromAddresses].filter(Boolean)));
}

export function isAdminUser(user: User | null, adminEmailEnv?: string | null) {
  if (!user) return false;
  const metadata = user.publicMetadata as { role?: unknown } | undefined;
  const metadataRole =
    typeof metadata?.role === "string" ? metadata.role.toLowerCase() : null;
  if (metadataRole === "admin") return true;

  const userEmails = getUserEmails(user);
  const adminEmails = parseEmailList(adminEmailEnv);
  if (adminEmails.length === 0) return false;
  return userEmails.some((email) => adminEmails.includes(email));
}

export async function getChatPearlAccessConfig(): Promise<ChatPearlAccessConfig> {
  try {
    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [
            CHAT_PEARL_SETTINGS.testerAccessEnabled,
            CHAT_PEARL_SETTINGS.testerAllowlist,
          ],
        },
      },
    });

    const enabled =
      settings.find((item) => item.key === CHAT_PEARL_SETTINGS.testerAccessEnabled)
        ?.value === "true";
    const allowlist =
      settings.find((item) => item.key === CHAT_PEARL_SETTINGS.testerAllowlist)?.value ??
      "";

    return {
      testerAccessEnabled: enabled,
      testerEmails: parseTesterEmails(allowlist),
    };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { testerAccessEnabled: false, testerEmails: [] };
    }
    throw error;
  }
}

export async function updateChatPearlAccessConfig(config: ChatPearlAccessConfig) {
  const testerEmails = Array.from(new Set(config.testerEmails.map(normalizeEmail).filter(Boolean)));

  await prisma.$transaction([
    prisma.appSetting.upsert({
      where: { key: CHAT_PEARL_SETTINGS.testerAccessEnabled },
      update: { value: config.testerAccessEnabled ? "true" : "false" },
      create: {
        key: CHAT_PEARL_SETTINGS.testerAccessEnabled,
        value: config.testerAccessEnabled ? "true" : "false",
      },
    }),
    prisma.appSetting.upsert({
      where: { key: CHAT_PEARL_SETTINGS.testerAllowlist },
      update: { value: testerEmails.join(",") },
      create: {
        key: CHAT_PEARL_SETTINGS.testerAllowlist,
        value: testerEmails.join(","),
      },
    }),
  ]);

  return {
    testerAccessEnabled: config.testerAccessEnabled,
    testerEmails,
  };
}

export function canAccessChatPearlByEmail({
  userEmails,
  isAdmin,
  config,
}: {
  userEmails: string[];
  isAdmin: boolean;
  config: ChatPearlAccessConfig;
}) {
  if (isAdmin) return true;
  if (!config.testerAccessEnabled) return false;
  return userEmails.some((email) => config.testerEmails.includes(email));
}
