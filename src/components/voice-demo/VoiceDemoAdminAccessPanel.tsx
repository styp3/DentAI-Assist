"use client";

import { useMemo, useState } from "react";
import { Loader2, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface VoiceDemoAdminAccessPanelProps {
  initialTesterAccessEnabled: boolean;
  initialTesterEmails: string[];
}

function parseEmails(raw: string) {
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export default function VoiceDemoAdminAccessPanel({
  initialTesterAccessEnabled,
  initialTesterEmails,
}: VoiceDemoAdminAccessPanelProps) {
  const [testerAccessEnabled, setTesterAccessEnabled] = useState(
    initialTesterAccessEnabled
  );
  const [emailsRaw, setEmailsRaw] = useState(initialTesterEmails.join(", "));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedCount = useMemo(() => parseEmails(emailsRaw).length, [emailsRaw]);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch("/api/chat-pearl-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testerAccessEnabled,
          testerEmails: parseEmails(emailsRaw),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Failed to save tester access settings.");
      }

      setStatus("Tester access settings saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save tester access settings."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mb-6 rounded-2xl border border-primary/20 bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Chat Pearl tester access</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Allow selected non-admin users to open the Chat Pearl demo on `/pro`.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-xs">
          <Users className="size-3.5 text-primary" />
          {parsedCount} tester{parsedCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-3">
          <Switch
            id="chat-pearl-tester-access"
            checked={testerAccessEnabled}
            onCheckedChange={setTesterAccessEnabled}
            aria-label="Enable tester access"
          />
          <Label htmlFor="chat-pearl-tester-access" className="text-sm font-medium">
            Enable tester access
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chat-pearl-testers" className="text-sm">
            Allowed tester emails (comma separated)
          </Label>
          <Input
            id="chat-pearl-testers"
            value={emailsRaw}
            onChange={(event) => setEmailsRaw(event.target.value)}
            placeholder="tester1@example.com, tester2@example.com"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save access settings
          </Button>

          {status && <p className="text-sm text-orange-500">{status}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
    </section>
  );
}
