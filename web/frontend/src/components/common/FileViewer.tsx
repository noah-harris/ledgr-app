// FileViewer.tsx
import { useEffect, useState } from "react";
import { fetchApi } from "../../Api";

export default function FileViewer({ path }: { path: string}) {
  const [src, setSrc] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;
    let objUrl: string | undefined;

    fetchApi(path)
      .then(r => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.blob();
      })
      .then(b => {
        if (cancelled) return;
        objUrl = URL.createObjectURL(b);
        setSrc(objUrl);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [path]);

  return src && <iframe src={src} style={{ width: "100%", height: "80vh", border: 0, display: "block" }}  />;
}