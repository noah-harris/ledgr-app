import { QueryClient } from "@tanstack/react-query";

export const queryClient: QueryClient = new QueryClient();

export const queryKeys = {
  accounts: ["accounts"],
  account: (idAccount: string) => ["accounts", idAccount],
  latestStatement: (idAccount: string) => ["accounts", idAccount, "latestStatement"],
  statements: (idAccount: string) => ["accounts", idAccount, "statements"],
  documents: ["documents"],
  documentTags: ["documentTags"],
  files: ["files"],
  statementUnenteredFiles: ["statement", "unentered", "files"],
  statementGaps: (idAccount: string) => ["accounts", idAccount, "statementGaps"],
} as const;
