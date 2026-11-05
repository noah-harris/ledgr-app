import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { API_HOST } from "../config/config";
import { fetchApi, UNAUTHORIZED_EVENT } from "../Api";
import type { Users } from "../types";
import { AuthContext } from "./AuthContext";

const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  // The user is stored together with the token it was fetched for, so a user
  // belonging to an old token is never shown and "loading" can be derived
  // instead of being toggled from inside the effect.
  const [session, setSession] = useState<{ token: string; user: Users } | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setSession(null);
  }, []);

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
    localStorage.setItem(TOKEN_KEY, access_token);
    setToken(access_token);
  }, []);

  // Load the user once per token. Aborted if the token changes mid-request
  // (or on StrictMode's double-mount) so a stale response can't win.
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();

    fetchApi("/user", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then((user: Users) => setSession({ token, user }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load user", err);
        logout();
      });

    return () => controller.abort();
  }, [token, logout]);

  // fetchApi announces 401s; sign out in-app instead of a hard page reload.
  // Also keep tabs in sync when another tab logs in or out.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) setToken(e.newValue);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, logout);
      window.removeEventListener("storage", onStorage);
    };
  }, [logout]);

  const user = session && session.token === token ? session.user : null;
  const loading = token !== null && user === null;

  // Memoised so consumers only re-render when auth state actually changes.
  const value = useMemo(
    () => ({ token, user, loading, login, logout }),
    [token, user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
