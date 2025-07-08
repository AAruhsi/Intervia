import { useEffect, useState } from "react";
import vapi from "../vapi";
import { useNavigate } from "react-router-dom";
import { interviewer } from "../constants";

const CallStatus = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  ENDED: "ENDED",
  CONNECTING: "CONNECTING",
};

const Agent = ({ userId, userName, type, questions, interviewId }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const latestMessage = messages[messages.length - 1]?.content || "";
  const navigate = useNavigate();
  const vapiWorkflowKey = import.meta.env.VITE_APP_VAPI_WORKFLOW_ID;

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

  const handleGenerateFeedback = async (messages) => {
    console.log("Generating feedback for interview:", interviewId);
    // Implement your feedback logic here, e.g., send messages to your backend
    const { success, id } = { success: true, id: interviewId }; // Mock response, replace with actual API call
    if (success && id) {
      console.log("Feedback generated successfully:", messages);
      navigate(`/interview/feedback`);
    } else {
      console.error("Error generating feedback");
      navigate("/");
    }
  };

  useEffect(() => {
    if (callStatus === CallStatus.ENDED) {
      if (type === "generate") negotiate("/");
      else {
        handleGenerateFeedback(messages);
      }
    }
  }, [callStatus, navigate, type, messages, interviewId]);

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
        // const formattedQuestions = questions
        //   .map((question, index) => `${index + 1}. ${question}`)
        //   .join("\n");
        // console.log(formattedQuestions);
        // await vapi.start(
        //   {
        //     ...interviewer,
        //     model: {
        //       ...interviewer.model,
        //       messages: [
        //         {
        //           ...interviewer.model.messages[0],
        //           content: interviewer.model.messages[0].content.replace(
        //             "{{questions}}",
        //             formattedQuestions
        //           ),
        //         },
        //       ],
        //     },
        //   },
        //   undefined,
        //   undefined,
        //   vapiWorkflowKey,
        //   {
        //     variableValues: {
        //       questions: formattedQuestions,
        //       username: userName,
        //       userId: userId,
        //       interviewId: interviewId,
        //     },
        //   }
        // );
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
          <h1 className="text-white font-openSans text-2xl">AI Agent</h1>
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
        {messages.length > 0 && <p>{latestMessage}</p>}
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
