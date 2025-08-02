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
                  {/* <InterviewRunner Id={interviewId} /> */}
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

// export const InterviewRunner = ({ Id }) => {
//   const [status, setStatus] = useState("Initializing...");
//   const [vapi, setVapi] = useState(null);

//   useEffect(() => {
//     const runInterview = async () => {
//       try {
//         setStatus("Fetching config...");
//         const response = await axios.get(
//           `${import.meta.env.VITE_API}/interviews/config/${Id}`
//         );
//         const config = response.data; // ✅ Corrected here

//         setStatus("Starting interview...");

//         const vapiClient = new Vapi({
//           apiKey: import.meta.env.VITE_APP_VAPI_PUBLIC_API_KEY,
//         });

//         setVapi(vapiClient);

//         await vapiClient.start(config);

//         vapiClient.on("conversation.started", () =>
//           setStatus("Interview in progress...")
//         );
//         vapiClient.on("conversation.ended", () =>
//           setStatus("Interview finished.")
//         );
//       } catch (error) {
//         console.error("Interview setup failed:", error);
//         setStatus("Error starting interview.");
//       }
//     };

//     runInterview();
//   }, [Id]);

//   return (
//     <div className="bg-amber-200 w-1/2 h-1/2">
//       <h3>Voice Interview</h3>
//       <p>Status: {status}</p>
//       <button onClick={() => vapi?.stopConversation()}>End Interview</button>
//     </div>
//   );
// };

// import React, { useState } from "react";

// // --- SVG Icons ---
// const MicOnIcon = () => (
//   <svg
//     className="w-6 h-6"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//     ></path>
//   </svg>
// );

// const MicOffIcon = () => (
//   <svg
//     className="w-6 h-6"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       d="M15.586 15.586a7 7 0 01-8.172-8.172l-1.414-1.414A9 9 0 0018 18l-1.414-1.414zM9 9a3 3 0 013-3v3h-3zM5 5a9 9 0 0014 9"
//     ></path>
//   </svg>
// );

// const EndCallIcon = () => (
//   <svg
//     className="w-6 h-6"
//     fill="currentColor"
//     viewBox="0 0 20 20"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M17.707 3.293a1 1 0 00-1.414 0L10 9.586 3.707 3.293a1 1 0 00-1.414 1.414L8.586 11l-6.293 6.293a1 1 0 101.414 1.414L10 12.414l6.293 6.293a1 1 0 001.414-1.414L11.414 11l6.293-6.293a1 1 0 000-1.414z"></path>
//   </svg>
// );

// // --- Main Component ---
// const CallPage = () => {
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [activeSpeaker, setActiveSpeaker] = useState("AI"); // Can be 'user' or 'AI'

//   // Placeholder for the conversation transcript
//   const transcript = [
//     {
//       speaker: "AI",
//       text: "Good morning. Welcome to your technical interview for the Software Engineer role. Are you ready to begin?",
//     },
//   ];

//   const InfoTag = ({ children }) => (
//     <div className="bg-black/20 text-blue-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border border-blue-500/30 backdrop-blur-sm">
//       {children}
//     </div>
//   );

//   return (
//     <div className="font-sans bg-gray-900 text-white h-screen w-screen flex flex-col overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute top-0 left-0 w-full h-full bg-black">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/50 rounded-full blur-3xl animate-pulse"></div>
//       </div>

//       {/* Header */}
//       <header className="relative w-full p-4 sm:p-6 flex justify-between items-center z-10">
//         <h1 className="text-xl sm:text-2xl font-bold tracking-wider">
//           Intervia.Ai
//         </h1>
//         <div className="flex items-center space-x-2 sm:space-x-4">
//           <InfoTag>Type: Technical</InfoTag>
//           <InfoTag>Languages: Python, Java</InfoTag>
//         </div>
//       </header>

//       {/* Main Content Area */}
//       <main className="relative flex-1 w-full p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6">
//         {/* User's Video Feed */}
//         <div
//           className={`relative flex-1 aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ${
//             activeSpeaker === "user"
//               ? "ring-4 ring-blue-500 ring-offset-4 ring-offset-gray-900"
//               : ""
//           }`}
//         >
//           <img
//             src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80"
//             className="w-full h-full object-cover"
//             alt="User Avatar"
//           />
//           <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
//             You
//           </div>
//         </div>

//         {/* AI's Avatar Feed */}
//         <div
//           className={`relative flex-1 aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ${
//             activeSpeaker === "AI"
//               ? "ring-4 ring-blue-500 ring-offset-4 ring-offset-gray-900"
//               : ""
//           }`}
//         >
//           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-black">
//             <div className="w-24 h-24 sm:w-32 sm:h-32 text-blue-400 animate-pulse">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 3v1.5m0 16.5V21m3.75-18v1.5M19.5 8.25h-1.5m-15 3.75h1.5m15 0h-1.5m-15 3.75h1.5m15 0h-1.5"
//                 />
//               </svg>
//             </div>
//           </div>
//           <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
//             AI Interviewer
//           </div>
//         </div>
//       </main>

//       {/* Subtitles and Controls */}
//       <footer className="relative w-full p-4 sm:p-6 z-10 flex flex-col items-center gap-4">
//         {/* Transcript/Subtitle Box */}
//         <div className="w-full max-w-4xl h-28 bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
//           <div className="h-full overflow-y-auto text-gray-300 text-sm sm:text-base pr-2">
//             {transcript.map((line, index) => (
//               <p key={index}>
//                 <span
//                   className={`font-bold ${
//                     line.speaker === "AI" ? "text-blue-400" : "text-green-400"
//                   }`}
//                 >
//                   {line.speaker}:{" "}
//                 </span>
//                 {line.text}
//               </p>
//             ))}
//           </div>
//         </div>

//         {/* Control Buttons */}
//         <div className="flex items-center space-x-3 sm:space-x-4">
//           <button className="px-6 py-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
//             End Call
//           </button>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default CallPage;
