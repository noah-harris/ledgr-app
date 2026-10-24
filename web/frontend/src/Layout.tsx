import { Outlet } from "react-router";
import Header from "./components/layout/Header";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import { useAuth } from "./context/AuthContext";

export default function Layout() {
  const { users } = useAuth();

  return (
    <>
      <Header users={users} />
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}



