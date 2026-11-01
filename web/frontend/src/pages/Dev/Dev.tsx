import { useState, useEffect } from "react";
import { Typography, TextField, Box, Autocomplete, Button } from "@mui/material";
import { fetchApi } from "../../Api";
import ParameterBox from "./ParameterBox";
import type { Param } from "./ParameterBox";
import type { Route } from "../../types/Route";


export default function Dev() {
  const [route, setRoute] = useState<Route | null>(null);
  const [method, setMethod] = useState("");
  const [content, setContent] = useState<any>(null);
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [headers, setHeaders] = useState<Param[]>([]);
  const [urlParams, setUrlParams] = useState<Param[]>([]);
  const [body, setBody] = useState<Param[]>([]);

  useEffect(() => {
    fetchApi("/routes")
      .then((res) => res.json())
      .then(setRoutes)
      .catch(console.error);
  }, []);

  // Free the previous file's memory whenever fileSrc changes or the page unmounts
  useEffect(() => {
    return () => { if (fileSrc) URL.revokeObjectURL(fileSrc); };
  }, [fileSrc]);

  function handleRouteChange(newRoute: Route | null) {
    setRoute(newRoute);
    setMethod(newRoute?.methods[0] ?? "");
  }

  async function handleSend() {
    if (!route) return;

    // Skip rows with blank keys
    const toObject = (list: Param[]) =>
      Object.fromEntries(list.filter((p) => p.key).map((p) => [p.key, p.value]));

    const query = new URLSearchParams(toObject(urlParams)).toString();
    const url = query ? `${route.path}?${query}` : route.path;

    const hasBody = method !== "GET" && method !== "HEAD" && body.some((p) => p.key);

    setFileSrc(null);

    try {
      const res = await fetchApi(url, {
        method,
        headers: {
          ...(hasBody && { "Content-Type": "application/json" }),
          ...toObject(headers),
        },
        body: hasBody ? JSON.stringify(toObject(body)) : undefined,
      });

      const type = res.headers.get("content-type") ?? "";

      // Files (pdf, images, etc.) go to the iframe
      if (!type.includes("json") && !type.startsWith("text/")) {
        setFileSrc(URL.createObjectURL(await res.blob()));
        setContent({ status: res.status, contentType: type });
        return;
      }

      // Not every response is JSON, so read text first and parse if possible
      const text = await res.text();
      try {
        setContent({ status: res.status, data: JSON.parse(text) });
      } catch {
        setContent({ status: res.status, data: text });
      }
    } catch (err) {
      setContent({ error: String(err) });
    }
  }

  return (
    <Box>
      <Typography variant="h4">Dev Page</Typography>

      <Box>
        <Autocomplete
            value={route?.path ?? ""}
            onChange={(_e, newValue) => handleRouteChange(routes.find(r => r.path === newValue) ?? null)}
            options={routes.map(route => route.path)}
            renderInput={(params) => <TextField {...params} label="Routes" />}
        />

        <Autocomplete
            value={method}
            onChange={(_e, newValue) => setMethod(newValue ?? "")}
            options={route?.methods ?? []}
            renderInput={(params) => <TextField {...params} label="Methods" />}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <ParameterBox title="Headers" params={headers} setParams={setHeaders} />
        <ParameterBox title="Url Params" params={urlParams} setParams={setUrlParams} />
        <ParameterBox title="Body" params={body} setParams={setBody} />
      </Box>

      <Button variant="contained" onClick={handleSend} disabled={!route || !method}>
        Send Request
      </Button>

      <TextField
        label="Output"
        multiline
        fullWidth
        value={content ? JSON.stringify(content, null, 2) : ""}
        slotProps={{ input: { readOnly: true, sx: { fontFamily: "monospace" } } }}
      />

      {fileSrc && (
        <iframe src={fileSrc} style={{ width: "100%", height: "80vh", border: 0 }} />
      )}
    </Box>
  );
}
