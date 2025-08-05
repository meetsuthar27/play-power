import React, { useState } from "react";
import { Info } from "lucide-react"; // Optional: remove if you don't use Lucide icons

const materials = {
  Brass: {
    description: "Brass gives a clear resonating tone.",
    feedback: "Great choice!",
    tooltip: "High resonance and clarity",
    bars: [80, 70, 90, 60, 85],
  },
  Iron: {
    description: "Iron makes it dull and heavy.",
    feedback: "Try a better material.",
    tooltip: "Low resonance, dull thud",
    bars: [20, 25, 15, 10, 18],
  },
  Aluminum: {
    description: "Aluminum is light but lacks resonance.",
    feedback: "Not quite right.",
    tooltip: "Lightweight, low acoustic sustain",
    bars: [30, 40, 20, 35, 25],
  },
  Bronze: {
    description: "Bronze produces a rich, full tone.",
    feedback: "Excellent pick!",
    tooltip: "Warm tone, rich harmonic content",
    bars: [85, 75, 95, 70, 90],
  },
};

export default function LevelTwo() {
  const [selected, setSelected] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (material) => {
    setSelected(material);
    setShowFeedback(true);
  };

  const reset = () => {
    setSelected("");
    setShowFeedback(false);
  };

  const renderBars = (bars) =>
    bars.map((h, i) => (
      <div
        key={i}
        className="w-2 mx-1 bg-yellow-600 rounded-full animate-pulse"
        style={{
          height: `${h}px`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: "1s",
        }}
      ></div>
    ));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center text-[#5c4420] font-serif z-40">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-2">
        🔔 Wrong Bell Metal
      </h1>
      <p className="text-lg sm:text-xl mb-8 max-w-md">
        The bell sounds dull. Can you fix it by choosing the right material?
      </p>

      {/* Bell Image */}
      <div className="text-7xl mb-6 animate-bounce-slow">🔔</div>

      {/* Material Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {Object.entries(materials).map(([material, data]) => (
          <button
            key={material}
            onClick={() => handleSelect(material)}
            className={`relative px-6 py-3 rounded-lg text-md font-semibold transition shadow-md ${
              selected === material
                ? "bg-yellow-700 text-white"
                : "bg-white hover:bg-yellow-100"
            }`}
          >
            {material}
            <div className="absolute top-0 right-0 mt-[-6px] mr-[-6px] group cursor-pointer">
              <Info className="w-4 h-4 text-yellow-800" />
              <span className="absolute hidden group-hover:block w-max text-xs mt-2 bg-white text-[#5c4420] border px-2 py-1 rounded shadow-md z-50">
                {data.tooltip}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Result */}
      {selected && (
        <div className="mt-4 flex flex-col items-center gap-4">
          {/* Sound bars */}
          <div className="flex items-end h-32">
            {renderBars(materials[selected].bars)}
          </div>

          {/* Description */}
          <div className="text-lg">{materials[selected].description}</div>

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`text-xl font-bold ${
                materials[selected].feedback.includes("Great") ||
                materials[selected].feedback.includes("Excellent")
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {materials[selected].feedback}
            </div>
          )}

          {/* Simulated Sound */}
          <div className="text-sm italic mt-2 text-yellow-800">
            🔊 [Simulated {selected} Sound Playing...]
          </div>

          {/* Reset Button */}
          <button
            onClick={reset}
            className="mt-4 px-5 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 transition"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
