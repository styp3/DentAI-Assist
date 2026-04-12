import fs from "node:fs";
import path from "node:path";
import net from "node:net";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const WITH_ROUTES = process.argv.includes("--with-routes");
const BASE_URL_ARG = process.argv.find((arg) => arg.startsWith("--base-url="));
const BASE_URL = BASE_URL_ARG
  ? BASE_URL_ARG.slice("--base-url=".length)
  : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const REQUIRED_ENV_KEYS = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
  "DATABASE_URL",
  "NEXT_PUBLIC_VAPI_ASSISTANT_ID",
  "NEXT_PUBLIC_VAPI_API_KEY",
  "ADMIN_EMAIL",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_APP_URL",
];

function loadDotEnvLocal() {
  if (!fs.existsSync(ENV_PATH)) return;
  const source = fs.readFileSync(ENV_PATH, "utf8");
  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const unquoted = rawValue.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = unquoted;
  }
}

function printSection(title) {
  console.log(`\n${title}`);
}

function pass(message) {
  console.log(`  PASS ${message}`);
}

function warn(message) {
  console.log(`  WARN ${message}`);
}

function fail(message) {
  console.log(`  FAIL ${message}`);
}

async function checkDbConnection(databaseUrl) {
  try {
    const parsed = new URL(databaseUrl);
    const host = parsed.hostname;
    const port = Number(parsed.port || 5432);
    await new Promise((resolve, reject) => {
      const socket = net.createConnection({ host, port });
      socket.setTimeout(5000);
      socket.once("connect", () => {
        socket.end();
        resolve(true);
      });
      socket.once("timeout", () => {
        socket.destroy();
        reject(new Error("timeout"));
      });
      socket.once("error", (error) => {
        socket.destroy();
        reject(error);
      });
    });
    return { ok: true, host, port };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, message };
  }
}

async function fetchStatus(url) {
  const response = await fetch(url, { redirect: "manual" });
  return {
    status: response.status,
    location: response.headers.get("location"),
  };
}

async function runRouteChecks(baseUrl) {
  const checks = [
    {
      path: "/",
      expected: (status) => status === 200,
      hint: "Expected 200 for landing page.",
    },
    {
      path: "/pro",
      expected: (status) => status === 307 || status === 302,
      hint: "Expected redirect for signed-out request.",
    },
    {
      path: "/chat-pearl",
      expected: (status) => status === 307 || status === 302,
      hint: "Expected redirect for signed-out request.",
    },
    {
      path: "/voice",
      expected: (status) => status === 200,
      hint: "Expected public route to load for signed-out request.",
    },
  ];

  const failures = [];

  for (const check of checks) {
    const url = `${baseUrl}${check.path}`;
    try {
      const result = await fetchStatus(url);
      if (check.expected(result.status)) {
        const locationSuffix = result.location ? ` location=${result.location}` : "";
        pass(`${check.path} -> ${result.status}${locationSuffix}`);
      } else {
        failures.push(`${check.path} returned ${result.status}. ${check.hint}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      failures.push(`${check.path} could not be reached (${message}).`);
    }
  }

  return failures;
}

async function main() {
  loadDotEnvLocal();

  console.log("DentAI Demo Preflight");
  console.log(`Root: ${ROOT}`);
  console.log(`Routes check: ${WITH_ROUTES ? "enabled" : "disabled"}`);
  if (WITH_ROUTES) console.log(`Base URL: ${BASE_URL}`);

  let hasFailure = false;

  printSection("Environment");
  for (const key of REQUIRED_ENV_KEYS) {
    if (process.env[key]) pass(`${key} is set`);
    else {
      fail(`${key} is missing`);
      hasFailure = true;
    }
  }

  if (process.env.DEMO_MODE === "true") {
    warn("DEMO_MODE=true (recommended for resilient demos)");
  } else {
    warn("DEMO_MODE is not true (set to true for safer live demos)");
  }

  printSection("Database Reachability");
  if (!process.env.DATABASE_URL) {
    fail("DATABASE_URL missing, skipping DB reachability test.");
    hasFailure = true;
  } else {
    const result = await checkDbConnection(process.env.DATABASE_URL);
    if (result.ok) {
      pass(`Database host reachable at ${result.host}:${result.port}`);
    } else {
      fail(`Database not reachable (${result.message})`);
      hasFailure = true;
    }
  }

  if (WITH_ROUTES) {
    printSection("Route Smoke Checks");
    const routeFailures = await runRouteChecks(BASE_URL);
    if (routeFailures.length > 0) {
      for (const routeFailure of routeFailures) fail(routeFailure);
      hasFailure = true;
    }
  } else {
    printSection("Route Smoke Checks");
    warn("Skipped. Run `npm run demo:preflight:routes` while the app is running.");
  }

  printSection("Result");
  if (hasFailure) {
    fail("Preflight failed. Resolve the FAIL items before a live demo.");
    process.exitCode = 1;
    return;
  }

  pass("Preflight passed. Demo environment looks ready.");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(`Unexpected preflight failure: ${message}`);
  process.exitCode = 1;
});
