import { createContext } from "react";
import type { Users } from "../types";

export type AuthContextType = {
  /** JWT from localStorage, or null when signed out. */
  token: string | null;
  /** The signed-in user, or null while loading / signed out. */
  user: Users | null;
  /** True while the user for the current token is being fetched. */
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
