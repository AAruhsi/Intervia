import React from "react";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className=" h-screen flex items-center justify-center">
        <section className=" min-h-screen flex items-center justify-center px-6 py-16">
          <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div>
              <h1 className="text-6xl font-ubuntu font-bold text-white mb-2">
                Meet Intervia.
              </h1>
              <p className="text-5xl font-bold font-ubuntu leading-12 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-blue-400 to-purple-400 mb-6">
                A smarter way to crack your next interview.
              </p>
              <p className="text-gray-400 font-openSans mb-8 text-lg">
                An AI-powered interview assistant designed to help you practice,
                prepare, and perfect your responses – powered by advanced NLP
                and machine learning.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    navigate("/callpage");
                  }}
                  className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition"
                >
                  Take your first interview
                </button>
              </div>
            </div>

            {/* Video/Image placeholder */}
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
    </>
  );
};

export default HomePage;

// src/components/HeroSection.jsx
