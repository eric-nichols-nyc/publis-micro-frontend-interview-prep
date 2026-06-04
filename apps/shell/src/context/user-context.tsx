import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@repo/mfe-shared";

const UserContext = createContext<User | null>(null);

type Props = {
  user: User;
  children: ReactNode;
};

export function UserProvider({ user, children }: Props) {
  return (
    <UserContext.Provider value={user}>{children}</UserContext.Provider>
  );
}

export function useUser(): User {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within UserProvider");
  }
  return user;
}
