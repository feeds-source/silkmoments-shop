export const ADMIN_EMAILS = ["kscfeeds@gmail.com", "info@silkmoments.com"] as const;

const ADMIN_SET = new Set(ADMIN_EMAILS.map((e) => e.toLowerCase()));

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_SET.has(email.trim().toLowerCase());
}
