import React, { useEffect, useState } from "react";
import Agent from "../components/Agent";
import { useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import IconsDisplay from "../components/IconsDisplay";
import Vapi from "@vapi-ai/web";
import Navbar from "../components/Navbar";

const CallPage = () => {
  const { user } = useUser();
  const location = useLocation();
  const typeOfCalling = location.state?.typeOfCalling;
  const interviewId = location.state?.interviewId;
  const [interview, setInterview] = useState(null);
  const [showContent, setShowContent] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!typeOfCalling) navigate("/");
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
    if (typeOfCalling == "takeInterview") {
      fetchInterview();
    }
  }, [typeOfCalling, interviewId]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);
  return (
    // <div className="bg-gray-900 min-h-screen">
    <div className="font-sans text-white min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gray-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out forwards; }
        .animate-fade-out { animation: fadeOut 0.3s ease-in-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <Navbar />
      <main
        className={`flex-grow w-full flex flex-col items-center justify-center transition-opacity duration-300 ${
          showContent ? "animate-fade-in" : "opacity-0"
        }`}
      >
        {typeOfCalling == "generate" && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-y-3 md:gap-y-8 lg:gap-y-10">
            <h3 className="text-white text-2xl my-2">Interview generation</h3>
            <div className="w-full flex flex-row items-start justify-center gap-x-4 sm:gap-x-8 md:gap-x-16">
              <Agent
                userId={user.id}
                userName={user.fullName}
                type="generate"
              />
            </div>
          </div>
        )}
        {typeOfCalling === "takeInterview" && (
          <>
            {!interview ? (
              <div className="text-white text-center mt-10 container mx-auto px-6 md:px-28">
                Loading interview details...
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center  rounded-lg   my-4 container mx-auto px-6 md:px-28 ">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <h3 className="text-white text-2xl font-semibold capitalize">
                      {interview.role} Interview
                    </h3>
                    <IconsDisplay techStack={interview.techStack} />
                  </div>
                  <span className="bg-cyan-400 text-white px-3 py-1 rounded-md text-base font-medium mt-3 md:mt-0 capitalize">
                    {interview?.type}
                  </span>
                </div>

                <div className=" container mx-auto px-6 md:px-28 mt-10">
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
      </main>
    </div>
  );
};

export default CallPage;
