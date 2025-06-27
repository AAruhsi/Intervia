import { useEffect, useState } from "react";
import vapi from "../vapi";
import { useNavigate } from "react-router-dom";

const CallStatus = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  ENDED: "ENDED",
  CONNECTING: "CONNECTING",
};

const Agent = ({ userId, userName, type }) => {
  const [isSpeaking, setisSpeaking] = useState(false);
  const [callStatus, setcallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const latestMessage = messages[messages.length - 1]?.content || "";
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_APP_VAPI_PUBLIC_API_KEY;
  const vapiWorkflowKey = import.meta.env.VITE_APP_VAPI_WORKFLOW_ID;

  // console.log("Vapi instance created:", vapi, vapiWorkflowKey);
  useEffect(() => {
    const onCallStart = () => {
      setcallStatus(CallStatus.ACTIVE);
    };
    const onCallEnd = () => {
      setcallStatus(CallStatus.ENDED);
    };
    const onMessage = (messages) => {
      if (
        messages.type === "transcript" &&
        messages.transcriptType === "final"
      ) {
        const newMessage = {
          role: messages.role,
          content: messages.transcript,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    const onSpeechStart = () => {
      setisSpeaking(true);
    };
    const onSpeechEnd = () => {
      setisSpeaking(false);
    };
    const onError = (error) => {
      console.error("Error:", error);
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

  useEffect(() => {
    if (callStatus === CallStatus.ENDED) navigate("/");
  }, [callStatus, navigate]);

  const handleCall = async () => {
    if (
      callStatus === CallStatus.ACTIVE ||
      callStatus === CallStatus.CONNECTING
    )
      return;

    setcallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(undefined, undefined, undefined, vapiWorkflowKey, {
        variableValues: {
          username: userName,
          userId: userId,
        },
      });
    }
    // else {
    //   let formattedQuestions = "";
    //   if (questions) {
    //     formattedQuestions = questions
    //       .map((question) => `- ${question}`)
    //       .join("\n");
    //   }

    //   await vapi.start(interviewer, {
    //     variableValues: {
    //       questions: formattedQuestions,
    //     },
    //   });
    // }
  };

  const handleDisconnect = async () => {
    setcallStatus(CallStatus.ENDED);
    vapi.stop();
  };

  const isCallInactiveOrEnded =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.ENDED;

  return (
    <div className="w-full max-h-screen flex flex-col gap-7 justify-center items-center">
      {/* speaking boxes */}
      <div className="middlePage w-[80vw] h-[60vh] flex justify-center items-center gap-10">
        <div className="aiAgent w-full h-full flex flex-col justify-center items-center gap-4 border-5 border-purple-500 rounded-2xl relative">
          <img
            src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
            alt="vapi"
            className="w-[16vw] h-fit rounded-full object-cover z-10"
          />
          {isSpeaking && (
            <div className="absolute top-52 w-[10vw] h-[10vw] bg-yellow-500 rounded-full animate-ping z-0"></div>
          )}
          <h1 className="text-white font-openSans text-2xl">Ai Agent</h1>
        </div>

        <div className="aiAgent w-full h-full flex flex-col justify-center items-center gap-4 border-5 border-gray-500 rounded-2xl">
          <img
            src="https://www.shutterstock.com/image-vector/young-smiling-man-adam-avatar-600nw-2107967969.jpg"
            alt="user"
            className="w-[16vw] h-fit rounded-full object-cover"
          />
          <h1 className="text-white font-openSans text-2xl">User</h1>
        </div>
      </div>

      {/* transcript */}
      <div className="transcript w-[80vw] px-10 py-3 text-center flex justify-center items-center text-white shadow-[inset_-12px_-8px_40px_#46464620] rounded-3xl">
        {messages.length > 0 && <p className="">{latestMessage}</p>}
      </div>

      {/* call end/start button */}
      <div>
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={handleCall}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
          >
            <span>{isCallInactiveOrEnded ? "Call" : "..."}</span>
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition"
          >
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
