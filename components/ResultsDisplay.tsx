
import React from 'react';
import { QuizData, UserAnswers } from '../types';

interface ResultsDisplayProps {
  quizData: QuizData;
  userAnswers: UserAnswers;
  score: number;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ quizData, userAnswers, score, onReset }) => {
  const totalQuestions = quizData.multiple_choice.length + quizData.true_false.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getResultClasses = (isCorrect: boolean) => 
    isCorrect ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : 'bg-red-100 dark:bg-red-900/50 border-red-500';

  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold mb-4">Quiz Results</h2>
      <div className="p-8 bg-blue-50 dark:bg-slate-700 rounded-xl mb-8">
        <p className="text-xl text-slate-700 dark:text-slate-300">You scored</p>
        <p className="text-7xl font-bold text-blue-600 dark:text-blue-400 my-2">{score} / {totalQuestions}</p>
        <p className="text-2xl font-semibold text-slate-800 dark:text-slate-200">({percentage}%)</p>
      </div>
      
      <div className="text-left space-y-6">
        {quizData.multiple_choice.map((q, index) => {
          const questionKey = `mcq_${index}`;
          const userAnswer = userAnswers[questionKey];
          const isCorrect = userAnswer === q.correct_answer;
          return (
            <div key={questionKey} className={`p-4 border-l-4 rounded-r-lg ${getResultClasses(isCorrect)}`}>
              <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
              <p className={`text-sm ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                Your answer: {userAnswer || 'Not answered'}
              </p>
              {!isCorrect && <p className="text-sm text-green-800 dark:text-green-300 font-bold">Correct answer: {q.correct_answer}</p>}
            </div>
          );
        })}
        
        {quizData.true_false.map((q, index) => {
          const questionKey = `tf_${index}`;
          const userAnswer = userAnswers[questionKey];
          const isCorrect = userAnswer === q.answer;
          return (
            <div key={questionKey} className={`p-4 border-l-4 rounded-r-lg ${getResultClasses(isCorrect)}`}>
              <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
              <p className={`text-sm ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                Your answer: {userAnswer || 'Not answered'}
              </p>
              {!isCorrect && <p className="text-sm text-green-800 dark:text-green-300 font-bold">Correct answer: {q.answer}</p>}
            </div>
          );
        })}
      </div>

      <button
        onClick={onReset}
        className="mt-10 px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
      >
        Create Another Quiz
      </button>
    </div>
  );
};

export default ResultsDisplay;
