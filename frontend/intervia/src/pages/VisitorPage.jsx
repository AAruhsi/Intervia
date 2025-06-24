import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function VisitorPage() {
  return (
    <>
      <div className="bg-black min-h-screen ">
        <Navbar />

        <Outlet />

        <Footer />
      </div>
    </>
  );
}

export default VisitorPage;
