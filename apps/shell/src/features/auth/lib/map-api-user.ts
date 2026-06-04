import type { User } from "@repo/mfe-shared";
import type { MeResponse } from "./api-types";

export const mapApiUserToMfeUser = (apiUser: MeResponse): User => ({
  id: String(apiUser.id),
  email: apiUser.email,
  name: apiUser.name?.trim() || apiUser.email.split("@")[0] || "User",
});
