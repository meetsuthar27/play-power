import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Level Design Data ---
// A master list of 15 pre-designed, solvable puzzle layouts.
const masterLevels = [
  // Level 1: Simple S-curve
  {
    laserStart: { x: 100, y: 150 },
    mirrors: [
      { id: "m1", p: { x: 250, y: 150 } },
      { id: "m2", p: { x: 500, y: 350 } },
      { id: "m3", p: { x: 750, y: 350 } },
    ],
    targetBalloon: { position: { x: 900, y: 150 }, radius: 30 },
  },
  // Level 2: Downward bounce
  {
    laserStart: { x: 100, y: 450 },
    mirrors: [
      { id: "m1", p: { x: 300, y: 450 } },
      { id: "m2", p: { x: 300, y: 200 } },
      { id: "m3", p: { x: 700, y: 200 } },
    ],
    targetBalloon: { position: { x: 700, y: 500 }, radius: 30 },
  },
  // Level 3: Upward angle
  {
    laserStart: { x: 100, y: 500 },
    mirrors: [
      { id: "m1", p: { x: 350, y: 350 } },
      { id: "m2", p: { x: 600, y: 500 } },
      { id: "m3", p: { x: 800, y: 200 } },
    ],
    targetBalloon: { position: { x: 500, y: 150 }, radius: 30 },
  },
  // Level 4: Crossing paths
  {
    laserStart: { x: 100, y: 100 },
    mirrors: [
      { id: "m1", p: { x: 800, y: 100 } },
      { id: "m2", p: { x: 800, y: 500 } },
      { id: "m3", p: { x: 200, y: 500 } },
    ],
    targetBalloon: { position: { x: 200, y: 300 }, radius: 30 },
  },
  // Level 5: Tight corners
  {
    laserStart: { x: 100, y: 300 },
    mirrors: [
      { id: "m1", p: { x: 200, y: 300 } },
      { id: "m2", p: { x: 200, y: 400 } },
      { id: "m3", p: { x: 800, y: 400 } },
    ],
    targetBalloon: { position: { x: 800, y: 100 }, radius: 30 },
  },
  // Level 6: Central bounce
  {
    laserStart: { x: 100, y: 120 },
    mirrors: [
      { id: "m1", p: { x: 500, y: 480 } },
      { id: "m2", p: { x: 850, y: 120 } },
      { id: "m3", p: { x: 500, y: 120 } },
    ],
    targetBalloon: { position: { x: 200, y: 480 }, radius: 30 },
  },
  // Level 7: Long shot
  {
    laserStart: { x: 100, y: 500 },
    mirrors: [
      { id: "m1", p: { x: 200, y: 100 } },
      { id: "m2", p: { x: 800, y: 100 } },
      { id: "m3", p: { x: 800, y: 500 } },
    ],
    targetBalloon: { position: { x: 900, y: 500 }, radius: 30 },
  },
  // Level 8: Diagonal challenge
  {
    laserStart: { x: 100, y: 100 },
    mirrors: [
      { id: "m1", p: { x: 300, y: 300 } },
      { id: "m2", p: { x: 500, y: 100 } },
      { id: "m3", p: { x: 700, y: 300 } },
    ],
    targetBalloon: { position: { x: 900, y: 100 }, radius: 30 },
  },
  // Level 9: The Needle's Eye
  {
    laserStart: { x: 100, y: 300 },
    mirrors: [
      { id: "m1", p: { x: 400, y: 150 } },
      { id: "m2", p: { x: 400, y: 450 } },
      { id: "m3", p: { x: 800, y: 300 } },
    ],
    targetBalloon: { position: { x: 900, y: 300 }, radius: 30 },
  },
  // Level 10: Ricochet
  {
    laserStart: { x: 100, y: 500 },
    mirrors: [
      { id: "m1", p: { x: 800, y: 500 } },
      { id: "m2", p: { x: 500, y: 250 } },
      { id: "m3", p: { x: 200, y: 500 } },
    ],
    targetBalloon: { position: { x: 150, y: 150 }, radius: 30 },
  },
  // Level 11
  {
    laserStart: { x: 100, y: 250 },
    mirrors: [
      { id: "m1", p: { x: 250, y: 450 } },
      { id: "m2", p: { x: 550, y: 400 } },
      { id: "m3", p: { x: 850, y: 150 } },
    ],
    targetBalloon: { position: { x: 600, y: 100 }, radius: 30 },
  },
  // Level 12
  {
    laserStart: { x: 100, y: 100 },
    mirrors: [
      { id: "m1", p: { x: 300, y: 500 } },
      { id: "m2", p: { x: 600, y: 100 } },
      { id: "m3", p: { x: 800, y: 500 } },
    ],
    targetBalloon: { position: { x: 900, y: 200 }, radius: 30 },
  },
  // Level 13
  {
    laserStart: { x: 100, y: 550 },
    mirrors: [
      { id: "m1", p: { x: 250, y: 250 } },
      { id: "m2", p: { x: 500, y: 500 } },
      { id: "m3", p: { x: 750, y: 250 } },
    ],
    targetBalloon: { position: { x: 900, y: 400 }, radius: 30 },
  },
  // Level 14
  {
    laserStart: { x: 100, y: 300 },
    mirrors: [
      { id: "m1", p: { x: 200, y: 100 } },
      { id: "m2", p: { x: 500, y: 300 } },
      { id: "m3", p: { x: 800, y: 100 } },
    ],
    targetBalloon: { position: { x: 900, y: 500 }, radius: 30 },
  },
  // Level 15: The Finale
  {
    laserStart: { x: 100, y: 50 },
    mirrors: [
      { id: "m1", p: { x: 500, y: 550 } },
      { id: "m2", p: { x: 850, y: 300 } },
      { id: "m3", p: { x: 200, y: 150 } },
    ],
    targetBalloon: { position: { x: 850, y: 50 }, radius: 30 },
  },
].map((level) => ({
  ...level,
  mirrors: level.mirrors.map((m) => ({
    ...m,
    initialRotation: Math.random() * 360,
    length: 100,
    position: m.p,
  })),
}));

