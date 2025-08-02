import React, { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      console.log("User:", user);
    }
  }, [isLoaded, user]);

  return (
    <header className="flex justify-between items-center py-8 text-white container mx-auto px-6 md:px-28">
      <div
        className="text-3xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Intervia.AI
      </div>

      <div className="flex items-center space-x-6">
        <SignedOut>
          <button
            className=" text-white px-4 py-2 rounded-lg font-semibold hover:text-black transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
