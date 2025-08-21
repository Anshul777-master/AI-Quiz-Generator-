
import React, { useState } from 'react';
import { QuizData, UserAnswers } from '../types';

interface QuizDisplayProps {
  quizData: QuizData;
  onSubmit: (answers: UserAnswers) => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ quizData, onSubmit }) => {
  const [answers, setAnswers] = useState<UserAnswers>({});

  const handleAnswerChange = (questionKey: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: answer }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };
  
  const totalQuestions = quizData.multiple_choice.length + quizData.true_false.length;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">Your Custom Quiz</h2>
      <form onSubmit={handleSubmit}>
        {quizData.multiple_choice.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 mb-6">Multiple Choice</h3>
            {quizData.multiple_choice.map((q, index) => {
              const questionKey = `mcq_${index}`;
              return (
                <div key={questionKey} className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="font-semibold text-lg mb-4">{index + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((option) => (
                      <label key={option} className={`block p-3 rounded-md cursor-pointer transition-colors ${answers[questionKey] === option ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-600 hover:bg-blue-100 dark:hover:bg-slate-500'}`}>
                        <input
                          type="radio"
                          name={questionKey}
                          value={option}
                          checked={answers[questionKey] === option}
                          onChange={() => handleAnswerChange(questionKey, option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {quizData.true_false.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-semibold border-b-2 border-green-500 pb-2 mb-6">True or False</h3>
            {quizData.true_false.map((q, index) => {
              const questionKey = `tf_${index}`;
              return (
                <div key={questionKey} className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="font-semibold text-lg mb-4">{index + 1}. {q.question}</p>
                  <div className="flex gap-4">
                    {['True', 'False'].map((option) => (
                      <label key={option} className={`flex-1 text-center p-3 rounded-md cursor-pointer transition-colors ${answers[questionKey] === option ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-600 hover:bg-green-100 dark:hover:bg-slate-500'}`}>
                        <input
                          type="radio"
                          name={questionKey}
                          value={option}
                          checked={answers[questionKey] === option}
                          onChange={() => handleAnswerChange(questionKey, option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <button 
            type="submit"
            disabled={answeredQuestions < totalQuestions}
            className="w-full sm:w-auto px-8 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Submit Answers
          </button>
          {answeredQuestions < totalQuestions && (
             <p className="text-sm text-slate-500 mt-2">Please answer all {totalQuestions} questions to submit.</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizDisplay;
