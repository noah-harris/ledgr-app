import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../Api";
import { queryKeys } from "../lib";
import type { File } from "../types";

// Stable reference: pages list these results in effect dependencies.
const NO_FILES: File[] = [];

export default function useFiles() {
  const { data: files = NO_FILES, isPending: loading } = useQuery({
    queryKey: queryKeys.files,
    queryFn: () => fetchJson<File[]>("/files"),
  });

  return { files, loading };
}
