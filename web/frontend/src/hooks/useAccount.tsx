import { useQuery } from "@tanstack/react-query";
import { fetchApi, fetchJson } from "../Api";
import { queryKeys } from "../lib";
import type { AccountView, StatementView } from "../types";

const NO_STATEMENTS: StatementView[] = [];

// An account with no statements yet gets an error response here. That is an
// expected state rather than a failure, so it is not thrown or retried.
async function fetchLatestStatement(idAccount: string) {
  const res = await fetchApi(`/account/statements/latest?idAccount=${idAccount}`);
  return res.ok ? (await res.json() as StatementView) : null;
}

export default function useAccount(idAccount: string) {
  const accountQuery = useQuery({
    queryKey: queryKeys.account(idAccount),
    queryFn: () => fetchJson<AccountView>(`/account?idAccount=${idAccount}`),
  });
  const latestStatementQuery = useQuery({
    queryKey: queryKeys.latestStatement(idAccount),
    queryFn: () => fetchLatestStatement(idAccount),
  });
  const statementsQuery = useQuery({
    queryKey: queryKeys.statements(idAccount),
    queryFn: () => fetchJson<StatementView[]>(`/statements?idAccount=${idAccount}`),
  });

  return {
    account: accountQuery.data,
    latestStatement: latestStatementQuery.data ?? undefined,
    statements: statementsQuery.data ?? NO_STATEMENTS,
    loading: accountQuery.isPending || latestStatementQuery.isPending,
  };
}
