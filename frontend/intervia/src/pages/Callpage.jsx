import React, { useEffect, useState } from "react";
import Agent from "../components/Agent";
import { useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import IconsDisplay from "../components/IconsDisplay";

const CallPage = () => {
  const { user } = useUser();
  const location = useLocation();
  const typeOfCalling = location.state?.typeOfCalling;
  const interviewId = location.state?.interviewId;
  const [interview, setInterview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!typeOfCalling || !user || !interviewId) navigate("/");
    const fetchInterview = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/interviews/getInterview/${interviewId}`
        );
        if (!response) {
          console.error("No interview found with the given ID.");
          return;
        }
        setInterview(response.data.interview);
        console.log("Interview data:", response.data.interview);
      } catch (error) {
        console.error("Error in CallPage:", error);
      }
    };
    fetchInterview();
  }, [typeOfCalling, interviewId]);
  return (
    <>
      {typeOfCalling == "generate" && (
        <>
          <h3 className="text-white text-2xl my-3">Interview generation</h3>
          <Agent userId={user.id} userName={user.fullName} type="generate" />
        </>
      )}
      {typeOfCalling === "takeInterview" && (
        <>
          {!interview ? (
            <div className="text-white text-center mt-10">
              Loading interview details...
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center  p-6 rounded-lg mx-4 md:mx-10 my-4 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h3 className="text-white text-2xl font-semibold capitalize">
                    {interview.role} Interview
                  </h3>
                  <IconsDisplay techStack={interview.techStack} />
                </div>
                <span className="bg-amber-400 text-black px-3 py-1 rounded-xl text-base font-medium mt-3 md:mt-0 capitalize">
                  {interview?.type}
                </span>
              </div>

              <div className="mx-4 md:mx-10 mt-6">
                <Agent
                  userId={user.id}
                  userName={user.fullName}
                  type="takeInterview"
                  interviewId={interviewId}
                  questions={interview.questions}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default CallPage;
