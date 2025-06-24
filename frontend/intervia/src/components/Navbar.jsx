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
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      console.log("User:", user);
    }
  }, [isLoaded, user]);

  return (
    <div className="navbar px-6 py-5">
      {" "}
      {/* Adjusted px-25 to px-6 for valid Tailwind */}
      <div className="flex-1">
        <a className="btn btn-ghost text-2xl font-ubuntu text-amber-50">
          Intervia.AI
        </a>
      </div>
      <div className="flex gap-2 text-amber-50">
        <SignedOut>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
