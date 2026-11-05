import { useState, useEffect } from "react";
import { fetchApi } from "../Api";
import type { AccountView } from "../types";
import { useAuth } from "../auth/AuthContext";
 
export default function useUser() {
  const { user, loading: userLoading } = useAuth();
  const [accounts, setAccounts] = useState<AccountView[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let cancelled = false;
 
    async function load() {
      setLoading(true);
      const accounts = await fetchApi("/accounts").then((r) => r.json()) as AccountView[];
      accounts.sort((a, b) => a.AccountTypeName.localeCompare(b.AccountTypeName))
      if (cancelled) return;
      setAccounts(accounts);
      setLoading(false);
    }
 
    load();
    return () => { cancelled = true; };
  }, []);
 
  return { user, accounts, loading: loading || userLoading };
}