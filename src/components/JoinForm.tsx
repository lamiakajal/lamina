"use client";

import { useState } from "react";
import { ROLES } from "@/lib/validate";

type Status = "idle" | "sending" | "saved" | "demo" | "error";

const ROLE_LABEL: Record<(typeof ROLES)[number], string> = {
  student: "Student",
  diver: "Diver",
  educator: "Educator",
  researcher: "Researcher",
  curious: "Just curious",
};

const field =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#04131c]/70 px-4 py-3 text-white placeholder:text-white/35 focus:border-cyan-200/70";

export default function JoinForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setErrors({});

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          role: data.get("role"),
          message: data.get("message"),
          company: data.get("company"),
          consent: data.get("consent") === "on",
        }),
      });
      const json = (await res.json()) as { ok: boolean; stored?: boolean; errors?: Record<string, string> };

      if (!res.ok || !json.ok) {
        setErrors(json.errors ?? { form: "Something went wrong. Please try again." });
        setStatus("error");
        return;
      }
      form.reset();
      setStatus(json.stored ? "saved" : "demo");
    } catch {
      setErrors({ form: "Could not reach the server. Please try again." });
      setStatus("error");
    }
  }

  if (status === "saved" || status === "demo") {
    return (
      <div role="status" className="rounded-2xl border border-white/10 bg-[#020b12]/60 p-8 backdrop-blur-md">
        <h3 className="font-display text-3xl">You are on the list.</h3>
        <p className="mt-3 text-white/80">
          {status === "saved"
            ? "Thank you. Lamina is a concept project, so there is no real expedition yet, but your details are saved."
            : "Thank you. This copy of the site is running without a database, so nothing was saved."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-white/10 bg-[#020b12]/60 p-6 backdrop-blur-md sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-white/80">
          Name
          <input name="name" type="text" required maxLength={80} autoComplete="name" className={field} aria-invalid={!!errors.name} />
          {errors.name && <span className="mt-1 block text-xs text-rose-300">{errors.name}</span>}
        </label>
        <label className="block text-sm text-white/80">
          Email
          <input name="email" type="email" required maxLength={254} autoComplete="email" className={field} aria-invalid={!!errors.email} />
          {errors.email && <span className="mt-1 block text-xs text-rose-300">{errors.email}</span>}
        </label>
      </div>

      <label className="mt-5 block text-sm text-white/80">
        I am a
        <select name="role" required defaultValue="" className={field} aria-invalid={!!errors.role}>
          <option value="" disabled>
            Choose one
          </option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
        {errors.role && <span className="mt-1 block text-xs text-rose-300">{errors.role}</span>}
      </label>

      <label className="mt-5 block text-sm text-white/80">
        Message <span className="text-white/40">(optional)</span>
        <textarea name="message" rows={3} maxLength={1000} className={field} />
        {errors.message && <span className="mt-1 block text-xs text-rose-300">{errors.message}</span>}
      </label>

      {/* honeypot: hidden from people, bots tend to fill it in */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-white/70">
        <input name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-cyan-300" />
        <span>I agree that my name and email are stored for this concept project. They are not shared.</span>
      </label>
      {errors.consent && <p className="mt-1 text-xs text-rose-300">{errors.consent}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-cyan-200 px-7 py-3 font-medium text-[#02131c] transition hover:bg-white disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Join the next descent"}
        </button>
        {errors.form && (
          <p role="alert" className="text-sm text-rose-300">
            {errors.form}
          </p>
        )}
      </div>
    </form>
  );
}
