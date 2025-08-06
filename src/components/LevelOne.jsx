import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import compass from "../assets/level1/compass.avif";
import wire from "../assets/level1/wire.avif";
import needle from "../assets/level1/needle.avif";
import cell from "../assets/level1/cell.avif";

const CONFIGS = [
  {
    question: "Make needle move towards EAST",
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
    question: "Make needle move towards WEST",
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
    question: "Make needle move towards EAST",
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
  const [initialNeedleAngle, setInitialNeedleAngle] = useState(0);
  const [currentNeedleAngle, setCurrentNeedleAngle] = useState(0);

  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const current = CONFIGS[tryIndex];

  const handleDrop = (batteryType) => {
    if (isDropped) return;

    const isCorrect = batteryType === current.correct;
    setIsDropped(true);

    // Animate from currentNeedleAngle to target
    const targetAngle = isCorrect
      ? current.needleAngle
      : currentNeedleAngle + (Math.random() > 0.5 ? 30 : -30); // wrong answers deviate randomly

    setCurrentNeedleAngle(targetAngle);

    setTimeout(() => {
      setIsDropped(false);

      const nextCorrectCount = isCorrect ? correctCount + 1 : correctCount;
      setCorrectCount(nextCorrectCount);

      if (tryIndex === 2) {
        setTimeout(() => {
          setShowCompletionPopup(true);
          setTimeout(() => {
            onComplete();
          }, 3000);
        }, 1000);
      } else {
        const nextTry = tryIndex + 1;

        // generate new random initial direction
        const randomInit = Math.floor(Math.random() * 120 - 60); // -60° to +60°
        setInitialNeedleAngle(randomInit);
        setCurrentNeedleAngle(randomInit);
        setTryIndex(nextTry);
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

  useEffect(() => {
    if (showPopup && !initialPopup && !showCompletionPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3500); // 3.5 seconds

      return () => clearTimeout(timer); // Cleanup
    }
  }, [showPopup, initialPopup, showCompletionPopup]);

  useEffect(() => {
    if (!initialPopup) {
      const randomInit = Math.floor(Math.random() * 120 - 60); // -60° to +60°
      setInitialNeedleAngle(randomInit);
      setCurrentNeedleAngle(randomInit);
    }
  }, [initialPopup]);

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
          <div className="absolute inset-0 flex items-center justify-center z-60">
            <div className="relative flex flex-col justify-between items-center p-14 px-16 pb-20 w-[1000px] h-[500px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-[1.7rem] text-center">
              {/* Title */}
              <div>
                <h1 className="text-5xl font-[sf-heavy] mb-6">
                  <span className="text-[#d38200] mr-4">Level 1 </span> Power
                  Alignment
                </h1>

                {/* Description */}
                <p className="leading-snug px-6 font-[sf-bold]">
                  Choose a cell’s direction and insert it into the circuit.{" "}
                  <br />
                  Your goal: make the compass needle point <strong>
                    East
                  </strong>{" "}
                  or <strong>West</strong>, as required. Think like a tinkerer.
                  One choice. One spark. Complete the level!
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  setInitialPopup(false);
                  setShowPopup(true);
                }}
                className=" px-4 py-3 cursor-pointer flex items-center gap-2
        text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911]
        bg-gradient-to-b from-[#FEC547] to-[#F3A01C] 
        shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)] 
        rounded-[18px] [border-radius-smooth:0.6] hover:scale-110 transition-transform duration-300 ease-out"
              >
                <span>START SOLVING</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[1.4em] w-[1.4em]"
                  fill="#D57100"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Question Popup for each try */}
        {showPopup && !initialPopup && !showCompletionPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
          >
            <div className="p-14 px-16 pb-16 w-[600px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-2xl text-center">
              {current.question}
            </div>
          </motion.div>
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
          animate={{ rotate: currentNeedleAngle }}
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
