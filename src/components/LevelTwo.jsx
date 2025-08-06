import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Icons ---
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-green-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-red-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2 inline-block"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12h3m12 0h3m-9-9v3m0 12v3"
    />
  </svg>
);

// --- Game Configuration ---
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;
const OBJECT_HEIGHT = 50; // Constant object height in pixels

// --- RECALIBRATED & SIMPLIFIED LEVELS ---
const LEVELS = [
  {
    target: { height: 100, x: 950, orientation: "inverted" },
    tolerance: { height: 10, x: 20 },
    description: "Create an inverted, real image that is magnified.",
  },
  {
    target: { height: 25, x: 650, orientation: "inverted" },
    tolerance: { height: 10, x: 20 },
    description:
      "Create an inverted, real image that is smaller than the object.",
  },
  {
    target: { height: 100, x: 300, orientation: "upright" },
    tolerance: { height: 15, x: 25 },
    description: "Create an upright, virtual image that is magnified.",
  },
];

// --- Main Game Component ---
const LevelTwo = ({ onComplete }) => {
  // --- State Management ---
  const [level, setLevel] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: "" });
  const [tries, setTries] = useState(0);

  // Player-controlled state
  const [objectPositionU, setObjectPositionU] = useState(-250); // u is negative
  const [focalLength, setFocalLength] = useState(150);

  // Derived physics state
  const [imageProps, setImageProps] = useState({
    v: 0,
    height: 0,
    orientation: "upright",
    type: "virtual",
  });

  // --- Physics Calculation ---
  useEffect(() => {
    let v, M, imageHeight, orientation, type;
    if (focalLength === 0 || objectPositionU + focalLength === 0) {
      v = Infinity;
    } else {
      v = 1 / (1 / focalLength + 1 / objectPositionU);
    }
    M = objectPositionU === 0 ? Infinity : v / objectPositionU;
    imageHeight = Math.abs(M * OBJECT_HEIGHT);
    orientation = M < 0 ? "inverted" : "upright";
    type = v > 0 ? "real" : "virtual";
    setImageProps({ v, height: imageHeight, orientation, type });
  }, [objectPositionU, focalLength]);

  const currentChallenge = LEVELS[level];

  // --- Event Handlers ---
  const handleCheckAnswer = useCallback(() => {
    setTries((prev) => prev + 1);
    const { v, height, orientation } = imageProps;
    const { target, tolerance } = currentChallenge;
    const xPosition = CENTER_X + v;

    const heightMatch = Math.abs(height - target.height) <= tolerance.height;
    const xMatch = Math.abs(xPosition - target.x) <= tolerance.x;
    const orientationMatch = orientation === target.orientation;

    if (heightMatch && xMatch && orientationMatch) {
      setFeedback({
        correct: true,
        message: "Perfect! You matched the image.",
      });
      setShowFeedback(true);
    } else {
      let errorMsg = "Not quite. Check the following:";
      if (!heightMatch)
        errorMsg += `\n- Image Height is off. (Yours: ${height.toFixed(
          1
        )}px, Target: ${target.height}px)`;
      if (!xMatch)
        errorMsg += `\n- Image Position is off. (Yours: ${xPosition.toFixed(
          1
        )}px, Target: ${target.x}px)`;
      if (!orientationMatch)
        errorMsg += `\n- Image Orientation is wrong. (Yours: ${orientation}, Target: ${target.orientation})`;
      setFeedback({ correct: false, message: errorMsg });
      setShowFeedback(true);
    }
  }, [imageProps, currentChallenge]);

  const handleNextLevel = () => {
    setShowFeedback(false);
    if (level < LEVELS.length - 1) {
      setLevel((prev) => prev + 1);
      setTries(0);
    } else {
      if (onComplete) onComplete(tries);
      setFeedback({
        correct: true,
        message: `Congratulations! You've completed all levels in ${tries} total tries!`,
      });
      setShowFeedback(true);
    }
  };

  const handleRestart = () => {
    setLevel(0);
    setTries(0);
    setShowIntro(true);
    setShowFeedback(false);
    setObjectPositionU(-250);
    setFocalLength(150);
  };

  // --- SVG Drawing Calculations ---
  const imageX = CENTER_X + imageProps.v;
  const objectX = CENTER_X + objectPositionU;
  const lensPath = `M ${CENTER_X} ${CENTER_Y - 100} Q ${
    CENTER_X + 40
  } ${CENTER_Y} ${CENTER_X} ${CENTER_Y + 100} Q ${
    CENTER_X - 40
  } ${CENTER_Y} ${CENTER_X} ${CENTER_Y - 100} Z`;

  // --- Render ---
  return (
    <div className="absolute z-30 top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-85 p-4 md:p-8 w-full max-w-7xl mx-auto flex flex-col items-center select-none font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-[1.2rem]">
      <AnimatePresence>
        {showIntro && (
          <Modal
            title="Welcome to the Lens Lab!"
            onClose={() => setShowIntro(false)}
          >
            <IntroContent onClose={() => setShowIntro(false)} />
          </Modal>
        )}
        {showFeedback && (
          <Modal
            title={feedback.correct ? "Success!" : "Almost!"}
            onClose={
              feedback.correct ? handleNextLevel : () => setShowFeedback(false)
            }
          >
            <FeedbackContent
              feedback={feedback}
              level={level}
              onNext={handleNextLevel}
              onTryAgain={() => setShowFeedback(false)}
            />
          </Modal>
        )}
      </AnimatePresence>

      <header className="w-full flex justify-between items-center mb-4">
        <h1 className="text-4xl font-[sf-heavy] mb-6">
          <span className="text-[#d38200] mr-4">Level 2 </span> Optics Challenge
        </h1>
        <div className="text-right">
          <p className="text-lg">
            Tries: <span className="font-bold">{tries}</span>
          </p>
          <button onClick={handleRestart} className="text-sm hover:underline">
            Restart Game
          </button>
        </div>
      </header>

      <div className="w-full bg-[#FFFAE4]/50 rounded-xl p-4 mb-4 border-2 border-[#632911]/50">
        <h2 className="text-lg font-semibold text-center flex items-center justify-center">
          <TargetIcon />
          Target Image
        </h2>
        <p className="text-center mb-2">{currentChallenge.description}</p>
        <div className="flex justify-around text-center text-sm md:text-base">
          <p>
            Height:{" "}
            <span className="font-mono">
              {currentChallenge.target.height}px
            </span>
          </p>
          <p>
            X-Position:{" "}
            <span className="font-mono">{currentChallenge.target.x}px</span>
          </p>
          <p>
            Orientation:{" "}
            <span className="font-mono capitalize">
              {currentChallenge.target.orientation}
            </span>
          </p>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#d2b48c] rounded-lg overflow-hidden border-2 border-[#632911] shadow-inner">
          <svg
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            className="w-full h-auto"
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            <line
              x1="0"
              y1={CENTER_Y}
              x2={CANVAS_WIDTH}
              y2={CENTER_Y}
              stroke="#632911"
              opacity="0.3"
              strokeWidth="2"
            />
            <path
              d={lensPath}
              fill="#87CEEB80"
              stroke="#632911"
              strokeWidth="2"
            />
            <circle
              cx={CENTER_X + focalLength}
              cy={CENTER_Y}
              r="5"
              fill="#F3A01C"
            />
            <text
              x={CENTER_X + focalLength}
              y={CENTER_Y - 10}
              fill="#632911"
              textAnchor="middle"
              className="font-[sf-heavy] text-sm"
            >
              F
            </text>
            <circle
              cx={CENTER_X - focalLength}
              cy={CENTER_Y}
              r="5"
              fill="#F3A01C"
            />
            <text
              x={CENTER_X - focalLength}
              y={CENTER_Y - 10}
              fill="#632911"
              textAnchor="middle"
              className="font-[sf-heavy] text-sm"
            >
              F'
            </text>

            {isFinite(imageProps.v) && (
              <g>
                <path
                  d={`M ${objectX} ${
                    CENTER_Y - OBJECT_HEIGHT
                  } H ${CENTER_X} L ${CENTER_X + focalLength * 2} ${
                    CENTER_Y - focalLength
                  }`}
                  stroke="#FF6347"
                  opacity="0.7"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d={`M ${objectX} ${CENTER_Y - OBJECT_HEIGHT} L ${imageX} ${
                    CENTER_Y +
                    imageProps.height *
                      (imageProps.orientation === "inverted" ? 1 : -1)
                  }`}
                  stroke="#4682B4"
                  opacity="0.7"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d={`M ${objectX} ${CENTER_Y - OBJECT_HEIGHT} L ${CENTER_X} ${
                    CENTER_Y -
                    (OBJECT_HEIGHT * focalLength) /
                      (focalLength + objectPositionU)
                  } H ${CANVAS_WIDTH}`}
                  stroke="#32CD32"
                  opacity="0.7"
                  strokeWidth="1.5"
                  fill="none"
                />
              </g>
            )}

            <g opacity="0.4">
              <line
                x1={currentChallenge.target.x}
                y1={CENTER_Y}
                x2={currentChallenge.target.x}
                y2={
                  CENTER_Y +
                  currentChallenge.target.height *
                    (currentChallenge.target.orientation === "inverted"
                      ? 1
                      : -1)
                }
                stroke="white"
                strokeWidth="3"
                strokeDasharray="10 5"
                markerEnd="url(#arrow)"
                className="text-white"
              />
              <text
                x={currentChallenge.target.x}
                y={
                  CENTER_Y +
                  currentChallenge.target.height *
                    (currentChallenge.target.orientation === "inverted"
                      ? 1
                      : -1) +
                  (currentChallenge.target.orientation === "inverted"
                    ? 20
                    : -10)
                }
                fill="white"
                textAnchor="middle"
                className="font-[sf-heavy] text-sm"
              >
                Target
              </text>
            </g>

            <line
              x1={objectX}
              y1={CENTER_Y}
              x2={objectX}
              y2={CENTER_Y - OBJECT_HEIGHT}
              stroke="#FEC547"
              strokeWidth="3"
              markerEnd="url(#arrow)"
              className="text-[#FEC547]"
            />
            <text
              x={objectX}
              y={CENTER_Y + 20}
              fill="#632911"
              textAnchor="middle"
              className="font-[sf-heavy]"
            >
              Object
            </text>

            {isFinite(imageProps.v) && imageProps.height > 0 && (
              <g>
                <line
                  x1={imageX}
                  y1={CENTER_Y}
                  x2={imageX}
                  y2={
                    CENTER_Y +
                    imageProps.height *
                      (imageProps.orientation === "inverted" ? 1 : -1)
                  }
                  stroke={imageProps.type === "real" ? "#c2410c" : "#475569"}
                  strokeWidth="3"
                  strokeDasharray={
                    imageProps.type === "virtual" ? "8 4" : "none"
                  }
                  markerEnd="url(#arrow)"
                  className={
                    imageProps.type === "real"
                      ? "text-[#c2410c]"
                      : "text-[#475569]"
                  }
                />
                <text
                  x={imageX}
                  y={
                    CENTER_Y +
                    imageProps.height *
                      (imageProps.orientation === "inverted" ? 1 : -1) +
                    (imageProps.orientation === "inverted" ? 20 : -10)
                  }
                  fill="#632911"
                  textAnchor="middle"
                  className="font-[sf-heavy]"
                >
                  {imageProps.type === "real" ? "Real Image" : "Virtual Image"}
                </text>
              </g>
            )}
          </svg>
        </div>

        <div className="bg-[#FFFAE4]/50 p-4 rounded-xl border-2 border-[#632911]/50 flex flex-col justify-center space-y-6">
          <ControlSlider
            label="Object Position"
            value={objectPositionU}
            onChange={(e) => setObjectPositionU(Number(e.target.value))}
            min={-500}
            max={-10}
            step={1}
            unit="px"
          />
          <ControlSlider
            label="Focal Length"
            value={focalLength}
            onChange={(e) => setFocalLength(Number(e.target.value))}
            min={50}
            max={300}
            step={1}
            unit="px"
          />
          <div className="pt-4 mt-auto">
            <GameButton onClick={handleCheckAnswer} text="Check Answer" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---
const GameButton = ({ onClick, text, className = "" }) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-3 cursor-pointer flex items-center justify-center gap-2 text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)] rounded-[18px] [border-radius-smooth:0.6] hover:scale-110 transition-transform duration-300 ease-out ${className}`}
  >
    {text}
  </button>
);

const ControlSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
}) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <div className="flex items-center space-x-4">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-3 bg-[#E7C796] rounded-lg appearance-none cursor-pointer range-thumb"
      />
      <span className="font-mono text-sm w-20 text-right">
        {value}
        {unit}
      </span>
    </div>
    <style jsx>{`
      .range-thumb::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        background: #fec547;
        border: 3px solid #632911;
        border-radius: 50%;
        cursor: pointer;
      }
      .range-thumb::-moz-range-thumb {
        width: 25px;
        height: 25px;
        background: #fec547;
        border: 3px solid #632911;
        border-radius: 50%;
        cursor: pointer;
      }
    `}</style>
  </div>
);

const Modal = ({ children, title, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      className="p-6 w-full max-w-md font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px]"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
      {children}
    </motion.div>
  </motion.div>
);

const IntroContent = ({ onClose }) => (
  <>
    <p className="mb-4 text-center">
      Your goal is to match the target image using the sliders!
    </p>
    <ul className="list-disc list-inside mb-6 space-y-2">
      <li>
        Adjust <strong>Object Position</strong> and{" "}
        <strong>Focal Length</strong>.
      </li>
      <li>The ray diagram updates in real-time.</li>
      <li>Match the target's Height, Position, and Orientation.</li>
    </ul>
    <GameButton onClick={onClose} text="Start Challenge" />
  </>
);

const FeedbackContent = ({ feedback, level, onNext, onTryAgain }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center justify-center mb-4">
      {feedback.correct ? <CheckIcon /> : <XIcon />}
      <p className="whitespace-pre-wrap ml-2 text-center text-lg">
        {feedback.message}
      </p>
    </div>
    {feedback.correct ? (
      <GameButton
        onClick={onNext}
        text={level === LEVELS.length - 1 ? "Finish Game" : "Next Level"}
      />
    ) : (
      <GameButton onClick={onTryAgain} text="Try Again" />
    )}
  </div>
);

export default LevelTwo;
