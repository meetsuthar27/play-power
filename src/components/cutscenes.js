import cutscene1 from "../assets/cutscene1.avif";
import cutscene2 from "../assets/cutscene2.avif";
import cutscene3 from "../assets/cutscene3.avif";
import cutscene4 from "../assets/cutscene4.avif";
import cutscene5 from "../assets/cutscene5.avif";
import finalStart from "../assets/final.avif";

// Shared class for text styling
const sharedTextStyles =
  "max-w-lg p-8 text-2xl font-[sf-heavy] leading-tight text-[#632911] " +
  "rounded-[30px] [border-radius:60px] [border-radius-smooth:0.6] " +
  "border-[4px] border-[#632911] " +
  "bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] " +
  "shadow-[0_0.4rem_0_rgba(0,0,0,0.3),inset_0_0.4rem_0_rgba(255,255,255,0.7),inset_0_-0.4rem_0_rgba(0,0,0,0.3)]";

export default [
  {
    bg: cutscene1,
    text: `In a town where machines misbehave more than monkeys… and every chai break sparks a new repairing story…`,
    textBoxClass: "absolute top-10 left-10 " + sharedTextStyles,
  },
  {
    bg: cutscene2,
    text: `Monty runs “Play Power Fix-It” – the town’s most beloved and overworked repair shop. But he’s not just a repair expert. He’s <span class='text-[#DD7E11]'>THE PHYSICS NINJA!</span>`,
    textBoxClass:
      "absolute bottom-10 right-10 flex flex-col items-end text-right " +
      sharedTextStyles,
  },
  {
    bg: cutscene3,
    text: `Monty’s the only one in demand… thanks to his physics brilliance. But now? It’s complete chaos in the town! Madness on Every Megahertz!`,
    textBoxClass: "absolute bottom-10 left-10 " + sharedTextStyles,
  },
  {
    bg: cutscene4,
    text: `Monty’s fried. Tools everywhere, theories on the wall, and equations running in his dreams. <span class='text-[#DD7E11]'>Poor Monty!</span>`,
    textBoxClass:
      "absolute top-10 left-10 max-w-2xl " +
      sharedTextStyles.replace("max-w-lg", ""),
  },
  {
    bg: cutscene5,
    text: `But wait!<br/>Help is here… <span class='text-[#1B8D98]'>Say hello to NANO KAKA!</span><br/> Half man, half machine – a wisdom-loaded, gear-powered bot.<br/>Monty’s troubles are about to vanish faster than a fuse blows!`,
    textBoxClass:
      "absolute bottom-10 right-10 max-w-5xl flex flex-col items-end text-right" +
      sharedTextStyles.replace("max-w-lg", ""),
  },
  {
    bg: finalStart,
    isFinal: true,
    text: `Tools? Ready.<br/>Wires? Tangled.<br/>Brain? Slightly fried, but spirits high!<br/>Let’s dive into the world of physics-powered repairs!`,
    textBoxClass:
      "absolute top-40 max-w-2xl flex flex-col items-center justify-center text-left" +
      sharedTextStyles.replace("max-w-lg", ""),
  },
];
