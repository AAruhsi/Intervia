import IconsDisplay from "./IconsDisplay";
import { useNavigate } from "react-router-dom";
const Card = ({
  _id,
  techStack,
  role,
  type,
  level,
  createdAt,
  userId,
  amount,
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const navigate = useNavigate();
  return (
    <div className="relative w-full sm:w-[90%] md:w-[90%] lg:w-full text-left h-auto min-h-[320px] max-h-[500px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 border border-gray-600 shadow-lg overflow-hidden">
      {/* Tag in Top Right Corner */}
      <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-tr-xl rounded-bl-2xl shadow-xl z-10 uppercase">
        {type}
      </span>

      {/* Inner Content */}
      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black rounded-2xl m-1 p-6 text-white flex flex-col justify-between">
        <div>
          <img
            src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
            alt="vapi"
            className="w-16 h-16 rounded-full object-cover "
          />

          <h2 className="font-mono text-xl md:text-2xl font-bold mt-3 leading-tight capitalize">
            {role} Interview
          </h2>

          <span className="flex items-center mt-1 text-[13px] text-gray-400">
            <p className="mr-2">{formattedDate}</p>
            <p>--/100</p>
          </span>

          <p className="text-sm text-gray-300 mt-2">
            You haven't taken the interview yet. Take it to improve your score.
          </p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <IconsDisplay techStack={techStack} />
          <button
            className="bg-blue-500 text-white px-4 py-2 text-sm rounded-full hover:bg-blue-600 transition"
            onClick={() => {
              navigate("/callpage", {
                state: { typeOfCalling: "takeInterview", interviewId: _id },
              });
            }}
          >
            Take Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