// --- Game Configuration ---
const gameData = {
  timerStart: 120,
  bounds: { width: 1000, height: 600 },
  levelsPerGame: 3,
};

// --- UI Styles ---
const uiStyles = {
  container:
    "absolute z-30  top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-[1.7rem] p-6 flex flex-col items-center gap-4 select-none w-full max-w-5xl mx-auto",
  text: "font-sans font-bold text-[#632911]",
  button:
    "px-4 py-3 cursor-pointer flex items-center gap-2 text-xl font-bold text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FEC547] to-[#F3A01C] shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)] rounded-[18px] hover:scale-110 transition-transform duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed",
};

// --- Physics & Geometry Helpers ---
const V = {
  add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),
  sub: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),
  scale: (v, s) => ({ x: v.x * s, y: v.y * s }),
  dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y,
};
const degToRad = (deg) => deg * (Math.PI / 180);

function getLineIntersection(p1, p2, p3, p4) {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (d === 0) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  const u =
    -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / d;
  if (t > 0.0001 && u >= 0 && u <= 1) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
      dist: t,
    };
  }
  return null;
}

function getCircleIntersection(p1, dir, circle) {
  const p1c = V.sub(p1, circle.position);
  const a = V.dot(dir, dir);
  const b = 2 * V.dot(dir, p1c);
  const c = V.dot(p1c, p1c) - circle.radius * circle.radius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const sqrtD = Math.sqrt(discriminant);
  const t1 = (-b - sqrtD) / (2 * a);
  if (t1 > 0.0001)
    return { x: p1.x + t1 * dir.x, y: p1.y + t1 * dir.y, dist: t1 };
  return null;
}

