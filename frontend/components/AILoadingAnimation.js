import React from 'react';

const AILoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      <div className="relative w-48 h-48 mb-6">
        <div className="absolute inset-0 bg-blue-500 rounded-full opacity-75 animate-ping"></div>
        <div className="relative z-10 bg-white shadow-2xl rounded-full p-6 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 100 100" 
            className="w-full h-full text-blue-600 animate-pulse"
          >
            <path 
              d="M50 10 
                 Q60 30, 70 40 
                 C85 55, 80 75, 50 90 
                 C20 75, 15 55, 30 40 
                 Q40 30, 50 10" 
              fill="currentColor" 
              className="text-blue-500"
            />
            <circle cx="50" cy="50" r="5" fill="white" className="animate-ping" />
          </svg>
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">AI Pricing Intelligence</h2>
        <p className="text-blue-600 animate-bounce">Analyzing Market Data...</p>
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default AILoadingAnimation;