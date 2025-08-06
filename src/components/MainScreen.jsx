import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import cutscenes from "./cutscenes";
import clickSound from "../assets/sound/click2.mp3";
import inventorySound from "../assets/sound/inventory.mp3";
import nanoSound from "../assets/sound/nano.mp3";
import nanoByeSound from "../assets/sound/nanobye.mp3";
import entrySound from "../assets/sound/entry.mp3";
import mainBG from "../assets/final.png";
import tableBG from "../assets/table.png";
import upperBG from "../assets/upperplate.png";
import topBG from "../assets/topplate.png";
import uncle1 from "../assets/people/uncle1.png";
import nanokaka1 from "../assets/people/nanokaka1.png";
import uncle2 from "../assets/people/uncle2.png";

import coinIcon from "../assets/icons/currency.png";
import pauseIcon from "../assets/icons/pause.svg";
import exitIcon from "../assets/icons/exit.svg";
import bulbIcon from "../assets/icons/bulb.png";
import closeIcon from "../assets/icons/close.svg";
import inventoryIcon from "../assets/icons/inventory.png";
import nanokakaIcon from "../assets/icons/nanokaka.png";
import LevelOne from "./LevelOne";
import LevelTwo from "./LevelTwo";
import LevelThree from "./LevelThree";
import LevelFour from "./LevelFour";
import LevelFive from "./LevelFive";

