import { Routes, Route, Outlet, Navigate } from "react-router";
import Layout from "./Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Ledgr from "./pages/Ledgr/Ledgr";
import Documents from "./pages/Document/Document";
import Settings from "./pages/Settings";
import User from "./pages/User";
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
          <Route path="/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user" element={<User />} />
        </Route>
      </Route>
    </Routes>
  );
}