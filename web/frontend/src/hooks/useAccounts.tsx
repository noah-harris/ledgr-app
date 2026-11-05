import { useEffect, useState } from "react";
import { fetchApi } from "../Api";
import type { AccountView } from "../types";

/** The signed-in user's accounts, sorted by account type. */
export default function useAccounts() {
  const [accounts, setAccounts] = useState<AccountView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchApi("/accounts", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then((data: AccountView[]) => {
        setAccounts([...data].sort((a, b) => a.AccountTypeName.localeCompare(b.AccountTypeName)));
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err as Error);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { accounts, loading, error };
}
