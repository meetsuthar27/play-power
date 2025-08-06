import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cutscenes from "./cutscenes";
import clickSound from "../assets/sound/click2.mp3";
import inventorySound from "../assets/sound/inventory.mp3";
import nanoSound from "../assets/sound/nano.mp3";
import nanoByeSound from "../assets/sound/nanobye.mp3";
import entrySound from "../assets/sound/entry.mp3";
import mainBG from "../assets/final.avif";
import tableBG from "../assets/table.avif";
import upperBG from "../assets/upperplate.avif";
import topBG from "../assets/topplate.avif";
import uncle1 from "../assets/people/uncle1.avif";
import nanokaka1 from "../assets/people/nanokaka1.avif";
import nanokaka2 from "../assets/people/nanokaka2.avif";
import uncle2 from "../assets/people/uncle2.avif";
import man1 from "../assets/people/man1.avif";
import man2 from "../assets/people/man2.avif";
import lady1 from "../assets/people/lady1.avif";
import lady2 from "../assets/people/lady2.avif";
import kid1 from "../assets/people/kid1.avif";
import kid2 from "../assets/people/kid2.avif";
import teacher1 from "../assets/people/teacher1.avif";
import teacher2 from "../assets/people/teacher2.avif";

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
  const [showHappyUncleAfterExplanation, setShowHappyUncleAfterExplanation] =
    useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [coins, setCoins] = useState(1000);

  const [currentHint, setCurrentHint] = useState("");

  const levelComponents = [
    LevelOne,
    LevelTwo,
    LevelThree,
    LevelFour,
    LevelFive,
  ];
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
    if (
      dialogIndex <
      levelProblems[`level${currentLevel}`].problemDialog.length - 1
    ) {
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
    setCoins((prev) => prev + levelPrice);

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
      }, 6000);
    }, 5000); // Show completion message for 3 seconds
  };

  const handleNextExplanation = () => {
    playClick();
    if (
      explanationIndex <
      levelProblems[`level${currentLevel}`].LearningsDialog.length - 1
    ) {
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
    if (coins < price) return;

    setCoins(coins - price);

    // Sample hints based on price
    let hint = "";
    if (price === 50) hint = "Try checking the left corner of the room.";
    else if (price === 100) hint = "The answer involves the red object.";
    else if (price === 200) hint = "Click the lever near the broken panel.";

    setCurrentHint(hint); // Update the hint shown
    playClick(); // Optional sound
  };

  const handlePrevExplanation = () => {
    playNanoClick();
    setExplanationIndex((prev) => Math.max(0, prev - 1));
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

  const levels = [];
  const levelProblems = {
    level1: {
      Name: "LevelOne",
      problemDialog: [
        "Arrey beta… you’ve opened up this new repair shop, na? That’s why I thought, let me come to you directly.",
        "See this little instrument? It’s been with me for years—used to light up beautifully. I use it every evening when I sit outside with my newspaper and a cup of chai.",
        "But yesterday, it just blinked once… and then nothing. Dead silent since then.",
        "I think there’s some issue with the connection… or maybe the current isn’t flowing properly. Can’t say for sure, my eyes aren’t what they used to be.",
        "Zara dekh lo na, beta. I’d really appreciate it if you could get it working again. These small things… they matter a lot when you’ve seen as many years as I have.",
      ],
      messageDialog: [
        "Ahh… it’s working again! Look at that glow — just like old times. Thank you, truly. Not just for fixing a machine, but for giving an old man a bit of his routine back.",
      ],
      CustomerBefore: uncle1,
      CustomerAfter: uncle2,
      LearningHeading: "Magnetic Field and Compass",
      LearningsDialog: [
        "A compass needle always aligns itself with the direction of the magnetic field. When a battery is connected, electric current begins to flow through the wire. This current generates a magnetic field around the wire — a basic principle of electromagnetism.",

        "The compass needle senses this magnetic field and turns to align with it. To make the needle point East, the positive terminal should be on the right side of the wire. To make it point West, the positive terminal should be on the left side.",

        "This follows the Right-Hand Rule — current direction determines magnetic field direction.",
      ],
      Price: 100,
    },
    level2: {
      Name: "LevelTwo",
      problemDialog: [
        "Hey! So… I recently started this little DIY photography project at home.",
        "I found this old lens lying around and thought — why not build my own light setup and play with shadows, reflections, all that artsy stuff?",
        "But there’s a tiny problem. No matter where I place the object or how I hold the lens, the image either goes completely out of focus… or ends up in a weird spot.",
        "I’ve been shifting things around for hours — it’s like a science puzzle I can't quite solve.",
        "You seem to know your way around circuits and optics. Think you could help me line it all up? I just want the image to land perfectly on the backdrop — clear, sharp, cinematic.",
      ],
      messageDialog: [
        "Whoa… that’s exactly what I was trying to do! It’s sharp, it’s clean, it’s literally perfect. Thank you! I knew there was some science behind it, but you just made it all click. Now I can finally start shooting for real.",
      ],
      CustomerBefore: lady1,
      CustomerAfter: lady2,
      LearningHeading: "Optics and Image Formation",
      LearningsDialog: [
        "Lenses bend light to form images. How and where those images appear depends on the object's position and the lens's focal length.",

        "When an object is placed - beyond the focal point, the lens forms a real, inverted image on the opposite side. This type of image can be projected onto a screen.",

        "When the object is within the focal length, the lens forms a virtual, upright, and magnified image — perfect for magnifying glasses or phone macro lenses.",

        "By adjusting the object distance and the focal length, we can control the position and nature of the image. This is the core principle behind image formation in convex lenses.",
      ],
      Price: 150,
    },
    level3: {
      Name: "LevelThree",
      problemDialog: [
        "Hey there! I’m working on repairing an old radio from my college days — still trying to keep the analog spirit alive, you know?",
        "The sound was getting fuzzy, and turns out a few resistors inside were either burned out or mismatched.",
        "I’ve got a whole bunch of spare resistors, but these color bands… man, they always confuse me.",
        "Each one’s got stripes like a code language, and I need to match the exact resistance values to get the circuit stable again.",
        "Think you could help me out? I just need to assemble a few - three to be precise - correct ones by picking the right colors in the right order. Can’t risk frying the circuit again!",
      ],
      messageDialog: [
        "Perfect! That’s the exact resistance values I needed. The audio’s clean, the board’s stable — good as new! I don’t know how you did it so quickly, but you clearly understand how these color codes work. Really appreciate it, buddy!",
      ],
      CustomerBefore: man1,
      CustomerAfter: man2,
      LearningHeading: "Resistors and Color Code Reading",
      LearningsDialog: [
        "Resistors control the flow of electrical current in a circuit by providing resistance, measured in ohms (Ω). Each resistor has colored bands printed on it, which represent its value using a standardized color code system.",

        "Typically, a 4-band resistor uses the first band for the first digit, the second band for the second digit, the third band as a multiplier (number of zeros), and the fourth band for tolerance, which indicates how accurate the resistor's value is.",

        "For example, a resistor with red, violet, and orange bands would represent 27,000 ohms, or 27 kilo-ohms. Red stands for 2, violet for 7, and orange multiplies the number by 1,000. The fourth band, usually gold or silver, shows how much the value can vary from the stated resistance.",

        "By matching the correct color bands to the required resistance value, we can identify or build resistors that suit specific circuit needs. This process ensures stable performance in electronic devices.",

        "Learning to read resistor color codes is an essential skill in electronics, helping us understand how resistance controls current and contributes to safe and efficient circuit design.",
      ],
      Price: 200,
    },
    level4: {
      Name: "LevelFour",
      problemDialog: [
        "Umm… excuse me! Can you help me with this laser game? It looked super cool, but now I’m stuck!",
        "I pressed the laser button and it went *pew!* but then the beam just bounced off weird and missed the balloon completely.",
        "I tried turning the mirrors, like, a hundred times… but it never hits the right spot.",
        "I really wanna make the laser pop the balloon! That springy thing looks so fun when it goes off.",
        "Can you figure out how to bounce it the right way? I think it’s something about angles… but I don’t get how they work!",
      ],
      messageDialog: [
        "Whoa!! It worked! The laser hit the balloon and it popped just like in the video! That was AWESOME. You’re like a laser master or something. I wanna try the next puzzle now!",
      ],
      CustomerBefore: kid1,
      CustomerAfter: kid2,
      LearningHeading: "Reflection on Straight mirror",
      LearningsDialog: [
        "When light hits a smooth surface like a mirror, it bounces off. This is called reflection. The key rule is: the angle it hits the mirror (called the angle of incidence) is exactly equal to the angle it bounces off (called the angle of reflection).",

        "In this puzzle, the laser beam follows this rule. If a mirror is tilted just right, the laser beam will reflect perfectly and hit the target. But if the angle is even a little off, the beam goes in the wrong direction.",

        "By rotating mirrors and observing the laser path, you learn how light behaves. This helps in understanding real-world optics, like how periscopes, telescopes, and even cat eyes work.",

        "Solving these kinds of puzzles helps build spatial reasoning, understanding of angles, and real physics concepts — all while having fun!",
      ],
      Price: 250,
    },
    level5: {
      Name: "LevelFive",
      problemDialog: [
        "You there! Yes, you. I’ve been hearing a lot about this little 'repair shop' of yours...",
        "Fixing circuits, bouncing lasers, assembling resistors — quite the little scientist now, aren’t we?",
        "But while you're playing technician and puzzle master, may I ask — what about your actual physics homework? Your notebook’s still empty!",
        "You think real learning is just running around solving puzzles? It’s time to prove that you've actually understood what you've been doing.",
        "Sit down. No tools. No dragging mirrors. Just questions — and I expect correct answers. Understood?",
      ],
      messageDialog: [
        "Hmm… well, well. Look at that. You’ve answered them all — and not just correctly, but confidently... Seems like all those puzzles did teach you something after all. I’m proud of you. Keep going. The world needs sharp minds like yours — both curious and disciplined.",
      ],
      CustomerBefore: teacher1,
      CustomerAfter: teacher2,
      LearningHeading: "Concept Recap & Knowledge Check",
      LearningsDialog: [
        "This level serves as a checkpoint to reinforce all major concepts you've learned so far:",

        "From Level 1 — understanding magnetic fields and the right-hand rule when current flows through a wire.",

        "From Level 2 — how lenses form real or virtual images depending on object position and focal length.",

        "From Level 3 — how resistors work, how to decode color bands to calculate resistance, and their role in controlling current.",

        "From Level 4 — how light reflects off mirrors, following the law of reflection (angle in equals angle out), and how laser paths can be manipulated using precise angles.",

        "This quiz tests your core understanding, memory, and application of physics principles — a perfect blend of theory and practice.",
      ],
      Price: 300,
    },
  };

  const hints = {
    level1: [
      "Sometimes even a small change in how things are connected can affect how components behave.",
      "Think about what happens when current flows through a wire near a compass — what does it do to the needle?",
      "Try flipping the battery terminals and observe the compass needle's direction change — that’s the key.",
    ],
    level2: [
      "Getting the image right isn't just about where the lens is — think about where the object is placed too.",
      "Adjust the object's distance until the image sharpens — especially watch what happens when it's very close vs far.",
      "Place the object beyond the focal point of the convex lens to form a sharp real image on the screen.",
    ],
    level3: [
      "These colorful bands aren’t just decoration — they actually represent numbers.",
      "The first two stripes give you digits, and the third one multiplies them. It's like solving a tiny math puzzle.",
      "Use the standard resistor color code: for example, red-violet-orange means 27,000 ohms (27kΩ).",
    ],
    level4: [
      "Mirrors reflect light, sure — but where it goes depends on *how* the mirror is angled.",
      "Think about how a ball bounces off a wall — light follows the same rule: angle in = angle out.",
      "To hit the balloon, rotate mirrors so that the laser beam reflects at just the right angle — trace it like a zigzag path.",
    ],
    level5: [
      "This is your big recap. Think back to what each customer’s problem was really about.",
      "Every puzzle taught you something — magnetic fields, lenses, resistors, reflection — recall how each worked.",
      "Use what you've learned: right-hand rule, image formation, color codes, laser paths — the quiz is testing your understanding, not memory.",
    ],
  };

  useEffect(() => {
    if (showExplanation) {
      playNanoClick();
    }
  }, [showExplanation]);

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
                src={
                  showHappyUncle || showHappyUncleAfterExplanation
                    ? levelProblems[`level${currentLevel}`].CustomerAfter
                    : levelProblems[`level${currentLevel}`].CustomerBefore
                }
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
            {!showDialog &&
              !showHappyUncle &&
              !showHappyUncleAfterExplanation && (
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
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 px-8 py-6 px-6 py-4 w-[70%] z-30 font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.4rem_0_rgba(0,0,0,0.3),inset_0_0.4rem_0_rgba(255,255,255,0.7),inset_0_-0.4rem_0_rgba(0,0,0,0.2)] rounded-[25px] border-radius-smooth text-center">
            <p className="text-2xl mb-4">
              {levelProblems[`level${currentLevel}`].messageDialog[0]}
            </p>
          </div>
        )}

        {/* Happy Uncle After Explanation Message */}
        {showHappyUncleAfterExplanation && gameState === "main" && (
          <div className="absolute top-30 left-1/2 transform -translate-x-1/2 px-8 py-6 max-w-3xl z-30 font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.4rem_0_rgba(0,0,0,0.3),inset_0_0.4rem_0_rgba(255,255,255,0.7),inset_0_-0.4rem_0_rgba(0,0,0,0.2)] rounded-[25px] border-radius-smooth text-center">
            <p className="text-2xl mb-4">Ready for the next challenge!</p>
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
        {/* <button
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
        </button> */}
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
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 px-6 py-4 w-[70%] z-30 font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.4rem_0_rgba(0,0,0,0.3),inset_0_0.4rem_0_rgba(255,255,255,0.7),inset_0_-0.4rem_0_rgba(0,0,0,0.2)] rounded-[25px] border-radius-smooth">
          <p className="text-2xl mb-4">
            {levelProblems[`level${currentLevel}`].problemDialog[dialogIndex]}
          </p>
          {dialogIndex <
          levelProblems[`level${currentLevel}`].problemDialog.length - 1 ? (
            <button
              onClick={handleNextDialog}
              className="px-4 py-2 mb-3 text-xl cursor-pointer hover:scale-110 transition-transform duration-300 ease-out
                    [border-radius:18px] [border-radius-smooth:0.6] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] 
                    bg-gradient-to-b from-[#FEC547] to-[#F3A01C] 
                    shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)]"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSolve}
              className="px-4 py-2 mb-3 text-xl cursor-pointer hover:scale-110 transition-transform duration-300 ease-out
                    [border-radius:18px] [border-radius-smooth:0.6] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] 
                    bg-gradient-to-b from-[#8AEEF5] to-[#22C9D8] 
                    shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,255,255,0.4),inset_0_-0.3rem_0_rgba(0,0,0,0.3)]"
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
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg text-[#632911]">
                    Point {explanationIndex + 1} of{" "}
                    {
                      levelProblems[`level${currentLevel}`].LearningsDialog
                        .length
                    }
                  </span>
                  <div className="flex gap-1">
                    {levelProblems[`level${currentLevel}`].LearningsDialog.map(
                      (_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index <= explanationIndex
                              ? "bg-[#632911]"
                              : "bg-gray-300"
                          }`}
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="w-[60%] mt-10">
                  <p className="text-4xl leading-12 font-[sf-semibold]">
                    {
                      levelProblems[`level${currentLevel}`].LearningsDialog[
                        explanationIndex
                      ]
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex gap-8 items-start">
                {/* Text Content */}

                {/* Character Illustration */}
              </div>
              <div className="absolute right-20 bottom-0 w-[450px] h-auto pointer-events-none ">
                <img
                  src={nanokaka2}
                  alt="Nano Kaka"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Navigation Button - Fixed Position */}
            <div className="absolute bottom-15 left-12 flex gap-6 z-50">
              {/* Back Button */}
              {explanationIndex > 0 && (
                <button
                  onClick={handlePrevExplanation}
                  className="px-3 pr-6 py-3 cursor-pointer flex items-center gap-2
      text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911]
      bg-gradient-to-b from-[#FEC547] to-[#F3A01C]
      shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)]
      rounded-[18px] hover:scale-110 transition-transform duration-300 ease-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[1.4em] w-[1.4em] rotate-180"
                    fill="#D57100"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>BACK</span>
                </button>
              )}

              {/* Next / Final Button */}
              <button
                onClick={() => {
                  if (
                    explanationIndex <
                    levelProblems[`level${currentLevel}`].LearningsDialog
                      .length -
                      1
                  ) {
                    handleNextExplanation();
                  } else {
                    playNanoByeClick();
                    setShowExplanation(false);
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
                    }, 2000);
                  }
                }}
                className="px-3 pl-6 py-3 cursor-pointer flex items-center gap-2
    text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911]
    bg-gradient-to-b from-[#FEC547] to-[#F3A01C]
    shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)]
    rounded-[18px] hover:scale-110 transition-transform duration-300 ease-out"
              >
                <span>
                  {explanationIndex <
                  levelProblems[`level${currentLevel}`].LearningsDialog.length -
                    1
                    ? "NEXT"
                    : "UNDERSTOOD"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[1.4em] w-[1.4em]"
                  fill="#D57100"
                  viewBox="0 0 24 24"
                >
                  <path
                    d={
                      explanationIndex <
                      levelProblems[`level${currentLevel}`].LearningsDialog
                        .length -
                        1
                        ? "M8 5v14l11-7z"
                        : "M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"
                    }
                  />
                </svg>
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
              <p className="text-xl font-[sf-bold] leading-snug mt-2">
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
                  className={`flex flex-col items-center justify-center px-6 py-4 font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b  shadow-[0_0.3rem_0_rgba(0,0,0,0.3),inset_0_0.3rem_0_rgba(255,255,255,0.4),inset_0_-0.3rem_0_rgba(0,0,0,0.2)] rounded-[24px] hover:scale-105 transition-transform duration-300 ease-out ${
                    coins < price
                      ? "from-[#e5e5e5] to-[#bdbdbd] opacity-50 cursor-not-allowed"
                      : "from-[#ffe195] to-[#ffc739] cursor-pointer"
                  }`}
                >
                  <img src={bulbIcon} alt="Hint" className="w-16 h-16 mb-1" />
                  <span className="text-lg font-bold">{price}</span>
                </button>
              ))}
            </div>

            {currentHint && (
              <div className="mt-6 p-4 bg-[#FFFAE4] border-2 border-[#E7C796] rounded-[18px] text-[#4A2600]  w-[50%] text-2xl font-[sf-bold] ">
                <strong>Hint</strong> {currentHint}
              </div>
            )}

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
            className="absolute inset-0 bg-cover bg-center z-20"
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
            <h2 className="text-4xl mb-4">
              🎉 Level {currentLevel} Complete! 🎉
            </h2>
            <p className="text-xl mb-6">
              You have successfully completed Level {currentLevel}!
            </p>
            <p className="text-lg">
              You earned {levelProblems[`level${currentLevel}`].Price} coins!
            </p>
          </div>
        </div>
      )}

      {gameState === "completed" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="p-14 px-16 pb-7 w-[600px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-2xl text-center">
            <h2 className="text-4xl mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-xl mb-6">You have completed all levels!</p>
            <p className="text-lg">
              You are now a little master of Physics concepts!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
