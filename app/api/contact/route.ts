import { rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Body = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot. Humans never see it; bots fill it. */
  company?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) return null;
  return trimmed;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot: answer exactly like a success so bots learn nothing.
  // (The honest-failure rule below is for humans; this path is for bots.)
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const name = field(body.name, 100);
  const email = field(body.email, 200);
  const message = field(body.message, 5000);
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Add your name.";
  if (!email || !EMAIL_RE.test(email)) errors.email = "Add a valid email so I can reply.";
  if (!message || message.length < 10) errors.message = "Say a little more (at least 10 characters).";
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: "invalid", errors }, { status: 400 });
  }

  // Env gate: without delivery configured, fail honestly. Never fake success.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return Response.json({ error: "contact_unavailable" }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
