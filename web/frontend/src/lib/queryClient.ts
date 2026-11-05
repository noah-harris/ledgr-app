import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TagList mounts one useDocument per grid row, so without a stale window
      // scrolling the grid would refetch on every newly rendered row.
      staleTime: 60_000,
      retry: 1,
    },
  },
});

export const queryKeys = {
  accounts: ["accounts"],
  account: (idAccount: string) => ["accounts", idAccount],
  latestStatement: (idAccount: string) => ["accounts", idAccount, "latestStatement"],
  statements: (idAccount: string) => ["accounts", idAccount, "statements"],
  documents: ["documents"],
  documentTags: ["documentTags"],
  files: ["files"],
} as const;
