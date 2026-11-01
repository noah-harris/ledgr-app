import { API_HOST } from "./config/config";

/**
 * Wrapper around fetch() for the API.
 *  - Prefixes path with API_HOST
 *  - Adds optional query params (undefined/null values are skipped)
 *  - Attaches the stored token as a Bearer header
 *  - On 401: clears the token, redirects to /login, and throws
 *
 * Returns the raw Response. The caller checks res.ok and parses the body.
 *
 * Usage:
 *   await fetchApi("/transactions", {}, { account: "checking", limit: 50 });
 *   await fetchApi("/transactions", { method: "POST", body: JSON.stringify(row),
 *                                     headers: { "Content-Type": "application/json" } });
 */
export async function fetchApi(
  path: string,
  init: RequestInit = {},
  params: Record<string, string | number | boolean | null | undefined> = {}
) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) query.set(key, String(value));
  }
  const qs = query.toString();
  const url = `${API_HOST}${path}${qs ? `?${qs}` : ""}`;

  const token = localStorage.getItem("token");
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/user/login";
    throw new Error("Unauthorized");
  }

  return res;
}