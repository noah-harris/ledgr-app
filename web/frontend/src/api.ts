import { API_HOST } from "./config/config";

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_HOST}${path}`, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return res;
}