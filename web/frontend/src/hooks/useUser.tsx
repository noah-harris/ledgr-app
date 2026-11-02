import { useState, useEffect } from "react";
import { fetchApi } from "../Api";
import type { AccountView, Users } from "../types";

export default function useUser() {
  const [user, setUser] = useState<Users | null>(null);
  const [accounts, setAccounts] = useState<AccountView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      
      const user = await fetchApi("/user").then((r) => r.json()) as Users;
      const accounts = await fetchApi("/accounts").then((r) => r.json()) as AccountView[];

      accounts.sort((a, b) => a.AccountTypeName.localeCompare(b.AccountTypeName))

      if (cancelled) return;

      setUser(user);
      setAccounts(accounts);

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { user, accounts, loading };
}