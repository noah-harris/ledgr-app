import { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { apiFetch } from "../../lib/apiFetch";
import ParameterBox from "./ParameterBox";
import type { Param } from "./ParameterBox";
import type { Route } from "../../types/Route";




export default function Dev() {
  const [route, setRoute] = useState<Route | null>(null);
  const [method, setMethod] = useState("");
  const [content, setContent] = useState<any>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [headers, setHeaders] = useState<Param[]>([]);
  const [urlParams, setUrlParams] = useState<Param[]>([]);
  const [body, setBody] = useState<Param[]>([]);

  useEffect(() => {
    apiFetch("/routes")
      .then((res) => res.json())
      .then(setRoutes)
      .catch(console.error);
  }, []);

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

    try {
      const res = await apiFetch(url, {
        method,
        headers: {
          ...(hasBody && { "Content-Type": "application/json" }),
          ...toObject(headers),
        },
        body: hasBody ? JSON.stringify(toObject(body)) : undefined,
      });

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
      
    </Box>
  );
}