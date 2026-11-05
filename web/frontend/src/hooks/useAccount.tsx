import { useState, useEffect } from "react";
import { fetchApi } from "../Api";
import type { AccountView, StatementView } from "../types";

export default function useAccount(idAccount: string) {
  const [account, setAccount] = useState<AccountView>();
  const [latestStatement, setLatestStatement] = useState<StatementView>();
  const [statements, setStatements] = useState<StatementView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      
      const account = await fetchApi(`/account?idAccount=${idAccount}`).then((r) => r.json());
      const latestStatement = await fetchApi(`/account/statements/latest?idAccount=${idAccount}`).then((r) => r.json());
      const statements = await fetchApi(`/statements?idAccount=${idAccount}`).then((r) => r.json());

      if (cancelled) return;

      setAccount(account);
      setLatestStatement(latestStatement);
      setStatements(statements);

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [idAccount]);



  

  return { account, latestStatement, statements, loading };
}