// Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Layout = ({ isLoggedIn, onLogout }) => (
  <>
    <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
    <Outlet />
    <Footer />
  </>
);

export default Layout;
