import React from "react";
import Agent from "../components/Agent";
import { useUser } from "@clerk/clerk-react";

const CallPage = () => {
  const { user } = useUser();
  console.log("User in CallPage:", user);
  return (
    <>
      <h3 className="text-white text-2xl my-3">Interview generation</h3>
      <Agent userId={user.id} userName={user.fullName} type="generate" />
    </>
  );
};

export default CallPage;
