import EntryFlow from "./components/EntryFlow";
import { useEffect, useRef, useState } from "react";
import MainScreen from "./components/MainScreen";
import bgSound from "./assets/sound/bg.mp3";

function BackgroundMusicPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(bgSound);
    audio.volume = 0.2; // Set low volume
    audio.loop = true;
    audioRef.current = audio;

    const playAudio = () => {
      audio.play().catch((e) => {
        // Some browsers block autoplay
        console.warn("Autoplay failed:", e);
      });
    };

    // Try to autoplay once user interacts
    document.body.addEventListener("click", playAudio, { once: true });

    return () => {
      audio.pause();
    };
  }, []);

  return null; // No visual output
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <>
      <BackgroundMusicPlayer />
      <div>
        {!gameStarted ? (
          <EntryFlow onFinish={() => setGameStarted(true)} />
        ) : (
          <MainScreen />
        )}
      </div>
    </>
  );
}

export default App;
