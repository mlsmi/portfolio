"use client";

import { useState } from "react";

import { SITE } from "@/lib/site-config";

type Status = "idle" | "submitting" | "sent" | "error";

const INPUT =
  "w-full border border-line bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorNote, setErrorNote] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setFieldErrors({});
    setErrorNote(null);

    let res: Response;
    try {
      res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });
    } catch {
      setStatus("error");
      setErrorNote("Transmission failed. Reach me through the links below instead.");
      return;
    }

    if (res.ok) {
      setStatus("sent");
      form.reset();
      return;
    }
    setStatus("error");
    if (res.status === 503) {
      setErrorNote("The contact relay is not configured yet. Reach me on GitHub or LinkedIn below.");
    } else if (res.status === 429) {
      setErrorNote("Too many messages in a short time. Wait a few minutes and try again.");
    } else if (res.status === 400) {
      try {
        const body = (await res.json()) as { errors?: Record<string, string> };
        setFieldErrors(body.errors ?? {});
        setErrorNote("Check the highlighted fields.");
      } catch {
        setErrorNote("That didn't go through. Check the fields and try again.");
      }
    } else {
      setErrorNote("Transmission failed. Reach me through the links below instead.");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-line bg-surface p-6" role="status">
        <p className="nums text-sm text-accent">Message received.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Thanks for reaching out. I read everything and reply to real inquiries,
          usually within a day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm text-muted">
            Name
          </label>
          <input id="contact-name" name="name" type="text" autoComplete="name" required className={INPUT} />
          {fieldErrors.name ? <p className="mt-1.5 text-xs text-error">{fieldErrors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm text-muted">
            Email
          </label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required className={INPUT} />
          {fieldErrors.email ? <p className="mt-1.5 text-xs text-error">{fieldErrors.email}</p> : null}
        </div>
      </div>
      {/* Honeypot: visually hidden, not display:none, so naive bots still fill it. */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="mt-4">
        <label htmlFor="contact-message" className="mb-1.5 block text-sm text-muted">
          Message
        </label>
        <textarea id="contact-message" name="message" rows={5} required className={INPUT} />
        {fieldErrors.message ? <p className="mt-1.5 text-xs text-error">{fieldErrors.message}</p> : null}
      </div>
      {errorNote ? (
        <p className="mt-4 text-sm text-error" role="alert">
          {errorNote}{" "}
          {errorNote.includes("GitHub") ? (
            <span className="text-muted">
              <a className="underline hover:text-ink" href={SITE.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              {" / "}
              <a className="underline hover:text-ink" href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </span>
          ) : null}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      >
        {status === "submitting" ? "Sending" : "Send message"}
      </button>
    </form>
  );
}
