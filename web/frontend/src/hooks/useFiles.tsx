import { useState, useEffect } from "react";
import { fetchApi } from "../Api";
import type { File } from "../types";

export default function useFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      
      const files = await fetchApi("/files").then((r) => r.json());

      if (cancelled) return;

      setFiles(files);

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { files, loading };
}