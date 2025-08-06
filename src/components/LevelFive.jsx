import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LevelFive({ onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showInitialPopup, setShowInitialPopup] = useState(true);

  const quizQuestions = [
    {
      question:
        "When current flows through a wire, what happens to a compass needle placed nearby?",
      options: [
        "It spins continuously in circles",
        "It aligns with the magnetic field created by the current",
        "It points to the north pole only",
        "Nothing happens to the needle",
      ],
      correctAnswer: 1,
      explanation:
        "When electric current flows through a wire, it creates a magnetic field around the wire. The compass needle, being magnetic, aligns itself with this magnetic field. This is a fundamental principle of electromagnetism and follows the right-hand rule.",
    },
    {
      question:
        "In optics, when an object is placed beyond the focal point of a convex lens, what type of image is formed?",
      options: [
        "Virtual, upright, and magnified",
        "Real, inverted, and can be projected on screen",
        "No image is formed",
        "Virtual, inverted, and smaller",
      ],
      correctAnswer: 1,
      explanation:
        "When an object is placed beyond the focal point of a convex lens, it forms a real, inverted image that can be projected onto a screen. This is how cameras, projectors, and telescopes work. The image is on the opposite side of the lens from the object.",
    },
    {
      question:
        "What does the third color band on a 4-band resistor represent?",
      options: [
        "The first digit of resistance value",
        "The tolerance or accuracy",
        "The multiplier (number of zeros)",
        "The second digit of resistance value",
      ],
      correctAnswer: 2,
      explanation:
        "In a 4-band resistor color code, the third band represents the multiplier - essentially the number of zeros to add after the first two digits. For example, if the third band is orange (representing 1000), you multiply the first two digits by 1000.",
    },
    {
      question:
        "According to the law of reflection, what is the relationship between the angle of incidence and angle of reflection?",
      options: [
        "Angle of reflection is twice the angle of incidence",
        "They are always 90 degrees apart",
        "They are equal to each other",
        "Angle of incidence is always larger",
      ],
      correctAnswer: 2,
      explanation:
        "The law of reflection states that the angle of incidence equals the angle of reflection. Both angles are measured from the normal (perpendicular line) to the surface. This principle is fundamental in optics and explains how mirrors, periscopes, and laser systems work.",
    },
    {
      question:
        "If a resistor has color bands Red-Violet-Orange-Gold, what is its resistance value?",
      options: [
        "270 ohms ± 5%",
        "27,000 ohms ± 5%",
        "2,700 ohms ± 10%",
        "270,000 ohms ± 5%",
      ],
      correctAnswer: 1,
      explanation:
        "Red = 2, Violet = 7, Orange = ×1000 (multiplier), Gold = ±5% tolerance. So the resistance is 27 × 1000 = 27,000 ohms (27 kΩ) with ±5% tolerance. This color code system is standardized worldwide for resistor identification.",
    },
  ];

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex) => {
    if (showExplanation) return;

    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  const getOptionClass = (optionIndex) => {
    if (!showExplanation) {
      return selectedOption === optionIndex
        ? "border-blue-500 bg-blue-100"
        : "border-[#E7C796] bg-[#FFFAE4] hover:border-[#f0a83c] hover:bg-[#ffcd83]";
    }

    if (optionIndex === currentQuestion.correctAnswer) {
      return "border-green-500 bg-green-100";
    }

    if (
      selectedOption === optionIndex &&
      optionIndex !== currentQuestion.correctAnswer
    ) {
      return "border-red-500 bg-red-100";
    }

    return "border-[#E7C796] bg-[#FFFAE4]";
  };

  if (showInitialPopup) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-60">
        <div className="relative flex flex-col justify-between items-center p-14 px-16 pb-20 w-[1000px] h-[500px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-[1.7rem] text-center">
          <div>
            <h1 className="text-5xl font-[sf-heavy] mb-6">
              <span className="text-[#d38200] mr-4">Level 5 </span> Knowledge
              Quiz
            </h1>
            <p className="leading-snug px-6 font-[sf-bold]">
              Time to test your understanding! Answer questions about
              <br />
              <strong>magnetism, optics, resistors, and reflection</strong>
              <br />
              from your previous adventures. Ready to prove your expertise?
            </p>
          </div>
          <button
            onClick={() => setShowInitialPopup(false)}
            className="px-4 py-3 cursor-pointer flex items-center gap-2
              text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911]
              bg-gradient-to-b from-[#FEC547] to-[#F3A01C] 
              shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)] 
              rounded-[18px] hover:scale-110 transition-transform duration-300 ease-out"
          >
            <span>START QUIZ</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[1.4em] w-[1.4em]"
              fill="#D57100"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-60">
        <div className="p-14 px-16 pb-16 w-[800px] font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] text-2xl text-center">
          <h2 className="text-4xl mb-6">🎉 Quiz Completed! 🎉</h2>
          <p className="text-3xl mb-4">
            Your Score: {score}/{quizQuestions.length}
          </p>
          <p className="text-xl">
            {score === quizQuestions.length
              ? "Perfect! You've mastered all the concepts!"
              : score >= quizQuestions.length * 0.8
              ? "Excellent! Great understanding of the concepts!"
              : score >= quizQuestions.length * 0.6
              ? "Good job! Keep practicing to improve!"
              : "Keep learning! Review the concepts and try again!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-40 w-full h-full flex items-center justify-center">
      <div className="p-8 font-[sf-bold] text-[#632911] border-[3.5px] border-[#632911] bg-gradient-to-b from-[#FFFAE4] to-[#E7C796] shadow-[0_0.6rem_0_rgba(0,0,0,0.3),inset_0_0.6rem_0_rgba(255,255,255,0.7),inset_0_-0.6rem_0_rgba(0,0,0,0.2)] rounded-[35px] max-w-4xl w-full mx-4">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg ">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
            <span className="text-lg">
              Score {score}/{quizQuestions.length}
            </span>
          </div>
          <div className="w-full bg-[#ffe0ad] rounded-full h-2">
            <div
              className="bg-[#F3A01C] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl mb-8 text-center leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={showExplanation}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 text-lg ${getOptionClass(
                index
              )} ${
                showExplanation
                  ? "cursor-default"
                  : "cursor-pointer hover:scale-[1.02]"
              }`}
            >
              <span className="font-bold mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 p-4 bg-[#feeed6] border-l-4 border-[#e89a26] rounded-xl"
          >
            <h3 className="font-bold text-lg mb-2">
              {selectedOption === currentQuestion.correctAnswer
                ? "✅ Correct!"
                : "❌ Incorrect"}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}

        {/* Next Button */}
        {showExplanation && (
          <div className="flex justify-center">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 uppercase cursor-pointer flex items-center gap-2
        text-xl font-[sf-heavy] text-[#632911] border-[3.5px] border-[#632911]
        bg-gradient-to-b from-[#FEC547] to-[#F3A01C] 
        shadow-[0_0.3rem_0_rgba(62,22,1,1),inset_0_0.3rem_0_rgba(255,246,133,0.5),inset_0_-0.3rem_0_rgba(207,102,8,0.6)] 
        rounded-[18px] [border-radius-smooth:0.6] hover:scale-110 transition-transform duration-300 ease-out"
            >
              {currentQuestionIndex < quizQuestions.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
