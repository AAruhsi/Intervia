import React from "react";

const InterviewScenarioCard = ({
  scenarioType,
  title,
  description,
  cardBgColor,
  textColor,
  buttonBgColor,
  buttonTextColor,
}) => {
  return (
    <div
      className={`bg-[#1E232B] p-1 rounded-2xl flex flex-col justify-between shadow-md backdrop-blur-md bg-opacity-80`}
    >
      <div
        className={`${cardBgColor} p-8 rounded-2xl h-full flex flex-col justify-between shadow-md backdrop-blur-md bg-opacity-80`}
      >
        <div>
          <p
            className={`text-sm font-semibold uppercase tracking-wide ${
              textColor === "text-white" ? "text-blue-200" : "text-gray-500"
            }`}
          >
            {scenarioType}
          </p>
          <h3
            className={`text-2xl md:text-3xl font-bold mt-3 mb-4 ${textColor}`}
          >
            {title}
          </h3>
          <p className={`text-base ${textColor} opacity-90`}>{description}</p>
        </div>
        <div className="flex justify-end mt-10">
          <button
            className={`${buttonBgColor} rounded-full p-3 transition hover:scale-110`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${buttonTextColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const InterviaAIPage = () => {
  return (
    <div
      // className="bg-white font-sans text-gray-800"
      className="relative text-center py-5 bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="container mx-auto px-28">
        {/* Header */}
        <header className="flex justify-between items-center py-8">
          <div className="text-3xl font-bold">Intervia.Ai</div>
          <div className="flex items-center space-x-6">
            <button className="text-lg hover:text-black">Log In</button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="text-center py-24">
          <div className="relative z-10 px-4">
            <h1 className="text-6xl font-bold font- leading-tight text-white">
              The AI-Powered Interview Coach <br /> in Your Pocket
            </h1>
            <p className="text-xl text-gray-200 mt-6 w-[55%] mx-auto">
              Experience personalized mock interviews with our advanced voice
              AI. Get instant feedback and master the art of communication for
              your next big opportunity
            </p>

            <div className="mt-5 flex justify-center items-center flex-col sm:flex-row gap-4">
              <button className="bg-white text-black px-8 py-3 rounded-l-2xl rounded-r-2xl font-semibold hover:bg-gray-200">
                Generate new Interview
              </button>
            </div>
          </div>
        </main>

        {/* Featured Scenarios Section */}
        <section className="py-16">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold">Featured Scenarios</h2>
            <a href="#" className="text-lg font-semibold hover:underline">
              Explore All
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <InterviewScenarioCard
              scenarioType="STRATEGY"
              title="Behavioral"
              description="Master the STAR method and answer behavioral questions with confidence."
              cardBgColor="bg-[#252c36]"
              textColor="text-white"
              buttonBgColor="bg-white"
              buttonTextColor="text-black"
            />

            <InterviewScenarioCard
              scenarioType="PLANS"
              title="Technical"
              description="Sharpen your technical skills with our tailored coding and system design interviews."
              // cardBgColor="bg-gradient-to-br from-white to-black"
              cardBgColor="bg-[#14171c]"
              textColor="text-white"
              buttonBgColor="bg-cyan-400"
              buttonTextColor="text-black"
            />

            <InterviewScenarioCard
              scenarioType="STRATEGY"
              title="Situational"
              description="Prepare for unexpected questions and learn to think on your feet."
              cardBgColor="bg-gradient-to-br from-purple-500 to-black"
              textColor="text-white"
              buttonBgColor="bg-white"
              buttonTextColor="text-black"
            />

            <InterviewScenarioCard
              scenarioType="PLANS"
              title="Group Discussion"
              description="Simulate a group setting and practice your communication and collaboration skills."
              cardBgColor="bg-gradient-to-br from-yellow-400 to-black"
              textColor="text-black"
              buttonBgColor="bg-black"
              buttonTextColor="text-white"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 flex items-center space-x-8 text-gray-500">
          <a href="#" className="hover:underline">
            Terms Policy
          </a>
          <a href="#" className="hover:underline">
            Customer Story
          </a>
        </footer>
      </div>
    </div>
  );
};

export default InterviaAIPage;