// --- Child Components ---
const Mirror = ({ position, currentRotation, length }) => (
  <div
    className="absolute"
    style={{
      left: position.x,
      top: position.y,
      width: length,
      height: 4,
      transform: `translate(-50%, -50%) rotate(${currentRotation}deg)`,
      background: "linear-gradient(to bottom, #e0e0e0, #ffffff, #e0e0e0)",
      boxShadow: "0 0 10px #fff, 0 0 15px #0ff, 0 0 20px #0ff",
      borderRadius: "2px",
    }}
  />
);

const RotationKnob = ({ onRotateStart }) => (
  <div
    className="absolute w-6 h-6 bg-yellow-500 rounded-full border-2 border-yellow-700 cursor-grab active:cursor-grabbing"
    style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
    onMouseDown={onRotateStart}
    onTouchStart={onRotateStart}
  />
);

// --- Main Game Component ---
export const LevelFour = ({ onComplete = () => {} }) => {
  const [gameLevels, setGameLevels] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [mirrorRotations, setMirrorRotations] = useState({});
  const [timer, setTimer] = useState(gameData.timerStart);
  const [gameState, setGameState] = useState("idle");
  const [laserPath, setLaserPath] = useState([]);

  const rotatingMirrorRef = useRef(null);
  const gameAreaRef = useRef(null);
  const hasWonRound = useRef(false);

  // Memoize the current level to prevent re-renders from affecting it
  const currentLevel = useMemo(
    () => gameLevels[currentLevelIndex],
    [gameLevels, currentLevelIndex]
  );

  // --- Game State Effects ---
  useEffect(() => {
    if (gameState !== "playing" || timer <= 0) {
      if (timer <= 0) setGameState("lost");
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [gameState, timer]);

  // --- Rotation Logic ---
  const getPointerAngle = useCallback(
    (e) => {
      if (!currentLevel) return 0;
      const mirrorConf = currentLevel.mirrors.find(
        (m) => m.id === rotatingMirrorRef.current.id
      );
      if (!mirrorConf || !gameAreaRef.current) return 0;
      const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
      const pointer = e.touches ? e.touches[0] : e;
      const mirrorX = gameAreaRect.left + mirrorConf.position.x;
      const mirrorY = gameAreaRect.top + mirrorConf.position.y;
      return (
        (Math.atan2(pointer.clientY - mirrorY, pointer.clientX - mirrorX) *
          180) /
        Math.PI
      );
    },
    [currentLevel]
  );

  const handleRotateStart = useCallback(
    (e, id) => {
      e.preventDefault();
      if (gameState !== "playing") return;
      rotatingMirrorRef.current = { id };
      const startPointerAngle = getPointerAngle(e);
      rotatingMirrorRef.current = {
        id,
        startAngle: mirrorRotations[id],
        startPointerAngle,
      };
    },
    [gameState, mirrorRotations, getPointerAngle]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!rotatingMirrorRef.current || gameState !== "playing") return;
      const currentPointerAngle = getPointerAngle(e);
      const angleDiff =
        currentPointerAngle - rotatingMirrorRef.current.startPointerAngle;
      const newAngle =
        (rotatingMirrorRef.current.startAngle + angleDiff + 360) % 360;
      setMirrorRotations((prev) => ({
        ...prev,
        [rotatingMirrorRef.current.id]: newAngle,
      }));
    },
    [gameState, getPointerAngle]
  );

  const handlePointerUp = useCallback(() => {
    rotatingMirrorRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove);
    window.addEventListener("touchend", handlePointerUp);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // --- Laser Calculation wrapped in useCallback ---
  const calculatePath = useCallback(() => {
    if (!currentLevel || !mirrorRotations)
      return { path: [], hitBalloon: false };

    let currentPos = { ...currentLevel.laserStart };
    let currentDir = { x: 1, y: 0 };
    const path = [currentPos];
    let reflections = 0;
    const MAX_REFLECTIONS = 10;
    const hitMirrors = new Set();

    while (reflections < MAX_REFLECTIONS) {
      let closestIntersection = null;

      currentLevel.mirrors.forEach((mirror) => {
        if (hitMirrors.has(mirror.id) || !mirrorRotations[mirror.id]) return;
        const angleRad = degToRad(mirrorRotations[mirror.id]);
        const halfLen = mirror.length / 2;
        const p1 = {
          x: mirror.position.x - halfLen * Math.cos(angleRad),
          y: mirror.position.y - halfLen * Math.sin(angleRad),
        };
        const p2 = {
          x: mirror.position.x + halfLen * Math.cos(angleRad),
          y: mirror.position.y + halfLen * Math.sin(angleRad),
        };
        const intersection = getLineIntersection(
          currentPos,
          V.add(currentPos, V.scale(currentDir, 5000)),
          p1,
          p2
        );
        if (
          intersection &&
          (!closestIntersection || intersection.dist < closestIntersection.dist)
        ) {
          closestIntersection = { ...intersection, type: "mirror", mirror };
        }
      });

      const balloonHit = getCircleIntersection(
        currentPos,
        currentDir,
        currentLevel.targetBalloon
      );
      if (
        balloonHit &&
        (!closestIntersection || balloonHit.dist < closestIntersection.dist)
      ) {
        closestIntersection = { ...balloonHit, type: "balloon" };
      }

      if (closestIntersection) {
        path.push({ x: closestIntersection.x, y: closestIntersection.y });
        currentPos = { x: closestIntersection.x, y: closestIntersection.y };

        if (closestIntersection.type === "balloon")
          return { path, hitBalloon: true };

        if (closestIntersection.type === "mirror") {
          hitMirrors.add(closestIntersection.mirror.id);
          const mirrorAngleRad = degToRad(
            mirrorRotations[closestIntersection.mirror.id]
          );
          const normal = {
            x: -Math.sin(mirrorAngleRad),
            y: Math.cos(mirrorAngleRad),
          };
          const dot = 2 * V.dot(currentDir, normal);
          currentDir = V.sub(currentDir, V.scale(normal, dot));
        }
        reflections++;
      } else {
        path.push(V.add(currentPos, V.scale(currentDir, 2000)));
        break;
      }
    }
    return { path, hitBalloon: false };
  }, [currentLevel, mirrorRotations]);

  // --- Real-time Laser Update & Win Check ---
  useEffect(() => {
    if (gameState === "playing" && !hasWonRound.current) {
      const { path, hitBalloon } = calculatePath();
      setLaserPath(path);
      if (hitBalloon) {
        hasWonRound.current = true;
        setGameState("won");
        if (currentLevelIndex + 1 >= gameData.levelsPerGame) {
          onComplete();
        }
      }
    }
  }, [calculatePath, gameState, currentLevelIndex, onComplete]);

  // --- Game Actions ---
  const loadLevel = useCallback((levelIndex, levelsToLoad) => {
    const level = levelsToLoad[levelIndex];
    if (!level) return;
    setGameState("playing");
    setLaserPath([]);
    setTimer(gameData.timerStart);
    setMirrorRotations(
      level.mirrors.reduce(
        (acc, m) => ({ ...acc, [m.id]: m.initialRotation }),
        {}
      )
    );
    hasWonRound.current = false;
  }, []);

  const handleStart = useCallback(() => {
    const shuffled = [...masterLevels].sort(() => 0.5 - Math.random());
    const selectedLevels = shuffled.slice(0, gameData.levelsPerGame);
    setGameLevels(selectedLevels);
    setCurrentLevelIndex(0);
    loadLevel(0, selectedLevels);
  }, [loadLevel]);

  const handleNextRound = useCallback(() => {
    const nextLevel = currentLevelIndex + 1;
    if (nextLevel < gameLevels.length) {
      setCurrentLevelIndex(nextLevel);
      loadLevel(nextLevel, gameLevels);
    }
  }, [currentLevelIndex, gameLevels, loadLevel]);

  const pathString =
    laserPath.length > 0
      ? "M " + laserPath.map((p) => `${p.x} ${p.y}`).join(" L ")
      : "";

  if (!currentLevel) {
    return (
      <div className={uiStyles.container}>
        <h1 className={`${uiStyles.text} text-3xl`}>Laser Mirror Puzzle</h1>
        <button onClick={handleStart} className={uiStyles.button}>
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className={uiStyles.container}>
      <div className="w-full flex justify-between items-center px-4">
        <h1 className={`${uiStyles.text} text-3xl`}>Laser Mirror Puzzle</h1>
        <div className="flex items-center gap-4">
          <h2 className={`${uiStyles.text} text-2xl`}>
            Level: {currentLevelIndex + 1} / {gameData.levelsPerGame}
          </h2>
          <div className={`${uiStyles.text} text-2xl`}>Time: {timer}s</div>
        </div>
      </div>
      <p className={`${uiStyles.text} text-lg text-center`}>
        Guide the laser to the balloon!
      </p>

      <div
        ref={gameAreaRef}
        className="relative w-full max-w-[1000px] h-[600px] bg-[#281a0c] rounded-2xl shadow-inner overflow-hidden"
      >
        <div
          className="absolute w-8 h-8 bg-red-700 rounded-full border-2 border-red-900"
          style={{
            left: currentLevel.laserStart.x,
            top: currentLevel.laserStart.y,
            transform: "translate(-50%, -50%)",
          }}
        />

        {currentLevel.mirrors.map((mirror) => (
          <div
            key={mirror.id}
            className="absolute"
            style={{ left: mirror.position.x, top: mirror.position.y }}
          >
            <Mirror
              position={{ x: 0, y: 0 }}
              currentRotation={mirrorRotations[mirror.id]}
              length={mirror.length}
            />
            <RotationKnob
              onRotateStart={(e) => handleRotateStart(e, mirror.id)}
            />
          </div>
        ))}

        <AnimatePresence>
          {gameState !== "won" && (
            <motion.div
              key={`balloon-${currentLevelIndex}`} // Add a key to ensure re-mount on level change
              className="absolute"
              style={{
                left: currentLevel.targetBalloon.position.x,
                top: currentLevel.targetBalloon.position.y,
                width: currentLevel.targetBalloon.radius * 2,
                height: currentLevel.targetBalloon.radius * 2,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 1, opacity: 1 }}
              exit={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute w-full h-full bg-blue-500 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {(gameState === "playing" || gameState === "won") && pathString && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <path
              d={pathString}
              fill="none"
              stroke={gameState === "won" ? "#00ff00" : "#ff4444"}
              strokeWidth="4"
              strokeLinecap="round"
              style={
                gameState === "won"
                  ? {
                      filter: "drop-shadow(0 0 8px #00ff00)",
                      transition: "stroke 0.3s",
                    }
                  : { filter: "drop-shadow(0 0 8px #ff4444)" }
              }
            />
          </svg>
        )}

        <AnimatePresence>
          {(gameState === "won" || gameState === "lost") && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-6xl font-bold text-white mb-4">
                {gameState === "won"
                  ? currentLevelIndex + 1 >= gameData.levelsPerGame
                    ? "Game Complete!"
                    : "Level Cleared!"
                  : "Time Up!"}
              </h2>
              {gameState === "won" &&
                currentLevelIndex + 1 < gameData.levelsPerGame && (
                  <button onClick={handleNextRound} className={uiStyles.button}>
                    Next Level
                  </button>
                )}
              {gameState === "won" &&
                currentLevelIndex + 1 >= gameData.levelsPerGame && (
                  <button onClick={handleStart} className={uiStyles.button}>
                    Play Again
                  </button>
                )}
              {gameState === "lost" && (
                <button
                  onClick={() => loadLevel(currentLevelIndex, gameLevels)}
                  className={uiStyles.button}
                >
                  Try Again
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-4">
        {gameState === "idle" && (
          <button onClick={handleStart} className={uiStyles.button}>
            Start Game
          </button>
        )}
        {gameState !== "idle" && (
          <button onClick={handleStart} className={uiStyles.button}>
            Reset Game
          </button>
        )}
      </div>
    </div>
  );
};

export default LevelFour;
