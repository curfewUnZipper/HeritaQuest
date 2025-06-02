'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import {
  updateUserResponse,
  incrementScore,
  submitFinalQuiz,
} from '../../store/quizSlice';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function Quiz() {
  const questions = useTypedSelector((state) => state.quiz.questions);
  const status = useTypedSelector((state) => state.quiz.status);
  const marks = useTypedSelector((state) => state.quiz.quizScore);
  const id = useTypedSelector((state) => state.quiz.quizId);
  const response = useTypedSelector((state) => state.quiz.userResponses);
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);

  if (status === 'loading') return <div>Loading quiz...</div>;
  if (status === 'failed') return <div>Failed to load quiz.</div>;
  if (!questions.length) return <div>No questions loaded.</div>;

  const handleAnswerOption = (index: number, isCorrect: boolean) => {
    if (answered) return;

    setAnswered(true);
    setSelectedAnswer(index);

    const userResponse = questions[currentQuestion].answerOptions[index].answerText;
    const questionId = questions[currentQuestion].id;

    dispatch(updateUserResponse({ questionId, userResponse }));

    if (isCorrect) {
      dispatch(incrementScore());
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 === questions.length) {
      const userResp: { [key: string]: string } = {};
      questions.forEach((q) => {
        if (response[q.id]) {
          userResp[q.id] = response[q.id];
        }
      });

      if (id) {
        dispatch(submitFinalQuiz({ id, marks, response }));
      }
      setShowScore(true);
      return;
    }

    setAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestion((prev) => prev + 1);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#dfe2fe] via-[#b1cbfa] to-[#dfe2fe]">
      <div className="w-full max-w-lg p-5 shadow-lg rounded-lg text-black bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100">
        <div className="p-2 border text-center font-bold mb-6 text-xl bg-gradient-to-r from-slate-300 via-slate-300 to-slate-300">
          Quiz
        </div>

        {showScore ? (
          <div className="text-center text-lg">
            You scored {marks} out of {questions.length}
          </div>
        ) : (
          <>
            <div className="mb-4 text-lg font-semibold">{questions[currentQuestion].questionText}</div>
            {questions[currentQuestion].answerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOption(index, option.isCorrect)}
                className={`block w-full p-2 mt-2 rounded border
                  ${
                    answered
                      ? option.isCorrect
                        ? 'bg-green-500 text-white'
                        : index === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : ''
                      : ''
                  }
                  `}
                disabled={answered}
              >
                {option.answerText}
              </button>
            ))}

            <button
              onClick={nextQuestion}
              disabled={!answered}
              className={`block w-full text-white p-2 rounded mt-2 ${
                answered ? 'bg-green-500' : 'bg-green-300 cursor-not-allowed'
              }`}
            >
              {currentQuestion + 1 === questions.length ? 'Submit' : 'Next Question'}
            </button>

            <p className="text-center text-gray-400 text-sm mt-1">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
