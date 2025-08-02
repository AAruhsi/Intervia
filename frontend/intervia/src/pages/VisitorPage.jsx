import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function VisitorPage() {
  return (
    <>
      <div
        // className=" min-h-screen "
        className="relative text-center py-5 bg-cover bg-center bg-no-repeat bg-gray-900 text-white"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <Navbar />

        <Outlet />

        <Footer />
      </div>
    </>
  );
}

export default VisitorPage;
