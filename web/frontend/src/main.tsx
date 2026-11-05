import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import App from "./App.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { queryClient } from "./lib";

const theme = createTheme({
  typography: {
    fontFamily: 'Console, monospace',
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>

)
