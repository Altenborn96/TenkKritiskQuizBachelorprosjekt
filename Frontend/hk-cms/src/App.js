import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Main from "./pages/Main";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import AppRoutes from "./AppRoutes";
import MainNavBar from "./components/MainNavBar";
import Privacy from "./components/main-files/Privacy.tsx";
import Contact from "./components/main-files/Contact.tsx";

const Layout = () => {
  const location = useLocation();  // Now we can use useLocation inside a Router component

  // Public routes where we want MainNavBar
  const isPublicRoute = [
    "/",
    "/login",
    "/privacy",
    "/contact"
  ].includes(location.pathname);

  return (
    <>
      {/* Render MainNavBar only for public routes */}
      {isPublicRoute && <MainNavBar />}
      
      {/* Render NavBar for protected routes */}
      {!isPublicRoute && <NavBar />}

      {/* The actual route content */}
      <Routes>
        {/* Public routes with MainNavBar */}
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected routes with NavBar */}
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <Layout /> {/* Layout will conditionally render NavBar or MainNavBar */}
  </Router>
);

export default App;
