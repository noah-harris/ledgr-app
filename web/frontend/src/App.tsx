import { Routes, Route, Outlet, Navigate } from "react-router";
import JunkFilePage from "./pages/File/JunkFilePage";
import AccountPage from "./pages/Account/AccountPage";
import { useAuth } from "./auth";
import ManageDocumentTagPage from "./pages/Document/ManageDocumentTagsPage";
import Dev from "./pages/Dev/Dev";
import Layout from "./Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ManageDocumentsPage from "./pages/Document/ManageDocumentsPage";
import Settings from "./pages/Settings";
import User from "./pages/User";
import File from "./pages/File/File";
import NotFound from "./pages/NotFound";
import DocumentsSearchPage from "./pages/Document/DocumentSearchPage";
import AccountDetailPage from "./pages/Account/AccountDetailPage";

function RequireAuth() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/user/login" replace />;
}
// Add a route for page not found. Basically a catch-all route that redirects to the home page or a 404 page.
export default function App() {

  return (
    <Routes>
      <Route path="/user/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/accounts" element={<AccountPage />} />
          <Route path="/accounts/:idAccount" element={<AccountDetailPage />} />
          <Route path="/documents/manage" element={<ManageDocumentsPage />} />
          <Route path="/documents/search" element={<DocumentsSearchPage />} />
          <Route path="/document/tags/manage" element={<ManageDocumentTagPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user" element={<User />} />
          <Route path="/files" element={<File />} />
          <Route path="/file/junk" element={<JunkFilePage />} />
          <Route path="/dev" element={<Dev />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}