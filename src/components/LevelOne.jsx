import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import compass from "../assets/level1/compass.png";
import wire from "../assets/level1/wire.png";
import needle from "../assets/level1/needle.png";
import cell from "../assets/level1/cell.png";

const CONFIGS = [
  {
    question: "Make needle move to EAST",
    correct: "B",
    needleAngle: 55,
    elements: {
      compass: { top: "40px", left: "420px" },
      needle: { top: "110px", left: "460px" },
      wire: { top: "50%", left: "50%" },
      drop: { bottom: "150px", left: "350px" },
      batteryA: { bottom: "10px", right: "160px" },
      batteryB: { bottom: "10px", left: "160px", rotate: 180 },
    },
  },
  {
    question: "Make needle move to WEST",
    correct: "A",
    needleAngle: -40,
    elements: {
      compass: { top: "40px", left: "420px" },
      needle: { top: "110px", left: "460px" },
      wire: { top: "50%", left: "50%" },
      drop: { bottom: "150px", left: "350px" },
      batteryA: { bottom: "10px", right: "160px", rotate: 180 },
      batteryB: { bottom: "10px", left: "160px" },
    },
  },
  {
    question: "Make needle move to EAST",
    correct: "B",
    needleAngle: 40,
    elements: {
      compass: { top: "40px", left: "420px" },
      needle: { top: "110px", left: "460px" },
      wire: { top: "50%", left: "50%" },
      drop: { bottom: "150px", left: "350px" },
      batteryA: { bottom: "10px", right: "160px" },
      batteryB: { bottom: "10px", left: "160px", rotate: 180 },
    },
  },
];

export default function LevelOne({ onComplete }) {
  const dropRef = useRef(null);
  const [tryIndex, setTryIndex] = useState(0);
  const [needleAngle, setNeedleAngle] = useState(0);
  const [isDropped, setIsDropped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const [initialPopup, setInitialPopup] = useState(true);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const current = CONFIGS[tryIndex];

  const handleDrop = (batteryType) => {
    if (isDropped) return;

    const isCorrect = batteryType === current.correct;
    setIsDropped(true);
    setNeedleAngle(current.needleAngle);

    setTimeout(() => {
      setNeedleAngle(0);
      setIsDropped(false);

      const nextCorrectCount = isCorrect ? correctCount + 1 : correctCount;
      setCorrectCount(nextCorrectCount);

      if (tryIndex === 2) {
        setTimeout(() => {
          if (nextCorrectCount >= 2) { // Allow completion with 2 or more correct
            setShowCompletionPopup(true);
            setTimeout(() => {
              onComplete();
            }, 3000); // Show completion message for 3 seconds
          } else {
            // Allow completion even with 1 correct answer for better user experience
            setShowCompletionPopup(true);
            setTimeout(() => {
              onComplete();
            }, 3000); // Show completion message for 3 seconds
          }
        }, 1000);
      } else {
        setTryIndex((prev) => prev + 1);
        setShowPopup(true);
      }
    }, 1500);
  };

  const handleDragEnd = (e, batteryType) => {
    const dropArea = dropRef.current.getBoundingClientRect();
    const dragged = e.target.getBoundingClientRect();

    const droppedInside =
      dragged.left < dropArea.right &&
      dragged.right > dropArea.left &&
      dragged.top < dropArea.bottom &&
      dragged.bottom > dropArea.top;

    if (droppedInside) {
      handleDrop(batteryType);
    }
  };

  const style = (styles) => ({
    position: "absolute",
    ...styles,
    zIndex: 40,
    transform: `rotate(${styles?.rotate || 0}deg)`,
  });

  return (
    <div className="absolute z-40 w-full h-full flex items-center justify-center ">
      <div className="relative w-[1000px] h-[800px] overflow-hidden">
        {/* Score */}
        <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded text-xl text-[#632911] font-bold shadow">
          Try: {tryIndex + 1}/3 | ✅ {correctCount}
        </div>

        {/* Initial Instructions */}
        {initialPopup && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="p-14 px-16 pb-7 w-[600px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-2xl text-center">
              You are given two batteries.
              <br />
              Place the one that makes the compass needle point in the correct
              direction.
              <br />
              <br />
              <button
                onClick={() => {
                  setInitialPopup(false);
                  setShowPopup(true);
                }}
                className="mt-10 px-6 py-3 bg-[#632911] text-white rounded-lg text-lg"
              >
                Start Tinkering
              </button>
            </div>
          </div>
        )}

        {/* Question Popup for each try */}
        {showPopup && !initialPopup && !showCompletionPopup && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="p-14 px-16 pb-7 w-[600px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-2xl text-center">
              {current.question}
              <br />
              <button
                onClick={() => setShowPopup(false)}
                className="mt-10 px-6 py-3 bg-[#632911] text-white rounded-lg text-lg"
              >
                Start Try {tryIndex + 1}
              </button>
            </div>
          </div>
        )}

        {/* Level Completion Popup */}
        {showCompletionPopup && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="p-14 px-16 pb-7 w-[600px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-2xl text-center">
              🎉 Congratulations! 🎉
              <br />
              <br />
              You have completed Level 1!
              <br />
              <span className="text-lg text-green-600">
                Score: {correctCount}/3 correct
              </span>
            </div>
          </div>
        )}

        {/* Compass */}
        <img
          src={compass}
          alt="Compass"
          style={{
            ...style(current.elements.compass),
            width: "150px",
            zIndex: 50,
          }}
        />

        {/* Needle */}
        <motion.img
          src={needle}
          alt="Needle"
          className="origin-center"
          style={{
            ...style(current.elements.needle),
            width: "70px",
            zIndex: 50,
          }}
          animate={{ rotate: needleAngle }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        />

        {/* Wire */}
        <img
          src={wire}
          alt="Wire"
          style={{
            ...style(current.elements.wire),
            width: "800px",
            zIndex: 10,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Drop Area */}
        <div
          ref={dropRef}
          style={{
            ...style(current.elements.drop),
            width: "230px",
            height: "100px",
            border: "1px dashed #fff",
            borderRadius: "10px",
          }}
        ></div>

        {/* Battery A */}
        <motion.img
          drag
          dragMomentum={false}
          onDragEnd={(e) => handleDragEnd(e, "A")}
          src={cell}
          alt="Battery A"
          key={`batteryA-${tryIndex}`} // Forces reset on every try
          style={{ ...style(current.elements.batteryA), width: "180px" }}
          className="cursor-pointer hover:scale-105 transition"
        />

        {/* Battery B */}
        <motion.img
          drag
          dragMomentum={false}
          onDragEnd={(e) => handleDragEnd(e, "B")}
          src={cell}
          alt="Battery B"
          key={`batteryB-${tryIndex}`} // Forces reset on every try
          style={{ ...style(current.elements.batteryB), width: "180px" }}
          className="cursor-pointer hover:scale-105 transition"
        />
      </div>
    </div>
  );
}
