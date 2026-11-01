import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { API_HOST } from "../config/config";
import type { Users } from "../types";

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  users: Users | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [users, setUsers] = useState<Users | null>(null);

  useEffect(() => {
    if (!token) {
      setUsers(null);
      return;
    }

    fetch(`${API_HOST}/user`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(json => json["data"])
      .then(setUsers)
      .catch(logout);
  }, [token]);

  async function login(username: string, password: string) {
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
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUsers(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, users }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}    