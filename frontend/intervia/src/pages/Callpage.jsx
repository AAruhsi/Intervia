import React from "react";
import Agent from "../components/Agent";
const CallPage = () => {
  return (
    <>
      <h3>Interview generation</h3>
      <Agent userId="user1" userName="you" type="generate" />
    </>
  );
};

export default CallPage;
