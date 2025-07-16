import React, { useState, useEffect } from "react";
import axios from "axios";

const questions = [
  {
    question: "Which category is the most popular on UrbanEdgeMART?",
    options: ["Makeup", "Men's Fashion", "Accessories", "Women's Fashion"],
    answer: "Women's Fashion",
  },
  {
    question: "How often can you use the Daily Spin?",
    options: ["Every 6 hours", "Once a week", "Once a day", "Unlimited"],
    answer: "Once a day",
  },
  {
    question: "What do you earn by reviewing a product?",
    options: ["Cashback", "Coupons", "Reward Points", "Free Gifts"],
    answer: "Reward Points",
  },
];

const MiniQuiz = () => {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setQuestion(randomQuestion);
  }, []);

  const handleAnswer = async (option) => {
  setSelectedOption(option);
  setIsAnswered(true);

  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      "http://localhost:5000/api/challenges/quiz-points",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.message.includes("already")) {
      setFeedback("⚠️ You've already played today’s quiz.");
    } else {
      setFeedback("✅ Correct! +20 points");
    }
  } catch (error) {
    console.error("Error adding quiz points:", error);
    setFeedback("❌ Something went wrong while submitting quiz.");
  }

  if (option !== question.answer) {
    setFeedback(`❌ Oops! Correct answer: ${question.answer}`);
  }
};

  if (!question) return null;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md text-black" >
      <h2 className="text-lg font-bold mb-2 text-indigo-600">🧠 Trivia Time</h2>
      <p className="font-medium mb-4">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`w-full text-left px-4 py-2 rounded-lg border ${
              selectedOption === option
                ? option === question.answer
                  ? "bg-green-200 border-green-400"
                  : "bg-red-200 border-red-400"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <p className="mt-4 font-semibold">{feedback}</p>}
    </div>
  );
};

export default MiniQuiz;
