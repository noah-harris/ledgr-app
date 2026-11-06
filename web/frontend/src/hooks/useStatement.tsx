import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../Api";
import { queryKeys } from "../query";
import type { FileView } from "../types";

// Stable reference: pages list these results in effect dependencies.
const NO_FILES: FileView[] = [];

export default function useStatement() {
  const { data: statementUnenteredFiles = NO_FILES, isPending: loading } = useQuery({
    queryKey: queryKeys.statementUnenteredFiles,
    queryFn: () => fetchJson<FileView[]>("/statement/unentered/files"),
  });

  return { statementUnenteredFiles, loading };
}

