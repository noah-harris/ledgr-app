import { Outlet } from "react-router";
import Header from "./components/layout/Header";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import { useAuth } from "./context/AuthContext";

export default function Layout() {
  const { user } = useAuth();

  return (
    <>
      <Header user={user} />
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}



