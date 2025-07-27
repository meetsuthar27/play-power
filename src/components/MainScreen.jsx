import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import cutscenes from "./cutscenes";
import clickSound from "../assets/sound/click2.mp3";
import entrySound from "../assets/sound/entry.mp3";
import mainBG from "../assets/final.png";
import upperBG from "../assets/upperplate.png";
import topBG from "../assets/topplate.png";
import uncle1 from "../assets/people/uncle1.png";
import uncle2 from "../assets/people/uncle2.png";

import coinIcon from "../assets/icons/currency.png";
import pauseIcon from "../assets/icons/pause.svg";
import exitIcon from "../assets/icons/exit.svg";
import inventoryIcon from "../assets/icons/inventory.png";
import nanokakaIcon from "../assets/icons/nanokaka.png";

export default function MainScreen() {
  const [currentUncle, setCurrentUncle] = useState(0);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [showInventory, setShowInventory] = useState(false);
  const [showNanoKaka, setShowNanoKaka] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [gameState, setGameState] = useState("main");

  const playClick = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const handleNextDialog = () => {
    playClick();
    if (dialogIndex < problems[currentUncle].dialog.length - 1) {
      setDialogIndex((prev) => prev + 1);
    } else {
      setShowDialog(false);
    }
  };

  const handleSolve = () => {
    playClick();
    setGameState("level");
  };

  const finishLevel = () => {
    setCurrentUncle((prev) => prev + 1);
    setDialogIndex(0);
    setShowDialog(false);
    setGameState("main");
  };

  const uncles = [uncle1, uncle2];

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
          <motion.div className="absolute -bottom-15 left-[63%] -translate-x-1/2 w-[530px] z-10 ">
            <motion.img
              key={`uncle-${currentUncle}`}
              src={uncles[currentUncle]}
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

            {!showDialog && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-40">
                <div className="w-12 h-12 rounded-full bg-yellow-400 opacity-70 animate-ping absolute" />
                <button
                  onClick={() => {
                    playClick();
                    setShowDialog(true);
                  }}
                  className="cursor-pointer relative w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-xl border-2 border-[#632911]"
                >
                  ❓
                </button>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          key="upper-bg"
          className="absolute inset-0 bg-cover bg-center z-10"
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
        className="absolute top-6 left-6 z-20 flex items-center gap-4 px-5 h-16 min-w-[100px] cursor-pointer font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,246,133,0.5),inset_0_-0.4rem_0_rgba(207,102,8,0.6)] rounded-[18px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out"
      >
        <img src={coinIcon} alt="Coins" className="w-10 h-10" />
        <span className="text-2xl">123</span>
      </button>

      <div className="absolute top-6 right-6 z-20 flex gap-2">
        {[pauseIcon, exitIcon].map((icon, i) => (
          <button
            key={i}
            onClick={playClick}
            className="flex items-center justify-center w-16 h-16 cursor-pointer text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,246,133,0.5),inset_0_-0.4rem_0_rgba(207,102,8,0.6)] rounded-[18px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out"
          >
            <img src={icon} alt={`icon-${i}`} className="w-6 h-6" />
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          playClick();
          setShowInventory(true);
        }}
        className="absolute bottom-8 left-6 z-20 flex flex-col pb-5 pt-10 px-7 cursor-pointer font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,246,133,0.5),inset_0_-0.4rem_0_rgba(207,102,8,0.6)] rounded-[30px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out items-start"
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
          playClick();
          setShowNanoKaka(true);
        }}
        className="absolute bottom-8 right-6 z-20 flex flex-col pb-5 pt-10 px-7 cursor-pointer font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.4rem_0_rgba(62,22,1,1),inset_0_0.4rem_0_rgba(255,246,133,0.5),inset_0_-0.4rem_0_rgba(207,102,8,0.6)] rounded-[30px] border-radius-smooth hover:scale-105 transition-transform duration-300 ease-out items-end"
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
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white/90 px-8 py-6 max-w-xl text-[#632911] rounded-xl shadow-xl z-30">
          <p className="text-lg mb-4">
            {problems[currentUncle].dialog[dialogIndex]}
          </p>
          {dialogIndex < problems[currentUncle].dialog.length - 1 ? (
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

      {showInventory && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-md">
            <h2 className="text-xl font-bold mb-4">Your Inventory</h2>
            <button
              onClick={() => {
                playClick();
                setShowInventory(false);
              }}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showNanoKaka && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-md">
            <h2 className="text-xl font-bold mb-4">Nano Kaka's Help</h2>
            <p>Tip: Check the fuse first!</p>
            <button
              onClick={() => {
                playClick();
                setShowNanoKaka(false);
              }}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {gameState === "level" && (
        <div className="absolute inset-0 z-50 bg-black text-white flex items-center justify-center">
          <p>This is where the circuit puzzle will go...</p>
          <button onClick={finishLevel} className="ml-4 px-4 py-2 bg-green-500">
            Finish Level
          </button>
        </div>
      )}
    </div>
  );
}
