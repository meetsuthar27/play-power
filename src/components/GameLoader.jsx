import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const rotatingTexts = [
  "Loading assets...",
  "Fun Fact: Nikola Tesla once imagined wireless power grids.",
  "Did you know: Sound travels faster in steel than air.",
  "Loading character animations...",
  "Almost there...",
  "Initializing circuits...",
];

export default function GameLoader({ progress }) {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-[#150c02] text-white flex flex-col items-center justify-center z-[9999] font-[sf-heavy]"
        initial={{ opacity: 1 }}
        animate={{ opacity: progress >= 100 ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Game Logo or Placeholder */}
        <motion.div
          className="text-3xl md:text-5xl mb-12 tracking-wide"
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: [1, 1.02, 1], opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          PowerPlay
        </motion.div>

        {/* Progress Bar */}
        <div className="w-[300px] h-6 bg-[#ffffff22] rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Percentage */}
        <div className="text-lg text-yellow-400 mb-6">{progress}%</div>

        {/* Rotating Messages */}
        <motion.div
          key={textIndex}
          className="text-sm text-white/80 max-w-md text-center px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {rotatingTexts[textIndex]}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
