import { useQuery } from "@tanstack/react-query";
import { fetchApi, fetchJson } from "../Api";
import type { AccountView, StatementSummaryView, StatementView } from "../types";
import { queryKeys } from "../query";

const NO_STATEMENTS: StatementSummaryView[] = [];

export default function useAccount(idAccount: string) {

  const accountQuery = useQuery({
    queryKey: queryKeys.account(idAccount),
    queryFn: () => fetchJson<AccountView>(`/account?idAccount=${idAccount}`),
  });

  const latestStatementQuery = useQuery({
    queryKey: queryKeys.latestStatement(idAccount),
    queryFn: () => {
      return fetchApi(`/account/statements/latest?idAccount=${idAccount}`).then(res => res.ok ? res.json() as Promise<StatementView> : null)
    },
  });

  const statementsQuery = useQuery({
    queryKey: queryKeys.statements(idAccount),
    queryFn: () => fetchJson<StatementSummaryView[]>(`/statements?idAccount=${idAccount}`),
  });

  return {
    account: accountQuery.data,
    latestStatement: latestStatementQuery.data ?? undefined,
    statements: statementsQuery.data ?? NO_STATEMENTS,
    loading: accountQuery.isPending || latestStatementQuery.isPending || statementsQuery.isPending,
  };
}
