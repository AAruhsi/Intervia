import React from "react";

const CallStatus = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  ENDED: "ENDED",
  CONNECTING: "CONNECTING",
};

const Agent = ({ userId, userName, type }) => {
  const callStatus = CallStatus.ACTIVE;
  const isSpeaking = true;
  const messages = ["What is your name?", "My name is Vapi"];
  const lastMessage = messages[messages.length - 1];
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
        {messages.length > 0 && (
          <p key={lastMessage} className="">
            {lastMessage}
          </p>
        )}
      </div>

      {/* call end/start button */}
      <div>
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition">
            <span>
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.ENDED
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition">
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
