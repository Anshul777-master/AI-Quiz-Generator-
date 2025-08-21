
import React, { useState, useCallback } from 'react';
import { QuizData, UserAnswers } from './types';
import { generateQuiz, QuizSource } from './services/geminiService';
import Header from './components/Header';
import TopicInputForm from './components/TopicInputForm';
import QuizDisplay from './components/QuizDisplay';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

type AppState = 'idle' | 'loading' | 'quiz' | 'results' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = useCallback(async (source: QuizSource) => {
    setAppState('loading');
    setError(null);
    setQuizData(null);
    setUserAnswers({});
    try {
      const data = await generateQuiz(source);
      setQuizData(data);
      setAppState('quiz');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState('error');
    }
  }, []);

  const handleSubmitQuiz = useCallback((answers: UserAnswers) => {
    if (!quizData) return;

    let correctAnswers = 0;
    const totalMcqs = quizData.multiple_choice.length;
    const totalTfs = quizData.true_false.length;

    quizData.multiple_choice.forEach((q, index) => {
      const questionKey = `mcq_${index}`;
      if (answers[questionKey] === q.correct_answer) {
        correctAnswers++;
      }
    });

    quizData.true_false.forEach((q, index) => {
      const questionKey = `tf_${index}`;
      if (answers[questionKey] === q.answer) {
        correctAnswers++;
      }
    });

    setUserAnswers(answers);
    setScore(correctAnswers);
    setAppState('results');
  }, [quizData]);

  const handleReset = useCallback(() => {
    setAppState('idle');
    setQuizData(null);
    setUserAnswers({});
    setScore(0);
    setError(null);
  }, []);
  
  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingSpinner />;
      case 'quiz':
        return quizData && <QuizDisplay quizData={quizData} onSubmit={handleSubmitQuiz} />;
      case 'results':
        return quizData && <ResultsDisplay quizData={quizData} userAnswers={userAnswers} score={score} onReset={handleReset} />;
      case 'error':
        return <ErrorMessage message={error || 'Something went wrong.'} onRetry={handleReset} />;
      case 'idle':
      default:
        return <TopicInputForm onGenerate={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
           <div className="p-6 sm:p-10">
              {renderContent()}
           </div>
        </div>
        <footer className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
