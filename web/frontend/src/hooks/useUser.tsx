import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../Api";
import { queryKeys } from "../query";
import type { AccountView } from "../types";
import { useAuth } from "../auth/AuthContext";

// Stable reference: pages list these results in effect dependencies.
const NO_ACCOUNTS: AccountView[] = [];

export default function useUser() {
  const { user, loading: userLoading } = useAuth();
  const { data: accounts = NO_ACCOUNTS, isPending: loading } = useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => fetchJson<AccountView[]>("/accounts").then((accs) => accs.sort((a, b) => a.AccountTypeName.localeCompare(b.AccountTypeName))),
  });

  return { user, accounts, loading: loading || userLoading };
}
