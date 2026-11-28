export const ROLES = ["student", "diver", "educator", "researcher", "curious"] as const;
export type Role = (typeof ROLES)[number];

export type JoinInput = {
  name: string;
  email: string;
  role: Role;
  message: string;
};

export type JoinResult =
  | { ok: true; honeypot: false; data: JoinInput }
  | { ok: true; honeypot: true }
  | { ok: false; errors: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function validateJoin(body: unknown): JoinResult {
  if (typeof body !== "object" || body === null) return { ok: false, errors: { form: "Invalid request." } };
  const b = body as Record<string, unknown>;

  // hidden field that real visitors never fill in
  if (text(b.company) !== "") return { ok: true, honeypot: true };

  const errors: Record<string, string> = {};
  const name = text(b.name);
  const email = text(b.email).toLowerCase();
  const role = text(b.role);
  const message = text(b.message);

  if (name.length < 2 || name.length > 80) errors.name = "Please enter your name (2 to 80 characters).";
  if (email.length > 254 || !EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (!(ROLES as readonly string[]).includes(role)) errors.role = "Please choose one option.";
  if (message.length > 1000) errors.message = "Please keep the message under 1000 characters.";
  if (b.consent !== true) errors.consent = "Please tick the box to continue.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, honeypot: false, data: { name, email, role: role as Role, message } };
}
