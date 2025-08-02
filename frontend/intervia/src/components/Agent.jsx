import { useEffect, useState } from "react";
import { useCallback } from "react";
import vapi from "../vapi";
import { useNavigate } from "react-router-dom";
import { interviewer } from "../constants";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
const CallStatus = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  ENDED: "ENDED",
  CONNECTING: "CONNECTING",
};

const PhoneOnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.09 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.6 6.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PhoneOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2.05v1.59a2 2 0 0 1-2.21 1.95 15.77 15.77 0 0 1-15.19-15.2 2 2 0 0 1 1.95-2.21h1.59a2 2 0 0 1 2.05 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"
      stroke="none"
    ></path>
    <line x1="23" y1="1" x2="1" y2="23" fill="none"></line>
  </svg>
);

const VideoParticipant = ({ name, avatarUrl, isSpeaking }) => {
  const speakingClass = isSpeaking
    ? "ring-4 ring-green-400 ring-offset-4 ring-offset-gray-900/50 animate-pulse"
    : "ring-2 ring-gray-600";

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md">
      <div
        className={`relative w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-300 ${speakingClass}`}
      >
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/256x256/1a1a2e/ffffff?text=Error";
          }}
        />
      </div>
      <h3 className="mt-4 md:mt-6 text-lg md:text-xl font-medium text-white">
        {name}
      </h3>
    </div>
  );
};

const QuestionPanel = ({ question, isVisible }) => (
  <div
    className={`w-full max-w-3xl mx-auto px-4 transition-all duration-500 ${
      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-5 display-none"
    }`}
  >
    <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
      <h3 className="text-md md:text-xl lg:text-xl text-gray-100 leading-relaxed">
        {question}
      </h3>
    </div>
  </div>
);

const Agent = ({ userId, userName, type, questions, interviewId }) => {
  const [activeSpeaker, setActiveSpeaker] = useState("user");
  const [showContent, setShowContent] = useState(true);
  const { user } = useUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const latestMessage = messages[messages.length - 1]?.content || "";
  const navigate = useNavigate();
  const vapiWorkflowKey = import.meta.env.VITE_APP_VAPI_WORKFLOW_ID;
  const vapiWorkflowKeyTakeInterview = import.meta.env
    .VITE_APP_VAPI_WORKFLOW_ID_INTERVIEW;

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };
    const onCallEnd = () => {
      setCallStatus(CallStatus.ENDED);
    };
    const onMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    const onSpeechStart = () => {
      setIsSpeaking(true);
    };
    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };
    const onError = (error) => {
      console.error("Vapi Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "An error occurred during the call." },
      ]);
      setCallStatus(CallStatus.ENDED);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = useCallback(
    async (messages) => {
      console.log("Generating feedback for interview:", interviewId);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/vapi/generateFeedback`,
          {
            interviewId,
            userId,
            transcript: messages,
          }
        );

        if (response.status === 200) {
          console.log("Feedback generated successfully:", response.data);
          navigate(`/interview/feedback`);
        }
      } catch (error) {
        console.error("Error generating feedback", error);
        navigate("/");
      }
    },
    [interviewId, userId, navigate]
  );
  useEffect(() => {
    if (callStatus === CallStatus.ENDED) {
      // It's a good practice to ensure the Vapi connection is stopped
      // when the component logic considers the call to be over.
      vapi.stop();

      if (type === "generate") {
        navigate("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [
    callStatus,
    navigate,
    type,
    messages,
    interviewId,
    handleGenerateFeedback,
  ]); // Add handleGenerateFeedback to the dependency array

  const handleCall = async () => {
    if (
      callStatus === CallStatus.ACTIVE ||
      callStatus === CallStatus.CONNECTING
    ) {
      return;
    }

    setCallStatus(CallStatus.CONNECTING);
    console.log(questions);
    try {
      if (type === "generate") {
        await vapi.start(undefined, undefined, undefined, vapiWorkflowKey, {
          variableValues: {
            username: userName,
            userId: userId,
          },
        });
      } else {
        const formattedQ = questions
          .map((question, index) => `${index + 1}. ${question}`)
          .join("\n");

        await vapi.start(
          undefined,
          undefined,
          undefined,
          vapiWorkflowKeyTakeInterview,
          {
            variableValues: {
              username: userName,
              userId: userId,
              questions: formattedQ,
            },
          }
        );

        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "Failed to start the call." },
      ]);
      setCallStatus(CallStatus.ENDED);
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.ENDED);
    vapi.stop();
  };

  const isCallInactiveOrEnded =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.ENDED;

  return (
    <>
      {" "}
      <div className="w-full max-h-screen flex flex-col gap-3 justify-center items-center px-4 sm:px-6">
        <div className="w-full h-full flex flex-col items-center justify-center gap-y-6 md:gap-y-8 lg:gap-y-10">
          {/* speaking boxes */}

          <div className="w-full flex flex-row items-start justify-center gap-x-4 sm:gap-x-8 md:gap-x-16">
            <VideoParticipant
              name="AI Agent"
              avatarUrl="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
              isSpeaking={activeSpeaker === "ai"}
            />
            <VideoParticipant
              name="You"
              avatarUrl={
                user
                  ? user.imageUrl
                  : "https://www.shutterstock.com/image-vector/young-smiling-man-adam-avatar-600nw-2107967969.jpg"
              }
              isSpeaking={activeSpeaker === "user"}
            />
          </div>

          {/* transcript */}
          <QuestionPanel
            question={
              messages.length > 0 ? latestMessage : "Waiting for messages..."
            }
            isVisible={callStatus === "ACTIVE"}
          />
        </div>
        <footer className="w-full h-24 flex items-center justify-center ">
          {callStatus !== CallStatus.ACTIVE ? (
            <div
              className={`${showContent ? "animate-fade-in-up" : "opacity-0"}`}
            >
              <div className="flex items-center justify-center space-x-3 md:space-x-4 bg-black/40 backdrop-blur-xl p-3 rounded-full border border-white/10 shadow-2xl">
                <button
                  onClick={handleCall}
                  className="p-3 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 scale-110 mx-2"
                >
                  <PhoneOnIcon />
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`${showContent ? "animate-fade-in-up" : "opacity-0"}`}
            >
              <div className="flex items-center justify-center space-x-3 md:space-x-4 bg-black/40 backdrop-blur-xl p-3 rounded-full border border-white/10 shadow-2xl">
                <button
                  onClick={handleDisconnect}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 scale-110 mx-2"
                >
                  <PhoneOffIcon />
                </button>
              </div>
            </div>
          )}
        </footer>
      </div>
    </>
  );
};

export default Agent;
