import { randomUUID } from "node:crypto";
import { database } from "./db.js";
import { hashPassword } from "./password.js";

export const findUserByAuthId = async (authUserId: string) =>
  database.user.findUnique({ where: { authUserId } });

export const findUserByEmail = async (email: string) =>
  database.user.findUnique({ where: { email: email.toLowerCase() } });

export const findUserById = async (id: number) =>
  database.user.findUnique({ where: { id } });

export const createUserWithPassword = async (input: {
  email: string;
  password: string;
  name?: string | null;
}) => {
  const email = input.email.toLowerCase().trim();
  const passwordHash = await hashPassword(input.password);

  return database.user.create({
    data: {
      authUserId: `local:${randomUUID()}`,
      email,
      name: input.name?.trim() || null,
      passwordHash,
      role: "user",
    },
  });
};

export const ensureUserProfile = async (input: {
  authUserId: string;
  email: string;
  name?: string | null;
}) => {
  const existing = await findUserByAuthId(input.authUserId);
  if (existing) {
    if (input.name !== undefined && input.name !== existing.name) {
      return database.user.update({
        where: { id: existing.id },
        data: { name: input.name },
      });
    }
    return existing;
  }

  return database.user.create({
    data: {
      authUserId: input.authUserId,
      email: input.email,
      name: input.name ?? null,
      role: "user",
    },
  });
};

export const toUserResponse = (user: {
  id: number;
  authUserId: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: user.id,
  authUserId: user.authUserId,
  email: user.email,
  name: user.name,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
