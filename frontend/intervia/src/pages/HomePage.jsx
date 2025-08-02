import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [userInterview, setUserInterview] = useState(null);
  const [interview, setInterview] = useState(null);

  const handleGenerateInterview = () => {
    navigate("/callpage", {
      state: { typeOfCalling: "generate" },
    });
  };

  useEffect(() => {
    if (!isLoaded || !user) return; // wait for user to load

    const fetchUserInterviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/interviews/${user.id}`
        );
        if (response.status === 404) {
          console.log("No interviews found for this user.");
          return;
        }
        console.log("Interviews:", response.data.interviews);
        setUserInterview(response.data.interviews);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };

    const fetchInterviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/interviews/recommended`
        );
        if (response.status === 404) {
          console.log("No interviews found for this user.");
          return;
        }
        console.log("Interviews:", response.data.interviews);
        setInterview(response.data.interviews);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    fetchUserInterviews();
    fetchInterviews();
  }, [isLoaded, user]);

  return (
    <>
      {/* <div className="px-10">
        <div className=" h-screen flex items-center justify-center">
          <section className=" min-h-screen flex items-center justify-center px-6 py-16">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-6xl font-ubuntu font-bold text-white mb-2">
                  Meet Intervia.
                </h1>
                <p className="text-5xl font-bold font-ubuntu leading-12 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-blue-400 to-purple-400 mb-6">
                  A smarter way to crack your next interview.
                </p>
                <p className="text-gray-400 font-openSans mb-8 text-lg">
                  An AI-powered interview assistant designed to help you
                  practice, prepare, and perfect your responses – powered by
                  advanced NLP and machine learning.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      navigate("/callpage", {
                        state: { typeOfCalling: "generate" },
                      });
                    }}
                    className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition"
                  >
                    Take your first interview
                  </button>
                </div>
              </div>

              <div className="w-full  rounded-lg flex ">
                <img
                  src="/src/assets/roboimage.png"
                  alt="roboimage"
                  className="w-full h-full object-cover "
                />
              </div>
            </div>
          </section>
        </div>

        <div>
          <h1 className="text-white text-2xl font-openSans font-bold">
            Your Interviews
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {userInterview && userInterview.length > 0 ? (
              userInterview.map((interview) => (
                <Card key={interview._id} {...interview} />
              ))
            ) : (
              <p className="text-gray-400 mt-3">
                You haven't taken any interviews yet.
              </p>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h1 className="text-white text-2xl font-openSans font-bold">
            Recommended Interviews
          </h1>

          <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-auto">
            {interview && interview.length > 0 ? (
              interview.map((interview) => (
                <Card key={interview._id} {...interview} />
              ))
            ) : (
              <p className="text-gray-400 mt-3">
                No interviews available to take right now. Please check back
                later.
              </p>
            )}
          </div>
        </div>
      </div> */}
      <div
        // className="bg-white font-sans text-gray-800"
        className="relative text-center py-5 bg-cover bg-center bg-no-repeat "
        // style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="container mx-auto px-28">
          {/* Header */}

          {/* Hero Section */}
          <main className="text-center py-24">
            <div className="relative z-10 px-4">
              <h1 className="text-6xl font-bold font- leading-17 text-white ">
                The AI-Powered Interview Coach <br /> in Your Pocket
              </h1>
              <p className="text-lg text-gray-400 mt-6 w-[55%] mx-auto tracking-tight leading-6">
                Experience personalized mock interviews with our advanced voice
                AI. Get instant feedback and master the art of communication for
                your next big opportunity
              </p>

              <div className="mt-5 flex justify-center items-center flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGenerateInterview}
                  className="bg-white text-black px-8 py-3 rounded-l-2xl rounded-r-2xl font-semibold hover:bg-gray-200"
                >
                  Generate new Interview
                </button>
              </div>
            </div>
          </main>

          {/* Featured Scenarios Section */}
          <section className="py-16">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-bold"> Your Interviews</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {userInterview && userInterview.length > 0 ? (
                userInterview.map((interview) => (
                  <Card
                    key={interview._id} // or use interview._id if available
                    {...interview}
                  />
                ))
              ) : (
                <p className="text-white mt-3 text-left">
                  You haven't taken any interviews yet.
                </p>
              )}
            </div>
          </section>

          <section className="py-16">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-bold">Recommended Interviews</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {interview && interview.length > 0 ? (
                interview.map((interview) => (
                  <Card key={interview._id} {...interview} />
                ))
              ) : (
                <p className="text-white mt-3 text-left">
                  No interviews available to take right now. Please check back
                  later.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HomePage;

// src/components/HeroSection.jsx
