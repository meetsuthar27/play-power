import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LevelFive({ onComplete }) {
  const [selectedCalibration, setSelectedCalibration] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCalibrationSelect = (method) => {
    setSelectedCalibration(method);
    const correct = method === "zero"; // Zero calibration is correct for sensors
    setIsCorrect(correct);
    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      if (correct) {
        onComplete();
      } else {
        // Reset for another try
        setSelectedCalibration(null);
      }
    }, 2000);
  };

  return (
    <div className="absolute z-40 w-full h-full flex items-center justify-center">
      <div className="p-10 bg-white rounded-xl shadow-md text-xl text-[#632911] font-[sf-heavy] max-w-2xl">
        <h2 className="text-3xl mb-6 text-center">📊 Sensor Calibration</h2>
        <p className="text-xl mb-8 text-center">
          The sensor readings are inaccurate. Choose the correct calibration method to fix the sensor!
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleCalibrationSelect("offset")}
            className={`p-4 rounded-lg border-4 transition-all duration-300 ${
              selectedCalibration === "offset" 
                ? "border-red-500 bg-red-100" 
                : "border-gray-300 bg-gray-50 hover:border-blue-400"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-lg font-bold">Offset</div>
              <div className="text-xs text-gray-600">Add/subtract value</div>
            </div>
          </button>
          
          <button
            onClick={() => handleCalibrationSelect("zero")}
            className={`p-4 rounded-lg border-4 transition-all duration-300 ${
              selectedCalibration === "zero" 
                ? "border-green-500 bg-green-100" 
                : "border-gray-300 bg-gray-50 hover:border-blue-400"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-lg font-bold">Zero Point</div>
              <div className="text-xs text-gray-600">Set baseline</div>
            </div>
          </button>
          
          <button
            onClick={() => handleCalibrationSelect("scale")}
            className={`p-4 rounded-lg border-4 transition-all duration-300 ${
              selectedCalibration === "scale" 
                ? "border-red-500 bg-red-100" 
                : "border-gray-300 bg-gray-50 hover:border-blue-400"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⚖️</div>
              <div className="text-lg font-bold">Scale</div>
              <div className="text-xs text-gray-600">Multiply factor</div>
            </div>
          </button>
        </div>

        {showResult && (
          <div className={`mt-6 p-4 rounded-lg text-center text-xl ${
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {isCorrect ? "✅ Perfect! Zero point calibration sets the correct baseline for accurate readings." : "❌ Wrong! Try a different calibration method."}
          </div>
        )}
      </div>
    </div>
  );
}
