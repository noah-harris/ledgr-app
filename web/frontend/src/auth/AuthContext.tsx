import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
 
import { useQueryClient } from "@tanstack/react-query";
import { API_HOST } from "../config/config";
import type { Users } from "../types";
 
type AuthContextType = {
  token: string | null;
  user: Users | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};
 
export const AuthContext = createContext<AuthContextType | null>(null);
 
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  // Stored with the token it was fetched for, so a user from an old token is
  // never shown and `loading` can be derived instead of set inside the effect.
  const [session, setSession] = useState<{ token: string; user: Users } | null>(null);
 
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setSession(null);
    queryClient.clear(); // Cached data belongs to the user who just left.
  }, [queryClient]);
 
  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_HOST}/user/login`, {
      method: "POST",
      body: new URLSearchParams({ username, password }),
    });
 
    if (!res.ok) {
      const { detail } = await res.json();
      throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
 
    const { access_token } = await res.json();
    localStorage.setItem("token", access_token);
    setToken(access_token);
    queryClient.clear(); // /user/login is reachable while signed in, without a logout.
  }, [queryClient]);
 
  // Load the user once per token. Aborted if the token changes mid-request
  // (or on StrictMode's double mount) so a stale response can't win.
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
 
    fetch(`${API_HOST}/user`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then((user: Users) => setSession({ token, user })) // /user returns the user itself, not { data }
      .catch(() => {
        if (!controller.signal.aborted) logout();
      });
 
    return () => controller.abort();
  }, [token, logout]);
 
  const user = session && session.token === token ? session.user : null;
  const loading = token !== null && user === null;
 
  // Memoised so consumers only re-render when auth state actually changes.
  const value = useMemo(
    () => ({ token, user, loading, login, logout }),
    [token, user, loading, login, logout]
  );
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
 
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
 