export default function MainScreen() {
  const [currentUncle, setCurrentUncle] = useState(0);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [showInventory, setShowInventory] = useState(false);
  const [showNanoKaka, setShowNanoKaka] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [gameState, setGameState] = useState("main");
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationIndex, setExplanationIndex] = useState(0);
  const [showHappyUncle, setShowHappyUncle] = useState(false);
  const [showHappyUncleAfterExplanation, setShowHappyUncleAfterExplanation] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [coins, setCoins] = useState(0);
  
  const levelComponents = [LevelOne, LevelTwo, LevelThree, LevelFour, LevelFive];
  const CurrentLevel = levelComponents[currentLevel - 1];

  const playClick = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const playInventoryClick = () => {
    const audio = new Audio(inventorySound);
    audio.play();
  };

  const playNanoClick = () => {
    const audio = new Audio(nanoSound);
    audio.play();
  };

  const playNanoByeClick = () => {
    const audio = new Audio(nanoByeSound);
    audio.volume = 0.3; // Set volume to 30%
    audio.play();
  };

  const handleNextDialog = () => {
    playClick();
    if (dialogIndex < levelProblems[`level${currentLevel}`].problemDialog.length - 1) {
      setDialogIndex((prev) => prev + 1);
    } else {
      setShowDialog(false);
      setGameState("level");
    }
  };

  const handleSolve = () => {
    playClick();
    setGameState("level");
    setShowDialog(false);
  };

  const finishLevel = () => {
    // Award coins for completing the level
    const levelPrice = levelProblems[`level${currentLevel}`].Price;
    setCoins(prev => prev + levelPrice);
    
    // Move to main screen to show level completion
    setGameState("levelCompleted");
    // Show level completion popup first, then happy uncle
    setTimeout(() => {
      setGameState("main");
      setShowHappyUncle(true);
      setTimeout(() => {
        setShowHappyUncle(false);
        // Then show Nano Kaka explanation
        setShowExplanation(true);
        setExplanationIndex(0);
      }, 2000);
    }, 3000); // Show completion message for 3 seconds
  };

  const handleNextExplanation = () => {
    playClick();
    if (explanationIndex < levelProblems[`level${currentLevel}`].LearningsDialog.length - 1) {
      setExplanationIndex((prev) => prev + 1);
    } else {
      setShowExplanation(false);
      // Show happy uncle after explanation is complete, then move to next level
      setShowHappyUncleAfterExplanation(true);
      setTimeout(() => {
        setShowHappyUncleAfterExplanation(false);
        if (currentLevel < 5) {
          setCurrentLevel((prev) => prev + 1);
          setDialogIndex(0);
          setGameState("main");
        } else {
          setGameState("completed");
        }
      }, 2000); // Show happy uncle for 2 seconds
    }
  };

  const handleHintPurchase = (price) => {
    if (coins >= price) {
      setCoins(prev => prev - price);
      playClick();
      // You can add hint display logic here
      // For now, just a simple alert or console log
      console.log(`Purchased hint for ${price} coins`);
      // TODO: Display appropriate hint based on current level and price tier
    } else {
      // Not enough coins
      console.log("Not enough coins for this hint");
      // You can show a message to the user here
    }
  };

  const uncles = [uncle1, uncle2]; //todo 

  const problems = [
    {
      dialog: [
        "Arrey beta, mera light ka instrument kaam nahi kar raha...",
        "Lagta hai kuch wire connection mein dikkat hai...",
        "Zara dekh ke solve kar do na...",
      ],
    },
    {
      dialog: [
        "Second uncle ka issue yahaan aayega...",
        "Aur woh solve karna padega...",
      ],
    },
  ];

  // character before and after completion (image and dialog)-> Nano Kaka Explains the solution of concepts -> Customer Before(image and dialog) -> Level 2 Prepration (game) -> Customer After  (image and dialog)-> Nano Kaka Explains the solution of concepts

  // collect price of particular level after solving the level (inside dialog box)

  const levels=[]
  const levelProblems={
    "level1":{
      "Name":"LevelOne",
      "problemDialog":[
              "Arrey beta, mera light ka instrument kaam nahi kar raha...",
              "Lagta hai kuch wire connection mein dikkat hai...",
              "Zara dekh ke solve kar do na...",
            ],
      "messageDialog":["Thank you for your help! I'll be back soon!"],
      "CustomerBefore":uncle1,  
      "CustomerAfter":uncle2,
      "LearningHeading":"Magnetic Field and Compass",
      "LearningsDialog":[
        "Beta, ye compass needle magnetic field ke direction mein point karta hai!",
        "Jab battery connect karte hain, toh current flow hota hai wire mein...",
        "Current flow se magnetic field create hota hai around wire...",
        "Compass needle is magnetic field ke direction mein align ho jata hai!",
        "East direction ke liye positive terminal right side hona chahiye...",
        "West direction ke liye negative terminal right side hona chahiye..."
      ],
      "Price":100,
    }, 
    "level2":{
      "Name":"LevelTwo",
      "problemDialog":[
              "Arrey beta, mera circuit mein short circuit ho gaya hai...",
              "Koi wire touch kar rahi hai ya koi component fault hai...",
              "Zara check karke bata do kahan problem hai...",
            ],
      "messageDialog":["Thank you for your help! I'll be back soon!"],
     "CustomerBefore":uncle1,  
      "CustomerAfter":uncle2,
      "LearningHeading":"Short Circuit Detection",
      "LearningsDialog":[
        "Short circuit mein current normal path se bypass ho jata hai!",
        "High current flow hota hai jo components ko damage kar sakta hai...",
        "Multimeter se resistance check karke short circuit detect kar sakte hain...",
        "Low resistance ya zero resistance short circuit ka sign hai...",
        "Visual inspection mein overlapping wires ya damaged insulation dekh sakte hain..."
      ],
      "Price":150,
    }, 
    "level3":{
      "Name":"LevelThree",
      "problemDialog":[
              "Arrey beta, mera LED bulb flicker kar raha hai...",
              "Lagta hai voltage ya current mein koi problem hai...",
              "Zara check karke fix kar do na...",
            ],
      "messageDialog":["Thank you for your help! I'll be back soon!"],
      "CustomerBefore":uncle1,  
      "CustomerAfter":uncle2,
      "LearningHeading":"LED and Voltage Regulation",
      "LearningsDialog":[
        "LED ko specific voltage range chahiye proper glow ke liye...",
        "Too much voltage LED ko damage kar sakta hai...",
        "Too less voltage LED dim ya off ho jayega...",
        "Resistor series mein connect karke voltage regulate kar sakte hain...",
        "Ohm's Law: V = I × R, current control karke voltage regulate hota hai..."
      ],
      "Price":200,
    }, 
    "level4":{
      "Name":"LevelFour",
      "problemDialog":[
              "Arrey beta, mera motor speed control nahi ho raha...",
              "Variable speed chahiye but constant speed aa raha hai...",
              "Zara check karke fix kar do na...",
            ],
      "messageDialog":["Thank you for your help! I'll be back soon!"],
      "CustomerBefore":uncle1,  
      "CustomerAfter":uncle2,
      "LearningHeading":"Motor Speed Control",
      "LearningsDialog":[
        "DC motor ki speed voltage aur current pe depend karti hai...",
        "PWM (Pulse Width Modulation) se speed control kar sakte hain...",
        "Potentiometer se voltage divide karke speed control hota hai...",
        "Higher voltage = Higher speed, Lower voltage = Lower speed...",
        "Variable resistor se resistance change karke current control hota hai..."
      ],
      "Price":250,
    }, 
    "level5":{
      "Name":"LevelFive",
      "problemDialog":[
              "Arrey beta, mera sensor circuit kaam nahi kar raha...",
              "Light sensor ya temperature sensor ka output sahi nahi aa raha...",
              "Zara check karke calibrate kar do na...",
            ],
      "messageDialog":["Thank you for your help! I'll be back soon!"],
      "CustomerBefore":uncle1,  
      "CustomerAfter":uncle2,
      "LearningHeading":"Sensor Calibration",
      "LearningsDialog":[
        "Sensors ko proper calibration chahiye accurate readings ke liye...",
        "Zero point aur sensitivity adjust karni padti hai...",
        "Reference values se compare karke calibration hota hai...",
        "Environmental factors affect sensor readings...",
        "Regular calibration ensures accurate measurements..."
      ],
      "Price":300,
    }, 
}

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key="main-bg"
          className="absolute inset-0 bg-cover bg-center z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{ backgroundImage: `url(${mainBG})` }}
        />

        {gameState === "main" && (
          <>
            {/* Uncle Image */}
            <motion.div className="absolute -bottom-15 left-[63%] -translate-x-1/2 w-[530px] z-10">
              <motion.img
                key={`uncle-${currentUncle}`}
                src={showHappyUncle || showHappyUncleAfterExplanation ? levelProblems[`level${currentLevel}`].CustomerAfter : levelProblems[`level${currentLevel}`].CustomerBefore}
                alt="Uncle Character"
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scaleX: [1, 1, 1.015, 1],
                  scaleY: [1, 1.005, 1, 1],
                }}
                exit={{ opacity: 0, y: 30 }}
                transition={{
                  opacity: { duration: 0.6 },
                  y: { duration: 0.6 },
                  scaleX: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    times: [0, 0.3, 0.7, 1],
                  },
                  scaleY: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    times: [0, 0.3, 0.7, 1],
                  },
                }}
              />
            </motion.div>

            {/* ❓ Button outside uncle */}
            {!showDialog && !showHappyUncle && !showHappyUncleAfterExplanation && (
              <div className="absolute bottom-170 left-[63%] -translate-x-1/2 flex flex-col items-center z-[40] pointer-events-auto">
                <div className="absolute w-15 h-15 rounded-full bg-[#8AEEF5] opacity-90 animate-ping" />
                <button
                  onClick={() => {
                    playClick();
                    setShowDialog(true);
                  }}
                  className="relative w-15 h-15 rounded-full flex items-center justify-center text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#8AEEF5] to-[#22C9D8] shadow-[0_0.2rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,255,255,0.4),inset_0_-0.3rem_0_rgba(0,0,0,0.3)] border-radius-smooth hover:scale-125 transition-transform duration-300 ease-out cursor-pointer font-[sf-heavy] text-[2rem]"
                >
                  ?
                </button>
              </div>
            )}
          </>
        )}

        {/* Happy Uncle Message */}
        {showHappyUncle && gameState === "main" && (
          <div className="absolute top-30 left-1/2 transform -translate-x-1/2 px-8 py-6 max-w-3xl z-30 font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.4rem_0_rgba(0,0,0,0.3),inset_0_0.4rem_0_rgba(255,255,255,0.7),inset_0_-0.4rem_0_rgba(0,0,0,0.2)] rounded-[25px] border-radius-smooth text-center">
            <p className="text-2xl mb-4">
              {levelProblems[`level${currentLevel}`].messageDialog[0]}
            </p>
          </div>
        )}

        {/* Happy Uncle After Explanation Message */}
        {showHappyUncleAfterExplanation && gameState === "main" && (
          <div className="absolute top-30 left-1/2 transform -translate-x-1/2 px-8 py-6 max-w-3xl z-30 font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.4rem_0_rgba(0,0,0,0.3),inset_0_0.4rem_0_rgba(255,255,255,0.7),inset_0_-0.4rem_0_rgba(0,0,0,0.2)] rounded-[25px] border-radius-smooth text-center">
            <p className="text-2xl mb-4">
              Ready for the next challenge!
            </p>
          </div>
        )}

        <motion.div
          key="upper-bg"
          className="absolute inset-0 bg-cover bg-center z-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ backgroundImage: `url(${upperBG})` }}
        />

        <motion.div
          key="top-bg"
          className="absolute inset-0 bg-cover bg-center z-15"
          initial={{ opacity: 1 }}
          animate={{
            opacity: 1,
            scaleX: [1, 1, 1.07, 1], // gentle horizontal stretch at end
            scaleY: [1, 1.025, 1, 1], // slight vertical lift at start
          }}
          exit={{ opacity: 1 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1], // matches the timing of the scale steps
          }}
          style={{ backgroundImage: `url(${topBG})` }}
        />
      </AnimatePresence>

      <button
        onClick={playClick}
        className="absolute top-6 left-6 z-35 flex items-center gap-4 px-5 h-16 min-w-[100px] cursor-pointer font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FDDCA5] to-[#F4C06A] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,255,255,0.4),inset_0_-0.4rem_0_rgba(0,0,0,0.3)] rounded-[18px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out"
      >
        <img src={coinIcon} alt="Coins" className="w-10 h-10" />
        <span className="text-2xl">{coins}</span>
      </button>

      <div className="absolute top-6 right-6 z-35 flex gap-2">
        {[pauseIcon, exitIcon].map((icon, i) => (
          <button
            key={i}
            onClick={playClick}
            className="flex items-center justify-center w-16 h-16 cursor-pointer text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FDDCA5] to-[#F4C06A] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,255,255,0.4),inset_0_-0.4rem_0_rgba(0,0,0,0.3)] rounded-[18px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out"
          >
            <img src={icon} alt={`icon-${i}`} className="w-6 h-6" />
          </button>
        ))}
        <button
          key="music-toggle"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("toggle-music"));
            playClick();
          }}
          className="flex items-center justify-center w-16 h-16 cursor-pointer text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FDDCA5] to-[#F4C06A] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,255,255,0.4),inset_0_-0.4rem_0_rgba(0,0,0,0.3)] rounded-[18px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out"
        >
          {window.__musicOn ? (
            <svg
              width="24"
              height="24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-volume-2"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-volume-x"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="22" x2="16" y1="9" y2="15" />
              <line x1="16" x2="22" y1="9" y2="15" />
            </svg>
          )}
        </button>
      </div>

      <button
        onClick={() => {
          playInventoryClick();
          setShowInventory(true);
        }}
        className="absolute bottom-8 left-6 z-35 flex flex-col pb-5 pt-10 px-7 cursor-pointer font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,246,133,0.5),inset_0_-0.4rem_0_rgba(207,102,8,0.6)] rounded-[30px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out items-start"
      >
        <img
          src={inventoryIcon}
          alt="Inventory"
          className="w-25 h-25 absolute -translate-y-20 translate-x-20"
        />
        <span className="text-[#CF6F00]">OPEN</span>
        <span className="text-3xl">INVENTORY</span>
      </button>

      <button
        onClick={() => {
          playNanoClick();
          setShowNanoKaka(true);
        }}
        className="absolute bottom-8 right-6 z-35 flex flex-col pb-5 pt-10 px-7 cursor-pointer font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,246,133,0.5),inset_0_-0.4rem_0_rgba(207,102,8,0.6)] rounded-[30px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out items-end"
      >
        <img
          src={nanokakaIcon}
          alt="Nano Kaka"
          className="w-25 h-25 absolute -translate-y-20 -translate-x-20"
        />
        <span className="text-[#CF6F00]">ASK</span>
        <span className="text-3xl">NANO KAKA</span>
      </button>

      {showDialog && (
        <div className="absolute top-30 left-1/2 transform -translate-x-1/2 px-8 py-6 max-w-3xl z-30 font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.4rem_0_rgba(0,0,0,0.3),inset_0_0.4rem_0_rgba(255,255,255,0.7),inset_0_-0.4rem_0_rgba(0,0,0,0.2)] rounded-[25px] border-radius-smooth">
          <p className="text-2xl mb-4">
            {levelProblems[`level${currentLevel}`].problemDialog[dialogIndex]}
          </p>
          {dialogIndex < levelProblems[`level${currentLevel}`].problemDialog.length - 1 ? (
            <button
              onClick={handleNextDialog}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSolve}
              className="bg-yellow-500 text-[#632911] px-4 py-2 rounded"
            >
              Solve
            </button>
          )}
        </div>
      )}

      {/* Nano Kaka Explanation Popup */}
      {showExplanation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pt-30 pb-8 px-6">
          <div className="p-14 px-16 pb-7 w-full h-full font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] border-radius-smooth flex flex-col gap-4 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                playNanoByeClick();
                setShowExplanation(false);
                // Show happy uncle after explanation is complete, then move to next level
                setShowHappyUncleAfterExplanation(true);
                setTimeout(() => {
                  setShowHappyUncleAfterExplanation(false);
                  if (currentLevel < 5) {
                    setCurrentLevel((prev) => prev + 1);
                    setDialogIndex(0);
                    setGameState("main");
                  } else {
                    setGameState("completed");
                  }
                }, 2000); // Show happy uncle for 2 seconds
              }}
              className="absolute top-6 right-6 flex items-center justify-center w-13 h-13 cursor-pointer font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,246,133,0.5),inset_0_-0.4rem_0_rgba(207,102,8,0.6)] rounded-[18px] hover:scale-105 transition-transform duration-300 ease-out text-3xl"
            >
              <img src={closeIcon} alt="close icon" className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-4xl leading-snug">
                <span className="text-[#D36D04]">
                  {levelProblems[`level${currentLevel}`].LearningHeading}
                </span>
                <br />
                <span className="text-[#3C1A00] text-5xl">
                  NANO KAKA Explains!
                </span>
              </h2>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg text-[#632911]">
                  Step {explanationIndex + 1} of {levelProblems[`level${currentLevel}`].LearningsDialog.length}
                </span>
                <div className="flex gap-1">
                  {levelProblems[`level${currentLevel}`].LearningsDialog.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index <= explanationIndex ? 'bg-[#632911]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Explanation Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex gap-8 items-start">
                {/* Text Content */}
                <div className="flex-1">
                  <p className="text-2xl leading-relaxed">
                    {levelProblems[`level${currentLevel}`].LearningsDialog[explanationIndex]}
                  </p>
                </div>

                {/* Character Illustration */}
                <div className="w-[450px] h-auto pointer-events-none">
                  <img src={nanokaka1} alt="Nano Kaka" className="w-full h-auto" />
                </div>
              </div>
            </div>

            {/* Navigation Button - Fixed Position */}
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={handleNextExplanation}
                className="px-12 py-6 bg-gradient-to-b from-[#FEC547] to-[#F3A01C] text-[#632911] border-[4px] border-[#632911] shadow-[0_0.6rem_0_rgba(62,22,1,1),inset_0_0.6rem_0_rgba(255,246,133,0.5),inset_0_-0.6rem_0_rgba(207,102,8,0.6)] rounded-[20px] text-3xl font-[sf-heavy] hover:scale-110 transition-transform duration-300 ease-out"
              >
                {explanationIndex < levelProblems[`level${currentLevel}`].LearningsDialog.length - 1 ? "Next Step" : "Got It!"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showInventory && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pt-30 pb-8 px-6">
          <div className="p-7 pb-7 w-full h-full font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#BD7942] to-[#974B0C] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.2),inset_0_-0.6rem_0_rgba(0,0,0,0.3)] rounded-[35px] border-radius-smooth flex flex-col gap-4">
            <div className="flex justify-between items-center align-middle">
              <h1 className="text-[2.7rem]  text-[#3E1601] uppercase">
                Inventory
              </h1>
              <button
                onClick={() => {
                  playInventoryClick();
                  setShowInventory(false);
                }}
                className="  flex items-center justify-center w-13 h-13 cursor-pointer font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,246,133,0.5),inset_0_-0.4rem_0_rgba(207,102,8,0.6)] rounded-[18px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out text-3xl"
              >
                <img src={closeIcon} alt="close icon" className="w-6 h-6" />
              </button>
            </div>

            <div className="w-full h-full font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFB862] to-[#E28B22] shadow-[inset_0_0.6rem_0_rgba(255,255,255,0.3),inset_0_-0.6rem_0_rgba(0,0,0,0.3)] rounded-[20px] border-radius-smooth "></div>
          </div>
        </div>
      )}

      {showNanoKaka && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pt-30 pb-8 px-6">
          <div className="p-14 px-16 pb-7 w-full h-full font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] border-radius-smooth flex flex-col gap-4 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                playNanoByeClick();
                setShowNanoKaka(false);
              }}
              className="absolute top-6 right-6 flex items-center justify-center w-13 h-13 cursor-pointer font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,246,133,0.5),inset_0_-0.4rem_0_rgba(207,102,8,0.6)] rounded-[18px] hover:scale-105 transition-transform duration-300 ease-out text-3xl"
            >
              <img src={closeIcon} alt="close icon" className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-4xl leading-snug">
                <span className="text-[#D36D04]">
                  Stuck In Any Problem? Don't Worry...
                </span>
                <br />
                <span className="text-[#3C1A00] text-5xl">
                  NANO KAKA is here!
                </span>
              </h2>
              <p className="text-lg leading-snug mt-2">
                Each hint will cost you game rupees, so use them wisely! <br />
                Nano Kaka will first drop subtle clues...
                <br />
                Ask more, and he'll get clearer — but also charge more!
              </p>
            </div>

            {/* Hint Options */}
            <div className="flex gap-6 justify-start mt-4">
              {[50, 100, 200].map((price, idx) => (
                <button
                  key={price}
                  onClick={() => handleHintPurchase(price)}
                  disabled={coins < price}
                  className={`flex flex-col items-center justify-center px-6 py-4 rounded-[18px] shadow-[0_0.3rem_0_rgba(100,60,0,0.4)] border-[3px] border-[#7B3D00] hover:scale-105 transition-transform duration-300 ease-out ${
                    coins < price 
                      ? 'bg-gray-400 opacity-50 cursor-not-allowed' 
                      : 'bg-[#FCD472] cursor-pointer'
                  }`}
                >
                  <img src={bulbIcon} alt="Hint" className="w-10 h-10 mb-1" />
                  <span className="text-lg font-bold">{price}</span>
                </button>
              ))}
            </div>

            {/* Character Illustration */}
            <div className="absolute right-20 bottom-0 w-[450px] h-auto pointer-events-none ">
              <img src={nanokaka1} alt="Nano Kaka" className="w-full h-auto" />
            </div>
          </div>
        </div>
      )}

      {gameState === "level" && CurrentLevel && (
        <>
          <motion.div
            key="main-bg"
            className="absolute inset-0 bg-cover bg-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ backgroundImage: `url(${tableBG})` }}
          />

          <CurrentLevel onComplete={finishLevel} />
        </>
      )}

      {gameState === "levelCompleted" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="p-14 px-16 pb-7 w-[600px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-2xl text-center">
            <h2 className="text-4xl mb-4">🎉 Level {currentLevel} Complete! 🎉</h2>
            <p className="text-xl mb-6">You have successfully completed Level {currentLevel}!</p>
            <p className="text-lg">You earned {levelProblems[`level${currentLevel}`].Price} coins!</p>
          </div>
        </div>
      )}

      {gameState === "completed" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="p-14 px-16 pb-7 w-[600px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-2xl text-center">
            <h2 className="text-4xl mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-xl mb-6">You have completed all levels!</p>
            <p className="text-lg">You are now a master of electrical concepts!</p>
          </div>
        </div>
      )}
    </div>
  );
}
