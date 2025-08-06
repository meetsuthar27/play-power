import React, { useState, useEffect, useCallback, useMemo } from "react";

// --- Helper Data & Functions ---

// Using a global Tone.js object, assuming it's loaded via a script tag in the main HTML.
// <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js"></script>
const canUseAudio =
  typeof window !== "undefined" && typeof window.Tone !== "undefined";

// Sound effects using Tone.js
const sounds = {
  start: () => {
    if (canUseAudio) {
      // Start the audio context if it's not already running (required by browsers)
      if (window.Tone.context.state !== "running") {
        window.Tone.start();
      }
      const synth = new window.Tone.Synth().toDestination();
      synth.triggerAttackRelease("C4", "8n");
    }
  },
  success: () => {
    if (!canUseAudio) return;
    const synth = new window.Tone.Synth().toDestination();
    // Ensure transport is running for scheduled sounds
    if (window.Tone.Transport.state !== "started") {
      window.Tone.Transport.start();
    }
    synth.triggerAttackRelease("C5", "8n", "+0.1");
    synth.triggerAttackRelease("E5", "8n", "+0.2");
    synth.triggerAttackRelease("G5", "8n", "+0.3");
  },
  error: () => {
    if (!canUseAudio) return;
    const synth = new window.Tone.NoiseSynth({
      noise: { type: "brown" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
    }).toDestination();
    synth.triggerAttackRelease("0.1");
  },
  tick: () => {
    if (!canUseAudio) return;
    const synth = new window.Tone.MembraneSynth().toDestination();
    synth.triggerAttackRelease("C1", "8n");
  },
};

// Color mapping for styling, values, multipliers, and tolerances.
const colorData = {
  Black: {
    value: 0,
    multiplier: 1,
    tolerance: null,
    style: "bg-[#333] text-white",
  },
  Brown: {
    value: 1,
    multiplier: 10,
    tolerance: "±1%",
    style: "bg-[#A0522D] text-white",
  },
  Red: {
    value: 2,
    multiplier: 100,
    tolerance: "±2%",
    style: "bg-[#D32F2F] text-white",
  },
  Orange: {
    value: 3,
    multiplier: 1000,
    tolerance: null,
    style: "bg-[#F57C00] text-white",
  },
  Yellow: {
    value: 4,
    multiplier: 10000,
    tolerance: null,
    style: "bg-[#FBC02D] text-black",
  },
  Green: {
    value: 5,
    multiplier: 100000,
    tolerance: "±0.5%",
    style: "bg-[#388E3C] text-white",
  },
  Blue: {
    value: 6,
    multiplier: 1000000,
    tolerance: "±0.25%",
    style: "bg-[#1976D2] text-white",
  },
  Violet: {
    value: 7,
    multiplier: 10000000,
    tolerance: "±0.1%",
    style: "bg-[#7B1FA2] text-white",
  },
  Grey: {
    value: 8,
    multiplier: null,
    tolerance: "±0.05%",
    style: "bg-[#616161] text-white",
  },
  White: {
    value: 9,
    multiplier: null,
    tolerance: null,
    style: "bg-[#f0f0f0] text-black",
  },
  Gold: {
    value: -1,
    multiplier: 0.1,
    tolerance: "±5%",
    style:
      "bg-gradient-to-b from-[#FCD34D] to-[#B45309] text-black shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.4)]",
  },
  Silver: {
    value: -2,
    multiplier: 0.01,
    tolerance: "±10%",
    style:
      "bg-gradient-to-b from-[#C0C0C0] to-[#A9A9A9] text-black shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.4)]",
  },
};

const colorNames = Object.keys(colorData);

// Define valid colors for each band based on standard 4-band resistor rules.
const bandColorOptions = {
  0: colorNames.filter(
    (c) => colorData[c].value > 0 && colorData[c].value <= 9
  ), // Digit 1 (No Black, Gold, Silver)
  1: colorNames.filter(
    (c) => colorData[c].value >= 0 && colorData[c].value <= 9
  ), // Digit 2 (Black-White)
  2: colorNames.filter(
    (c) => colorData[c].multiplier !== null && colorData[c].value !== null
  ), // Multiplier (No Grey, White)
  3: colorNames.filter((c) => colorData[c].tolerance !== null), // Tolerance
};

// Formats large resistance values into kΩ or MΩ with 3 significant figures.
const formatResistance = (value) => {
  if (value === null || isNaN(value)) return "Invalid";
  if (value >= 1000000) {
    return `${(value / 1000000).toPrecision(3)} MΩ`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toPrecision(3)} kΩ`;
  }
  return `${value.toPrecision(3)} Ω`;
};

// --- React Components ---

/**
 * Popup Component for displaying game state messages.
 */
const Popup = ({
  gameState,
  onStart,
  onNext,
  onRetryTurn,
  onRetryLevel,
  level,
  timeRemaining,
  userAnswer,
  targetAnswer,
}) => {
  const popupContent = {
    initial: {
      title: `Welcome to Level ${level}`,
      description:
        "A 4-band resistor problem will be shown. Your goal is to match its color code to the target resistance value within the time limit.\nTo change the colour of the resistor bands, click on them.\nThe first two bands represent digits, the third is a multiplier, and the fourth is tolerance.",
      buttonText: "START SOLVING",
      onClick: onStart,
    },
    won: {
      title: "🎉 Correct! 🎉",
      description: "Resistance matched perfectly. You're a hardcore engineer!",
      scoreText: `Time Remaining: ${timeRemaining}s`,
      buttonText: "NEXT PROBLEM",
      onClick: onNext,
    },
    lost: {
      title: "🤔 Not Quite...",
      description:
        "Your resistor value didn't match the target. Here's a comparison:",
      buttonText: "TRY AGAIN",
      onClick: onRetryTurn,
    },
    timeout: {
      title: "⌛ Time's Up! ⌛",
      description:
        "You ran out of time. Don't worry, precision takes practice.",
      buttonText: "RETRY LEVEL",
      onClick: onRetryLevel,
    },
  };

  if (!popupContent[gameState]) return null;

  const { title, description, scoreText, buttonText, onClick } =
    popupContent[gameState];

  return (
    <div className="absolute inset-0 flex justify-center items-center z-50 p-4">
      <div className="font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-[1.7rem] p-8 text-center max-w-2xl w-full">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-6">{description}</p>

        {gameState === "won" && (
          <div className="my-6 p-4 bg-green-100/80 border-2 border-green-700/50 rounded-lg text-left space-y-3 text-2xl">
            {" "}
            <p className="text-green-800 font-bold">
              🎉 Yeah, Correct! Woohoo! 🎉
            </p>{" "}
            <p>
              <strong>Your Answer:</strong>{" "}
              <span className="text-green-700">
                {formatResistance(userAnswer.value)},{" "}
                {userAnswer.tolerance || "N/A"}
              </span>
            </p>{" "}
            <p>
              <strong>Correct Answer:</strong>{" "}
              <span className="text-green-800">
                {formatResistance(targetAnswer.value)}, {targetAnswer.tolerance}
              </span>
            </p>{" "}
          </div>
        )}

        {gameState === "lost" && (
          <div className="mb-10 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Your Answer Column */}
              <div className="bg-white/50 p-4 rounded-xl  ">
                <p className="text-lg font-[sf-semibold] text-brown-600 mb-0">
                  Your Answer
                </p>
                <p className="text-3xl font-semibold text-red-600">
                  {formatResistance(userAnswer.value)},{" "}
                  {userAnswer.tolerance || "N/A"}
                </p>
              </div>

              {/* Correct Answer Column */}
              <div className="bg-white/50 p-4 rounded-xl ">
                <p className="text-lg font-[sf-semibold] text-brown-600 mb-0">
                  Correct Answer
                </p>
                <p className="text-3xl font-semibold text-green-700">
                  {formatResistance(targetAnswer.value)},{" "}
                  {targetAnswer.tolerance}
                </p>
              </div>
            </div>
          </div>
        )}

        {scoreText && <p className="text-2xl font-bold mb-6">{scoreText}</p>}
        <button
          onClick={onClick}
          className="px-6 py-4 cursor-pointer flex items-center justify-center mx-auto gap-2 text-2xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)] rounded-[28px] hover:scale-110 transition-transform duration-300 ease-out"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

/**
 * Resistor Component to display the resistor and its bands.
 */
const Resistor = ({ bandColors, onBandClick, feedback }) => {
  const getFeedbackClass = () => {
    if (feedback === "wrong") return "animate-shake";
    if (feedback === "correct") return "animate-glow-green";
    return "";
  };

  return (
    <div
      className={`relative flex items-center justify-center my-10 transition-transform duration-500 ${getFeedbackClass()}`}
    >
      {/* Resistor Body */}
      <div className="w-[350px] h-[120px] bg-[#F5DEB3] rounded-[40px] border-4 border-[#D2B48C] shadow-lg flex items-center justify-center relative">
        {/* Glossy Overlay */}
        <div className="absolute w-full h-full rounded-[40px] bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        {/* Resistor Leads */}
        <div className="absolute left-[-80px] top-1/2 -translate-y-1/2 w-[100px] h-[5px] bg-gray-400 z-[2]"></div>
        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[100px] h-[5px] bg-gray-400 z-[2]"></div>

        {/* Color Bands Container - Added relative and z-10 to ensure it's on top */}
        <div className="relative z-[10] flex gap-4 justify-center w-full px-8">
          {bandColors.map((colorName, index) => (
            <div
              key={index}
              onClick={() => onBandClick(index)}
              className={`w-[30px] h-[120px] border-2 border-black/30 cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center text-xs font-sans ${colorData[colorName].style}`}
              title={`Click to change Band ${index + 1}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Main Game Component for Level 3.
 */
export default function LevelThree({ onComplete }) {
  const LEVEL_ID = 3;
  const TIME_LIMIT_SEC = 90;

  const [gameState, setGameState] = useState("initial"); // 'initial', 'playing', 'won', 'lost', 'timeout'
  const [target, setTarget] = useState({ value: 0, tolerance: "±5%" });
  const [bandColors, setBandColors] = useState([
    "Brown",
    "Black",
    "Red",
    "Gold",
  ]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SEC);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'
  const [solvedCount, setSolvedCount] = useState(0);

  const generateNewProblem = useCallback(() => {
    const digit1Color =
      bandColorOptions[0][
        Math.floor(Math.random() * bandColorOptions[0].length)
      ];
    const digit2Color =
      bandColorOptions[1][
        Math.floor(Math.random() * bandColorOptions[1].length)
      ];
    const multiplierColor =
      bandColorOptions[2][
        Math.floor(Math.random() * bandColorOptions[2].length)
      ];
    const toleranceColor =
      bandColorOptions[3][
        Math.floor(Math.random() * bandColorOptions[3].length)
      ];

    const d1 = colorData[digit1Color].value;
    const d2 = colorData[digit2Color].value;
    const mult = colorData[multiplierColor].multiplier;
    const tol = colorData[toleranceColor].tolerance;

    const resistanceValue = (d1 * 10 + d2) * mult;

    setTarget({ value: resistanceValue, tolerance: tol });
    setBandColors(["Brown", "Black", "Red", "Gold"]);
    setFeedback(null);
  }, []);

  const currentUserResistance = useMemo(() => {
    try {
      const [d1Color, d2Color, multColor, tolColor] = bandColors;
      const d1 = colorData[d1Color].value;
      const d2 = colorData[d2Color].value;
      const mult = colorData[multColor].multiplier;
      const tol = colorData[tolColor].tolerance;

      if (d1 < 0 || d2 < 0 || mult === null || tol === null) {
        return { value: null, tolerance: null };
      }

      return { value: (d1 * 10 + d2) * mult, tolerance: tol };
    } catch (e) {
      return { value: null, tolerance: null };
    }
  }, [bandColors]);

  const handleBandClick = useCallback(
    (index) => {
      if (gameState !== "playing") return;

      const options = bandColorOptions[index];
      const currentColor = bandColors[index];
      const currentIndex = options.indexOf(currentColor);
      const nextIndex = (currentIndex + 1) % options.length;

      const newBandColors = [...bandColors];
      newBandColors[index] = options[nextIndex];
      setBandColors(newBandColors);
    },
    [bandColors, gameState]
  );

  const handleCheckAnswer = () => {
    if (gameState !== "playing") return;
    const isCorrect =
      currentUserResistance.value === target.value &&
      currentUserResistance.tolerance === target.tolerance;

    if (isCorrect) {
      setFeedback("correct");
      setGameState("won");
      sounds.success();
    } else {
      setFeedback("wrong");
      setGameState("lost");
      sounds.error();
      setTimeLeft((prev) => Math.max(0, prev - 5));
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const startGame = useCallback(() => {
    generateNewProblem();
    setTimeLeft(TIME_LIMIT_SEC);
    setGameState("playing");
    sounds.start();
  }, [generateNewProblem]);

  const nextProblem = useCallback(() => {
    const newSolvedCount = solvedCount + 1;
    setSolvedCount(newSolvedCount);

    if (newSolvedCount >= 3) {
      if (typeof onComplete === "function") {
        onComplete(); // trigger level complete
      }
    } else {
      generateNewProblem();
      setTimeLeft(TIME_LIMIT_SEC);
      setGameState("playing");
      setFeedback(null);
      sounds.start();
    }
  }, [solvedCount, onComplete, generateNewProblem]);

  const retryTurn = useCallback(() => {
    setFeedback(null);
    setGameState("playing");
  }, []);

  const retryLevel = useCallback(() => {
    setFeedback(null);
    setGameState("initial");
    setSolvedCount(0);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft <= 0) {
      setGameState("timeout");
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      if (timeLeft < 15 && timeLeft % 2 === 0) sounds.tick();
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, timeLeft]);

  useEffect(() => {
    setGameState("initial");
  }, []);

  const timerColorClass =
    timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-[#632911]";

  return (
    <div className="absolute z-30 scale-115 top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 md:p-8 w-full max-w-7xl mx-auto flex flex-col items-center select-none font-[sf-heavy] text-[#632911] text-[1.2rem]">
      <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          .animate-shake { animation: shake 0.5s ease-in-out; }

          @keyframes glow-green {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-glow-green { animation: glow-green 1s ease-in-out; }
        `}</style>

      <Popup
        gameState={gameState}
        onStart={startGame}
        onNext={nextProblem}
        onRetryTurn={retryTurn}
        onRetryLevel={retryLevel}
        level={LEVEL_ID}
        timeRemaining={timeLeft}
        userAnswer={currentUserResistance}
        targetAnswer={target}
      />

      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-5">
          <h1 className="text-4xl font-[sf-heavy] text-[#FFFAE4] shadow-lg">
            Color Code Resistor Challenge
          </h1>
        </header>

        <div className="font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-[1.7rem] p-6 relative">
          <div className="flex justify-between items-center text-xl font-bold mb-6 flex-wrap gap-4">
            <span>
              Stage {LEVEL_ID} (Hardcore) – Problem {solvedCount + 1} of 3
            </span>
            {gameState === "playing" && (
              <>
                <span className="">
                  <span className="font-[sf-bold] text-[#d67d00] mr-2">
                    Target
                  </span>
                  <span className="text-[#632911]">
                    {formatResistance(target.value)}
                  </span>
                  , <span className="text-[#632911]">{target.tolerance}</span>
                </span>
                <span className={timerColorClass}>
                  <span className="font-[sf-bold] text-[#d67d00] ">Time</span>{" "}
                  {timeLeft}s
                </span>
              </>
            )}
          </div>

          <Resistor
            bandColors={bandColors}
            onBandClick={handleBandClick}
            feedback={feedback}
          />

          <div className="flex justify-center mt-14 mb-8">
            <button
              onClick={handleCheckAnswer}
              disabled={gameState !== "playing"}
              className="px-8 py-4 cursor-pointer flex items-center gap-2 text-2xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)] rounded-[28px] hover:scale-110 transition-transform duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Check Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
