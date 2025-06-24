import React from "react";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="flex justify-center items-center pt-10">
      <SignIn />
    </div>
  );
};

export default Login;
