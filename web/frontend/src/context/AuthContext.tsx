import { createContext, useContext, useState, type ReactNode } from "react";
import { API_HOST } from "../config/config";

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  async function login(username: string, password: string) {
    const res = await fetch(`${API_HOST}/login`, {
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
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}