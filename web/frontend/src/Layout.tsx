import { Outlet } from "react-router";
import Header from "./components/layout/Header";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";

export default function Layout() {
  return (
    <div>
      <Header username="Noah" />
      <NavBar />

      <main>
        <Outlet />
      </main>

      <Footer />

    </div>
  )
}



