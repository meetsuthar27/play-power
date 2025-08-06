import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.avif";
import cutscenes from "./cutscenes"; // Array of { bg, text }
import clickSound from "../assets/sound/click2.mp3";
import entrySound from "../assets/sound/entry.mp3";
import GameLoader from "./GameLoader";

export default function EntryFlow({ onFinish }) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const staticImages = [logo];
    const cutsceneImages = cutscenes.map((scene) => scene.bg);

    const imageUrls = [...staticImages, ...cutsceneImages];

    let loaded = 0;
    imageUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        setProgress(Math.floor((loaded / imageUrls.length) * 100));
        if (loaded === imageUrls.length) {
          setTimeout(() => setImagesLoaded(true), 500); // smooth exit
        }
      };
    });
  }, []);

  const [step, setStep] = useState(-1); // -1 = logo reveal, 0...n = cutscenes

  const currentBg = step === -1 ? cutscenes[0].bg : cutscenes[step].bg;

  const finalIndex = cutscenes.findIndex((scene) => scene.isFinal);

  const handleStart = () => {
    playClick();
    setStep(0);
  };

  const handleNext = () => {
    playClick();
    if (step < cutscenes.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    playClick();
    setStep(cutscenes.length - 1); // Jump to final scene
  };

  const playClick = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const playEntryClick = () => {
    const audio = new Audio(entrySound);
    audio.play();
  };

  return (
    <>
      {!imagesLoaded && <GameLoader progress={progress} />}
      {imagesLoaded && (
        <div className="w-screen h-screen relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBg}
              className="absolute inset-0 bg-cover bg-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ backgroundImage: `url(${currentBg})` }}
            />
          </AnimatePresence>

          {/* Logo Phase */}
          {step === -1 ? (
            <motion.div
              className="flex items-center justify-center h-full relative"
              initial={{ opacity: 0, scale: 2, top: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
            >
              <img src={logo} alt="Game Logo" className="w-[1200px]" />
              <motion.button
                onClick={handleStart}
                className="absolute bottom-50 px-4 py-3 cursor-pointer flex items-center gap-2
    text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911]
    bg-gradient-to-b from-[#FEC547] to-[#F3A01C] 
    shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)] 
    rounded-[18px] [border-radius-smooth:0.6] hover:scale-110 transition-transform duration-300 ease-out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                <span>START GAME</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[1.4em] w-[1.4em]"
                  fill="#D57100"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                className="absolute inset-0 flex items-end justify-center pb-28"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className={cutscenes[step].textBoxClass}>
                  <p
                    dangerouslySetInnerHTML={{ __html: cutscenes[step].text }}
                  />

                  {cutscenes[step].isFinal ? (
                    <div className="flex justify-center mt-10">
                      <button
                        onClick={() => {
                          onFinish();
                          playEntryClick();
                        }}
                        className="px-6 py-3 cursor-pointer text-xl font-[sf-heavy]
                    text-[#632911] border-[3.5px] border-[#632911]
                    bg-gradient-to-b from-[#FEC547] to-[#F3A01C]
                    shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)]
                    rounded-[18px] [border-radius-smooth:0.6] hover:scale-110
                    transition-transform duration-300 ease-out"
                      >
                        {" "}
                        LET’S START
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 mt-10">
                      <button
                        onClick={handleSkip}
                        className="px-4 py-2 cursor-pointer hover:scale-110 transition-transform duration-300 ease-out
                    [border-radius:18px] [border-radius-smooth:0.6] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] 
                    bg-gradient-to-b from-[#8AEEF5] to-[#22C9D8] 
                    shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,255,255,0.4),inset_0_-0.3rem_0_rgba(0,0,0,0.3)]"
                      >
                        <p className="text-[1.2rem]">SKIP</p>
                      </button>
                      <button
                        onClick={handleNext}
                        className="px-4 py-2 cursor-pointer hover:scale-110 transition-transform duration-300 ease-out
                    [border-radius:18px] [border-radius-smooth:0.6] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] 
                    bg-gradient-to-b from-[#FEC547] to-[#F3A01C] 
                    shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)]"
                      >
                        <p className="text-[1.2rem]">NEXT</p>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </>
  );
}
