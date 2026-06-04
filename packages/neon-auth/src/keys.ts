import { z } from "zod";

const serverSchema = z.object({
  NEON_AUTH_BASE_URL: z.url().optional(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32).optional(),
  DEV_AUTH_USER_ID: z.string().min(1).optional(),
  DEV_AUTH_EMAIL: z.email().optional(),
});

const clientSchema = z.object({
  VITE_NEON_AUTH_URL: z.url().optional(),
});

export type NeonAuthServerKeys = z.infer<typeof serverSchema>;
export type NeonAuthClientKeys = z.infer<typeof clientSchema>;

export const neonAuthServerKeys = (): NeonAuthServerKeys & {
  isDevAuth: boolean;
  isConfigured: boolean;
} => {
  const skip = process.env.SKIP_ENV_VALIDATION === "true";
  const parsed = serverSchema.safeParse(process.env);

  if (!parsed.success && !skip) {
    throw new Error(
      `Invalid Neon Auth server env: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`
    );
  }

  const data = parsed.success
    ? parsed.data
    : {
        NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL,
        NEON_AUTH_COOKIE_SECRET: process.env.NEON_AUTH_COOKIE_SECRET,
        DEV_AUTH_USER_ID: process.env.DEV_AUTH_USER_ID,
        DEV_AUTH_EMAIL: process.env.DEV_AUTH_EMAIL,
      };

  const isConfigured = Boolean(
    data.NEON_AUTH_BASE_URL && data.NEON_AUTH_COOKIE_SECRET
  );
  const isDevAuth =
    !isConfigured &&
    Boolean(data.DEV_AUTH_USER_ID && data.DEV_AUTH_EMAIL);

  if (!isConfigured && !isDevAuth && !skip) {
    throw new Error(
      "Neon Auth is not configured. Set NEON_AUTH_BASE_URL + NEON_AUTH_COOKIE_SECRET, or DEV_AUTH_USER_ID + DEV_AUTH_EMAIL for local API dev, or SKIP_ENV_VALIDATION=true."
    );
  }

  return { ...data, isDevAuth, isConfigured };
};

export const neonAuthClientKeys = (): NeonAuthClientKeys => {
  const parsed = clientSchema.safeParse({
    VITE_NEON_AUTH_URL: process.env.VITE_NEON_AUTH_URL,
  });

  if (!parsed.success) {
    throw new Error("Invalid Neon Auth client env: VITE_NEON_AUTH_URL");
  }

  return parsed.data;
};
