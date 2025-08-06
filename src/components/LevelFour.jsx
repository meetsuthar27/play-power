import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LevelFour({ onComplete }) {
  const [selectedControl, setSelectedControl] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleControlSelect = (control) => {
    setSelectedControl(control);
    const correct = control === "potentiometer"; // Potentiometer is correct for speed control
    setIsCorrect(correct);
    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      if (correct) {
        onComplete();
      } else {
        // Reset for another try
        setSelectedControl(null);
      }
    }, 2000);
  };

  return (
    <div className="absolute z-40 w-full h-full flex items-center justify-center">
      <div className="p-10 bg-white rounded-xl shadow-md text-xl text-[#632911] font-[sf-heavy] max-w-2xl">
        <h2 className="text-3xl mb-6 text-center">⚙️ Motor Speed Control</h2>
        <p className="text-xl mb-8 text-center">
          The motor is running at constant speed. Choose the right component to enable variable speed control!
        </p>
        
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => handleControlSelect("switch")}
            className={`p-6 rounded-lg border-4 transition-all duration-300 ${
              selectedControl === "switch" 
                ? "border-red-500 bg-red-100" 
                : "border-gray-300 bg-gray-50 hover:border-blue-400"
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🔘</div>
              <div className="text-2xl font-bold">Switch</div>
              <div className="text-sm text-gray-600">On/Off only</div>
            </div>
          </button>
          
          <button
            onClick={() => handleControlSelect("potentiometer")}
            className={`p-6 rounded-lg border-4 transition-all duration-300 ${
              selectedControl === "potentiometer" 
                ? "border-green-500 bg-green-100" 
                : "border-gray-300 bg-gray-50 hover:border-blue-400"
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🎛️</div>
              <div className="text-2xl font-bold">Potentiometer</div>
              <div className="text-sm text-gray-600">Variable control</div>
            </div>
          </button>
        </div>

        {showResult && (
          <div className={`mt-6 p-4 rounded-lg text-center text-xl ${
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {isCorrect ? "✅ Perfect! Potentiometer allows variable speed control." : "❌ Wrong! A switch only provides on/off control."}
          </div>
        )}
      </div>
    </div>
  );
}
