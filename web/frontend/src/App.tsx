import { Routes, Route, Outlet, Navigate } from "react-router";
import Dev from "./pages/Dev/Dev";
import Layout from "./Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Ledgr from "./pages/Ledgr/Ledgr";
import DocumentPage from "./pages/Document/DocumentPage";
import Settings from "./pages/Settings";
import User from "./pages/User";
import File from "./pages/File/File";
import { useAuth } from "./hooks/useAuth";

function RequireAuth() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ledgr" element={<Ledgr />} />
          <Route path="/documents" element={<DocumentPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user" element={<User />} />
          <Route path="/files" element={<File />} />
          <Route path="/dev" element={<Dev />} />
        </Route>
      </Route>
    </Routes>
  );
}